<template>
  <div class="siz-inventory">
    <h1>Учет средств индивидуальной защиты</h1>
    <!-- Компонент фильтров -->
    <FiltersComponent
      :locations="uniqueLocations"
      :types="uniqueTypes"
      :voltageClasses="uniqueVoltageClasses"
      @filterChanged="handleFilterChange"
    />
    <div style="overflow-y: scroll; max-height: 100vh">
      <button @click="loadData">Обновить данные</button>
      <!-- Таблица СИЗ -->
      <table>
        <thead>
          <tr>
            <th>Местонахождение</th>
            <th>Вид СЗ</th>
            <th>Класс напряжения (кВ)</th>
            <th>Тип СЗ</th>
            <th>№ СЗ</th>
            <th>Дата испытания</th>
            <th>Дата следующего испытания</th>
            <th>Дата последнего осмотра</th>
            <th>Кол-во</th>
            <th>Кол-во по классам</th>
            <th>Примечания</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in filteredSIZItems" :key="item.id">
            <td>{{ item.location }}</td>
            <td>{{ item.type }}</td>
            <td>{{ item.voltageClass }}</td>
            <td>{{ item.szType }}</td>
            <td>{{ item.number }}</td>
            <td>{{ formatDate(item.testDate) }}</td>
            <td>{{ formatDate(item.nextTestDate) }}</td>
            <td>{{ formatDate(item.lastInspectDate) }}</td>
            <td>{{ item.quantity }}</td>
            <td>{{ item.quantityByClass }}</td>
            <td>{{ item.note }}</td>
            <td>
              <button @click="editSIZ(item)">Редактировать</button>
              <button @click="deleteSIZ(item)">Удалить</button>
            </td>
          </tr>
        </tbody>
      </table>
      <button @click="loadData">Обновить данные</button>
    </div>
  </div>
</template>

<script>
import FiltersComponent from "../components/FiltersComponent.vue";
import { mapGetters, mapActions } from "vuex";

export default {
  name: "SecurityDevicePage",
  components: {
    FiltersComponent,
  },
  mounted() {
    this.loadData(); // Загружаем данные при монтировании компонента
  },
  computed: {
    ...mapGetters(["getSizItems", "getFilteredSizItems"]),
    filteredSIZItems() {
      return this.getFilteredSizItems.length > 0
        ? this.getFilteredSizItems
        : this.getSizItems;
    },
    // Динамическое заполнение выпадающих списков
    uniqueLocations() {
      return [...new Set(this.getSizItems.map((item) => item.location))];
    },
    uniqueTypes() {
      return [...new Set(this.getFilteredSizItems.map((item) => item.type))];
    },
    uniqueVoltageClasses() {
      return [
        ...new Set(this.getFilteredSizItems.map((item) => item.voltageClass)),
      ];
    },
    filteredSIZ() {
      return this.sizItems; // Используем данные напрямую из Vuex
    },
  },
  methods: {
    ...mapActions(["loadSIZItems", "deleteSIZ", "applyFilters"]),

    // Обновление данных
    async loadData() {
      if (!this.getSizItems.length) {
        try {
          await this.loadSIZItems(); // Загружаем данные через Vuex
          console.log("Данные успешно обновлены");
        } catch (error) {
          console.error("Ошибка при обновлении данных", error);
        }
      } else {
        console.log("Данные уже загружены, обновление не требуется");
      }
    },

    // Форматирование дат
    formatDate(date) {
      if (!date) return "";
      const options = { year: "numeric", month: "2-digit", day: "2-digit" };
      return new Date(date).toLocaleDateString("ru-RU", options);
    },

    // Фильтрация данных
    handleFilterChange(filters) {
      this.applyFilters(filters); // Отправляем фильтры в Vuex
      this.calculateQuantityByClass(); // Обновляем расчет количества по классам
    },

    // Подсчет количества по классам напряжения и местонахождению
    calculateQuantityByClass() {
      const quantityByClass = {};

      this.filteredSIZ.forEach((item) => {
        const key = `${item.type}_${item.voltageClass}_${item.location}`;
        if (!quantityByClass[key]) {
          quantityByClass[key] = 0;
        }
        quantityByClass[key] += parseInt(item.quantity, 10);
      });

      // Обновляем данные с расчетом количества по классам
      this.filteredSIZ = this.filteredSIZ.map((item) => {
        const key = `${item.type}_${item.voltageClass}_${item.location}`;
        return {
          ...item,
          quantityByClass: quantityByClass[key],
        };
      });
    },

    // Редактирование элемента
    editSIZ(item) {
      this.$router.push({ name: "Edit Device", query: { id: item.id } }); // Переход на страницу редактирования
    },

    // Удаление элемента
    async deleteSIZ(item) {
      if (confirm(`Вы уверены, что хотите удалить ${item.type}?`)) {
        await this.deleteSIZ(item.id); // Удаляем элемент через Vuex
        await this.loadData();
      }
    },
  },
};
</script>

<style scoped>
h1 {
  margin-block: 20px;
}
.siz-inventory {
  padding: 20px;
}
.filters {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}
.filters input {
  padding: 8px;
  width: 200px;
}
.filters select {
  padding: 8px;
}
table {
  width: 100%;
  border-collapse: collapse;
}
table th,
table td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}
table th {
  background-color: #f4f4f4;
}
table tbody tr:hover {
  background-color: #f1f1f1;
}
button {
  padding: 6px 12px;
  margin-right: 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
button:hover {
  background-color: #007bff;
  color: white;
}
</style>
