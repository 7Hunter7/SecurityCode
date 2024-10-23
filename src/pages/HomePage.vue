<template>
  <div class="home-page">
    <!-- Краткая информация -->
    <div class="summary">
      <div class="summary-item">
        <h3>Всего СИЗ</h3>
        <p>{{ totalSIZ }}</p>
      </div>
      <div class="summary-item">
        <h3>Используется</h3>
        <p>{{ inUseSIZ }}</p>
      </div>
      <div class="summary-item">
        <h3>На складе</h3>
        <p>{{ inStockSIZ }}</p>
      </div>
      <div class="summary-item">
        <h3>На испытаниях</h3>
        <p>{{ inRepairSIZ }}</p>
      </div>
    </div>

    <!-- Кнопка добавления -->
    <div class="add-siz">
      <button @click="goToAddSIZ">Добавить СИЗ</button>
    </div>

    <!-- Кнопка "Наверх" -->
    <ScrollTopButton />
  </div>
</template>

<script>
import ScrollTopButton from "../components/scrollTopButton.vue";

export default {
  name: "HomePage",
  components: { ScrollTopButton },
  data() {
    return {
      totalSIZ: 150, // Пример данных — общее количество СИЗ
      inUseSIZ: 100, // Пример данных — сколько используется
      inStockSIZ: 30, // Пример данных — сколько на складе
      inRepairSIZ: 20, // Пример данных — сколько на испытаниях
    };
  },
  methods: {
    goToAddSIZ() {
      this.$router.push("/add-device");
    },
  },
};
</script>

<style scoped>
.summary {
  display: flex;
  justify-content: space-between;
  margin: 20px 0;
}
.summary-item {
  background-color: #f4f4f4;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
  flex: 1;
  margin: 0 10px;
}
.add-siz {
  text-align: center;
  margin-top: 30px;
}
.add-siz button {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
.add-siz button:hover {
  background-color: #0056b3;
}
</style>
