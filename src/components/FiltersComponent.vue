<template>
  <div class="filters">
    <h2>Поиск СИЗ</h2>
    <!-- Поле для поиска -->
    <input
      v-model="search"
      placeholder="Вид СЗ / Тип СЗ / № СЗ"
      @input="updateFilters"
    />
    <br />
    <h2>Фильтрация СИЗ</h2>
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
    <select v-model="selectedVoltage" @change="updateFilters">
      <option value="">Напряжение ЭУ</option>
      <option v-for="voltage in voltages" :key="voltage" :value="voltage">
        {{ voltage }} кВ
      </option>
    </select>
    <br />
    <!-- Фильтр по датам испытаний -->
    <label for="date-from">Дата следующего испытания (от)</label>
    <input
      id="date-from"
      type="date"
      v-model="nextTestDateFrom"
      @change="updateFilters"
    />
    <label for="date-to">Дата следующего испытания (до)</label>
    <input
      id="date-to"
      type="date"
      v-model="nextTestDateTo"
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
    voltages: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      search: "",
      selectedLocation: "",
      selectedType: "",
      selectedVoltage: "",
      nextTestDateFrom: "",
      nextTestDateTo: "",
    };
  },
  methods: {
    updateFilters() {
      this.$emit("filterChanged", {
        search: this.search,
        selectedLocation: this.selectedLocation,
        selectedType: this.selectedType,
        selectedVoltage: this.selectedVoltage,
        nextTestDateFrom: this.nextTestDateFrom || null,
        nextTestDateTo: this.nextTestDateTo || null,
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
  padding: 6px;
}
</style>
