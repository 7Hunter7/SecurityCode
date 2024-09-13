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
          <td>{{ item.testDate }}</td>
          <td>{{ item.nextTestDate }}</td>
          <td>{{ item.lastInspectDate }}</td>
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
import { mapState } from "vuex";

export default {
  name: "SecurityDevicePage",
  components: {
    FiltersComponent,
  },
  data() {
    return {
      filteredSIZ: "",
    };
  },
  computed: {
    ...mapState(["sizItems"]),
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
    // Инициализация фильтрованных данных при загрузке страницы
    this.filteredSIZ = this.sizItems;
  },
  methods: {
    handleFilterChange(filters) {
      // Обновление локального состояния с новыми значениями фильтров
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
    },
    editSIZ(item) {
      // Логика редактирования СИЗ
      alert(`Редактировать: ${item.name}`);
    },
    deleteSIZ(item) {
      // Логика удаления СИЗ
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
