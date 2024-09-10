<template>
  <div class="siz-inventory">
    <h1>Учет средств индивидуальной защиты</h1>

    <!-- Панель поиска и фильтров -->
    <div class="filters">
      <input v-model="search" placeholder="Поиск по СИЗ..." />
      <!-- Фильтр по местонахождению -->
      <select v-model="selectedLocation">
        <option value="">Выберите местонахождение</option>
        <option
          v-for="location in uniqueLocations"
          :key="location"
          :value="location"
        >
          {{ location }}
        </option>
      </select>
      <!-- Фильтр по виду СЗ -->
      <select v-model="selectedType">
        <option value="">Выберите вид СЗ</option>
        <option v-for="type in uniqueTypes" :key="type" :value="type">
          {{ type }}
        </option>
      </select>
      <!-- Фильтр по классу напряжения СЗ -->
      <select v-model="selectedVoltageClass">
        <option value="">Выберите класс напряжения</option>
        <option
          v-for="voltage in voltageClasses"
          :key="voltage"
          :value="voltage"
        >
          {{ voltage }} кВ
        </option>
      </select>
      <!-- Фильтр по типу СЗ -->
      <select v-model="selectedSzType">
        <option value="">Выберите тип СЗ</option>
        <option v-for="szType in szTypes" :key="szType" :value="szType">
          {{ szType }}
        </option>
      </select>
      <!-- Фильтр по датам испытаний -->
      <input
        type="date"
        v-model="testDateFrom"
        placeholder="Дата испытания от"
      />
      <input type="date" v-model="testDateTo" placeholder="Дата испытания до" />
      <!-- Можно добавить дополнительные фильтры по местонахождению, дате, состоянию и т.д. -->
    </div>

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
import { mapState } from "vuex";

export default {
  name: "SecurityDevicePage",
  data() {
    return {
      // Данные СИЗ
      search: "",
      selectedLocation: "",
      selectedType: "",
      selectedVoltageClass: "",
      selectedSzType: "",
      testDateFrom: "",
      testDateTo: "",
      quantity: "",

      // Пример данных СИЗ
      SIZItems: [
        {
          id: 1,
          location: "Подстанция 1",
          type: "Диэлектрические перчатки",
          voltageClass: "1",
          szType: "Перчатки",
          number: "1",
          testDate: "2022-01-01",
          nextTestDate: "2023-01-01",
          lastInspectDate: "2024-06-01",
          quantity: 100,
          quantityByClass: 100,
          note: "Требуется проверка",
        },
        {
          id: 2,
          location: "Подстанция 2",
          type: "Диэлектрические боты",
          voltageClass: "10",
          szType: "Боты",
          number: "10",
          testDate: "2021-01-01",
          nextTestDate: "2022-01-01",
          lastInspectDate: "2021-06-01",
          quantity: 50,
          quantityByClass: 50,
          note: "Требуется проверка",
        },
        // Добавить другие записи
      ],
    };
  },
  computed: {
    ...mapState(["types", "voltageClasses", "szTypes"]),
    // Динамическое заполнение выпадающих списков
    uniqueLocations() {
      return [...new Set(this.SIZItems.map((item) => item.location))];
    },
    uniqueTypes() {
      return [...new Set(this.SIZItems.map((item) => item.type))];
    },

    filteredSIZ() {
      return this.SIZItems.filter((item) => {
        return (
          item?.type?.toLowerCase().includes(this.search.toLowerCase()) &&
          (!this.selectedLocation || item.location === this.selectedLocation) &&
          (!this.selectedType || item.type === this.selectedType) &&
          (!this.selectedVoltageClass ||
            item.voltageClass === this.selectedVoltageClass) &&
          (!this.selectedSzType || item.szType === this.selectedSzType) &&
          (!this.testDateFrom ||
            new Date(item.testDate) >= new Date(this.testDateFrom)) &&
          (!this.testDateTo ||
            new Date(item.testDate) <= new Date(this.testDateTo))
        );
      });
    },
  },
  methods: {
    editSIZ(item) {
      // Логика редактирования СИЗ
      alert(`Редактировать: ${item.name}`);
    },
    deleteSIZ(item) {
      // Логика удаления СИЗ
      if (confirm(`Вы уверены, что хотите удалить ${item.name}?`)) {
        this.SIZItems = this.SIZItems.filter((siz) => siz.id !== item.id);
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
