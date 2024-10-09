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
          <td>{{ item.userId || "Неизвестно" }}</td>
          <td>{{ JSON.stringify(item.details) }}</td>
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
