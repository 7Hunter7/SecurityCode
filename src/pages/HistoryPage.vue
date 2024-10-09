<template>
  <main>
    <h1>История изменений</h1>

    <!-- Таблица с историей изменений -->
    <table>
      <thead>
        <tr>
          <th>Дата</th>
          <th>Действие</th>
          <th>Тип</th>
          <th>ID</th>
          <th>Пользователь</th>
          <th>Детали</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in history" :key="item.id">
          <td>{{ new Date(item.timestamp).toLocaleString() }}</td>
          <td>{{ item.action }}</td>
          <td>{{ item.entityType }}</td>
          <td>{{ item.entityId }}</td>
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

const history = ref([]); // Реактивная переменная для хранения массива записей истории

// Функция для сохранения данных истории с сервера
const loadHistory = async () => {
  try {
    // Запрос данных с сервера
    const response = await axios.get("/api/history");
    // Сохранение полученных данных
    history.value = response.data;
  } catch (error) {
    console.error("Ошибка при загрузке истории:", error);
  }
};

// Функция для форматирования details
const formatDetails = (details) => {
  if (!details) return "";

  // Формируем строку с детализированной информацией
  return `
    <div>Местонахождение: ${details.location || "—"}</div>
    <div>Вид СЗ: ${details.type || "—"}</div>
    <div>Класс напряжения: ${details.voltageClass || "—"}</div>
    <div>Тип СЗ: ${details.szType || "—"}</div>
    <div>№ СЗ: ${details.number || "—"}</div>
    <div>Дата испытания: ${details.testDate || "—"}</div>
    <div>Дата следующего испытания: ${details.nextTestDate || "—"}</div>
    <div>Дата последнего осмотра: ${details.lastInspectDate || "—"}</div>
    <div>Количество: ${details.quantity || "—"}</div>
    <div>Результат осмотра: ${details.inspectionResult || "—"}</div>
  `;
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
