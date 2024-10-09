<template>
  <main>
    <h1>История изменений</h1>
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

const history = ref([]);

const loadHistory = async () => {
  try {
    const response = await axios.get("/api/history");
    history.value = response.data;
  } catch (error) {
    console.error("Ошибка при загрузке истории:", error);
  }
};

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
