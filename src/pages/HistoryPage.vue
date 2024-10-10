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
  if (!details) return "—";

  // Проверяем, если details строка, преобразуем её в объект
  let parsedDetails;
  try {
    parsedDetails = typeof details === "string" ? JSON.parse(details) : details;
    // Формируем строку с детализированной информацией
    return `
    <div>Местонахождение: ${parsedDetails.location || "—"}</div>
    <div>Вид СЗ: ${parsedDetails.type || "—"}</div>
    <div>Класс напряжения: ${parsedDetails.voltageClass || "—"}</div>
    <div>Тип СЗ: ${parsedDetails.szType || "—"}</div>
    <div>№ СЗ: ${parsedDetails.number || "—"}</div>
    <div>Дата испытания: ${parsedDetails.testDate || "—"}</div>
    <div>Дата следующего испытания: ${parsedDetails.nextTestDate || "—"}</div>
    <div>Дата последнего осмотра: ${parsedDetails.lastInspectDate || "—"}</div>
    <div>Количество: ${parsedDetails.quantity || "—"}</div>
    <div>Результат осмотра: ${parsedDetails.inspectionResult || "—"}</div>
  `;
  } catch (error) {
    console.error("Ошибка при парсинге details:", error);
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
