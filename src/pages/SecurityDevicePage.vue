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
          <tr v-for="item in filteredSIZ" :key="item.id">
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
import { mapState, mapActions, mapGetters } from "vuex";

export default {
  name: "SecurityDevicePage",
  components: {
    FiltersComponent,
  },
  data() {
    return {
      filteredSIZ: [], // Для фильтрованных данных
    };
  },
  computed: {
    ...mapGetters(["allSIZItems"]),
    // Получаем данные из хранилища Vuex

    // Динамическое заполнение выпадающих списков
    uniqueLocations() {
      if (!Array.isArray(this.allSIZItems)) {
        console.error("allSIZItems is not an array", this.allSIZItems);
        return [];
      }
      return [...new Set(this.allSIZItems.map((item) => item.location))];
    },
    uniqueTypes() {
      return [...new Set(this.allSIZItems.map((item) => item.type))];
    },
    uniqueVoltageClasses() {
      return [...new Set(this.allSIZItems.map((item) => item.voltageClass))];
    },
  },
  mounted() {
    this.loadallSIZItems();
    // Загружаем данные при монтировании компонента
  },
  watch: {
    allSIZItems() {
      this.filteredSIZ = this.allSIZItems; // Обновляем данные для отображения при изменении state
      this.calculateQuantityByClass();
    },
  },
  methods: {
    ...mapActions(["loadSIZItems", "deleteSIZ"]), // Экшены для загрузки и удаления данных

    //Обновление данныx
    async loadData() {
      try {
        // Вызов экшена Vuex для загрузки данных
        await this.loadSIZItems();
        console.log("Данные успешно обновлены");
      } catch (error) {
        console.error("Ошибка при обновлении данных", error);
      }
    },

    // Форматирование данных перед отображением
    formatDate(date) {
      if (!date) return "";
      const options = { year: "numeric", month: "2-digit", day: "2-digit" };
      return new Date(date).toLocaleDateString("ru-RU", options);
    },
    // Фильтрация данных
    handleFilterChange(filters) {
      this.$store.dispatch("applyFilters", filters);

      this.calculateQuantityByClass(); // Обновление расчета количества СЗ по классам
    },
    calculateQuantityByClass() {
      if (Array.isArray(this.filteredSIZ)) {
        const quantityByClass = {};

        // Подсчет количества по классам напряжения и местонахождению
        console.log("filteredSIZ:", this.filteredSIZ);

        this.filteredSIZ.forEach((item) => {
          const key = `${item.type}_${item.voltageClass}_${item.location}`;
          if (!quantityByClass[key]) {
            quantityByClass[key] = 0;
          }
          quantityByClass[key] += parseInt(item.quantity, 10);
        });

        // Применение данных обратно в объект filteredSIZ
        this.filteredSIZ = this.filteredSIZ.map((item) => {
          const key = `${item.type}_${item.voltageClass}_${item.location}`;
          return {
            ...item,
            quantityByClass: quantityByClass[key],
          };
        });
      } else {
        console.error("filteredSIZ is not an array", this.filteredSIZ);
      }
    },
    editSIZ(item) {
      this.$router.push({ name: "Edit Device", query: { id: item.id } });
      // Переход на страницу редактирования с передачей ID
    },
    // Удаление элемента
    async deleteSIZ(item) {
      if (confirm(`Вы уверены, что хотите удалить ${item.type}?`)) {
        await this.deleteSIZ(item.id);
        this.handleFilterChange(); // Обновляем фильтрованные данные
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
