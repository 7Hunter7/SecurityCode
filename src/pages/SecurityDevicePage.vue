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
          <th>Результат осмотра</th>
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
          <td>{{ item.inspectionResult }}</td>
          <td>
            <button @click="editSIZ(item)">Редактировать</button>
            <button @click="deleteSIZ(item)">Удалить</button>
          </td>
        </tr>
      </tbody>
      <tfoot>
        <!-- Строка для подсчета общего количества СИЗ -->
        <tr>
          <td colspan="8" style="text-align: right"><strong>Всего:</strong></td>
          <td>
            <strong>{{ totalQuantity }}</strong>
          </td>
          <td colspan="2"></td>
        </tr>
      </tfoot>
    </table>
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
      return [...new Set(this.filteredSIZItems.map((item) => item.location))];
    },
    uniqueTypes() {
      return [...new Set(this.filteredSIZItems.map((item) => item.type))];
    },
    uniqueVoltageClasses() {
      return [
        ...new Set(this.filteredSIZItems.map((item) => item.voltageClass)),
      ];
    },
    // Подсчет общего количества СИЗ по колонке "Кол-во"
    totalQuantity() {
      return this.filteredSIZItems.reduce((total, item) => {
        return total + parseInt(item.quantity, 10);
      }, 0);
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
      if (!date) return "—";
      const options = { year: "numeric", month: "2-digit", day: "2-digit" };
      return new Date(date).toLocaleDateString("ru-RU", options);
    },

    // Фильтрация данных
    handleFilterChange(filters) {
      let filteredItems = [...this.getSizItems]; //Полный набор данных
      // Фильтр по строке поиска
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        filteredItems = filteredItems.filter((item) =>
          item.type.toLowerCase().includes(searchTerm)
        );
      }
      // Фильтр по местоположению
      if (filters.selectedLocation) {
        filteredItems = filteredItems.filter(
          (item) => item.location === filters.selectedLocation
        );
      }
      // Фильтр по типу СЗ
      if (filters.selectedType) {
        filteredItems = filteredItems.filter(
          (item) => item.type === filters.selectedType
        );
      }
      // Фильтр по классу напряжения
      if (filters.selectedVoltageClass) {
        filteredItems = filteredItems.filter(
          (item) => item.voltageClass === filters.selectedVoltageClass
        );
      }
      // Фильтр по дате испытания "от"
      if (filters.testDateFrom) {
        filteredItems = filteredItems.filter(
          (item) => new Date(item.testDate) >= new Date(filters.testDateFrom)
        );
      }
      // Фильтр по дате испытания "до"
      if (filters.testDateTo) {
        filteredItems = filteredItems.filter(
          (item) => new Date(item.testDate) <= new Date(filters.testDateTo)
        );
      }
      // Применение фильтров в store через мутацию
      this.$store.commit("SET_FILTERED_SIZ_ITEMS", filteredItems);
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
