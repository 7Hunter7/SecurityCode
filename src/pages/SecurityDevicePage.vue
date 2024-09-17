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
  </div>
</template>

<script>
import FiltersComponent from "../components/FiltersComponent.vue";
import axios from "axios"; // Для выполнения HTTP-запросов

export default {
  name: "SecurityDevicePage",
  components: {
    FiltersComponent,
  },
  data() {
    return {
      sizItems: [], // Здесь будут храниться данные
      filteredSIZ: [],
    };
  },
  async mounted() {
    try {
      const response = await axios.get("/api/siz-items"); // Запрос данных
      this.sizItems = response.data; // Сохранение данных в состояние
      this.filteredSIZ = this.sizItems; // Инициализация отображаемых данных
    } catch (error) {
      console.error("Ошибка получения данных:", error);
    }
  },
  computed: {
    // Динамическое заполнение выпадающих списков
    uniqueLocations() {
      return [...new Set(this.sizItems.map((item) => item.location))];
    },
    uniqueTypes() {
      return [...new Set(this.sizItems.map((item) => item.type))];
    },
    uniqueVoltageClasses() {
      return [...new Set(this.sizItems.map((item) => item.voltageClass))];
    },
  },
  mounted() {
    this.calculateQuantityByClass();
  },
  methods: {
    // Форматирование данных перед отображением
    formatDate(date) {
      if (!date) return "";
      const options = { year: "numeric", month: "2-digit", day: "2-digit" };
      return new Date(date).toLocaleDateString("ru-RU", options);
    },
    // Фильтрация данных
    handleFilterChange(filters) {
      this.search = filters.search;
      this.selectedLocation = filters.selectedLocation;
      this.selectedType = filters.selectedType;
      this.selectedVoltageClass = filters.selectedVoltageClass;
      this.testDateFrom = filters.testDateFrom;
      this.testDateTo = filters.testDateTo;

      // Применение фильтров к данным
      this.filteredSIZ = this.sizItems.filter((item) => {
        const matchesSearch = item.type
          .toLowerCase()
          .includes(this.search.toLowerCase());
        const matchesLocation = this.selectedLocation
          ? item.location === this.selectedLocation
          : true;
        const matchesType = this.selectedType
          ? item.type === this.selectedType
          : true;
        const matchesVoltageClass = this.selectedVoltageClass
          ? item.voltageClass === this.selectedVoltageClass
          : true;
        const matchesDateFrom = this.testDateFrom
          ? new Date(item.testDate) >= new Date(this.testDateFrom)
          : true;
        const matchesDateTo = this.testDateTo
          ? new Date(item.testDate) <= new Date(this.testDateTo)
          : true;

        return (
          matchesSearch &&
          matchesLocation &&
          matchesType &&
          matchesVoltageClass &&
          matchesDateFrom &&
          matchesDateTo
        );
      });
      this.calculateQuantityByClass(); // Обновление расчета количества по классам
    },
    calculateQuantityByClass() {
      const quantityByClass = {};

      // Подсчет количества по классам напряжения и местонахождению
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
    },
    editSIZ(item) {
      // Логика редактирования СИЗ
      alert(`Редактировать: ${item.name}`);
    },
    deleteSIZ(item) {
      if (confirm(`Вы уверены, что хотите удалить ${item.name}?`)) {
        this.sizItems = this.sizItems.filter((siz) => siz.id !== item.id);
        this.filterSIZ(); // Обновить фильтрованные данные
      }
    },
  },
};
</script>

<style scoped>
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
