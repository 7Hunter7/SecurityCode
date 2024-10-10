<template>
  <main>
    <h1>История изменений</h1>

    <!-- Таблица с историей изменений -->
    <table>
      <thead>
        <tr>
          <th>Дата</th>
          <th>Действие</th>
          <th>Тип СЗ</th>
          <th>№ СЗ</th>
          <th>Пользователь</th>
          <th>Детали</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in history" :key="item.id">
          <td>{{ new Date(item.timestamp).toLocaleString() }}</td>
          <td>{{ item.action }}</td>
          <td>{{ item.sizType }}</td>
          <td>{{ item.sizNumber }}</td>
          <td>{{ item.userId || "Неизвестен" }}</td>
          <td v-html="formatDetails(item.details)"></td>
        </tr>
      </tbody>
    </table>
  </main>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { reverseformatDate } from "../utils/dateUtils.js";

const history = ref([]); // Реактивная переменная для хранения массива записей истории

// Функция для сохранения данных истории с сервера
const loadHistory = async () => {
  try {
    const response = await axios.get("/api/history");
    history.value = response.data;
  } catch (error) {
    console.error("Ошибка при загрузке истории:", error);
  }
};

// Функция для форматирования details
const formatDetails = (details) => {
  if (!details || !details.newData) return "—";
  try {
    const data = details.newData;

    // Перобразование дат
    const testDate = reverseformatDate(data.testDate);
    const nextTestDate = reverseformatDate(data.nextTestDate);
    const lastInspectDate = reverseformatDate(data.lastInspectDate);

    return `
    <div>Место: ${data.location || "—"}</div>
    <div>Вид: ${data.type || "—"}</div>
    <div>Класс: ${data.voltageClass || "—"} кВ</div>
    <div>Тип: ${data.szType || "—"}</div>
    <div>№: ${data.number || "—"}</div>
    <div>Кол-во: ${data.quantity || "—"}</div>
    <div>Дата исп.: ${testDate || "—"}</div>
    <div>Дата след. исп.: ${nextTestDate || "—"}</div>
    <div>Дата осмотра: ${lastInspectDate || "—"}</div>
    <div>Результат: ${data.inspectionResult || "—"}</div>
    `;
  } catch (error) {
    console.error("Ошибка при обработке данных:", error);
    return "Некорректные данные";
  }
};

// Загрузка данных, когда компонент готов
onMounted(() => {
  loadHistory();
});
</script>

<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

th {
  background-color: #f4f4f4;
}
</style>
