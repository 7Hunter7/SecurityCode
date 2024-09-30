<template>
  <div class="filters">
    <!-- Поле для поиска -->
    <input
      v-model="search"
      placeholder="Поиск по СИЗ..."
      @input="updateFilters"
    />
    <!-- Фильтр по местонахождению -->
    <select v-model="selectedLocation" @change="updateFilters">
      <option value="">Местонахождение</option>
      <option v-for="location in locations" :key="location" :value="location">
        {{ location }}
      </option>
    </select>
    <!-- Фильтр по виду СЗ -->
    <select v-model="selectedType" @change="updateFilters">
      <option value="">Вид СЗ</option>
      <option v-for="type in types" :key="type" :value="type">
        {{ type }}
      </option>
    </select>
    <!-- Фильтр по классу напряжения СЗ -->
    <select v-model="selectedVoltageClass" @change="updateFilters">
      <option value="">Класс напряжения</option>
      <option v-for="voltage in voltageClasses" :key="voltage" :value="voltage">
        {{ voltage }} кВ
      </option>
    </select>
    <br />
    <!-- Фильтр по датам испытаний -->
    <label for="date-from">Дата следующего испытания (от)</label>
    <input
      id="date-from"
      type="date"
      v-model="testDateFrom"
      @change="updateFilters"
    />
    <label for="date-to">Дата следующего испытания (до)</label>
    <input
      id="date-to"
      type="date"
      v-model="testDateTo"
      @change="updateFilters"
    />
  </div>
</template>

<script>
export default {
  name: "FiltersComponent",
  props: {
    locations: {
      type: Array,
      required: true,
    },
    types: {
      type: Array,
      required: true,
    },
    voltageClasses: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      search: "",
      selectedLocation: "",
      selectedType: "",
      selectedVoltageClass: "",
      testDateFrom: "",
      testDateTo: "",
    };
  },
  watch: {
    // Наблюдатель для любых изменений фильтров
    search() {
      this.updateFilters();
    },
    selectedLocation() {
      this.updateFilters();
    },
    selectedType() {
      this.updateFilters();
    },
    selectedVoltageClass() {
      this.updateFilters();
    },
    testDateFrom() {
      this.updateFilters();
    },
    testDateTo() {
      this.updateFilters();
    },
  },
  methods: {
    updateFilters() {
      this.$emit("filterChanged", {
        search: this.search || "",
        selectedLocation: this.selectedLocation || "",
        selectedType: this.selectedType || "",
        selectedVoltageClass: this.selectedVoltageClass || "",
        testDateFrom: this.testDateFrom || null,
        testDateTo: this.testDateTo || null,
      });
    },
  },
};
</script>

<style scoped>
.filters {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}
.filters input,
.filters select {
  padding: 8px;
}
</style>
