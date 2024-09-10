<template>
  <div class="filters">
    <input
      v-model="search"
      placeholder="Поиск по СИЗ..."
      @input="updateFilters"
    />
    <!-- Фильтр по местонахождению -->
    <select v-model="selectedLocation" @change="updateFilters">
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
    <select v-model="selectedType" @change="updateFilters">
      <option value="">Выберите вид СЗ</option>
      <option v-for="type in uniqueTypes" :key="type" :value="type">
        {{ type }}
      </option>
    </select>
    <!-- Фильтр по классу напряжения СЗ -->
    <select v-model="selectedVoltageClass" @change="updateFilters">
      <option value="">Выберите класс напряжения</option>
      <option
        v-for="voltage in uniqueVoltageClass"
        :key="voltage"
        :value="voltage"
      >
        {{ voltage }} кВ
      </option>
    </select>
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
import { mapState } from "vuex";

export default {
  name: "FiltersComponent",
  props: {
    locations: Array,
    types: Array,
    voltageClasses: Array,
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
  computed: {
    ...mapState(["SIZItems"]),
    // Динамическое заполнение выпадающих списков
    uniqueLocations() {
      return [...new Set(this.SIZItems.map((item) => item.location))];
    },
    uniqueTypes() {
      return [...new Set(this.SIZItems.map((item) => item.type))];
    },
    uniqueVoltageClass() {
      return [...new Set(this.SIZItems.map((item) => item.voltageClass))];
    },
  },
  methods: {
    updateFilters() {
      this.$emit("filterChanged", {
        search: this.search,
        selectedLocation: this.selectedLocation,
        selectedType: this.selectedType,
        selectedVoltageClass: this.selectedVoltageClass,
        testDateFrom: this.testDateFrom,
        testDateTo: this.testDateTo,
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
}
.filters input,
.filters select {
  padding: 8px;
}
</style>
