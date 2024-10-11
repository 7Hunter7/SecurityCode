<template>
  <main>
    <h1>История изменений</h1>

    <!-- Кнопка для очистки всей истории -->
    <button @click="clearHistory" class="clear-button">Очистить историю</button>

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
          <!-- Кнопка для удаления отдельного события -->
          <td>
            <button @click="deleteEvent(item.id)">Удалить событие</button>
          </td>
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

// Функция для загрузки истории с сервера
const loadHistory = async () => {
  try {
    const response = await axios.get("/api/history");
    history.value = response.data;
  } catch (error) {
    console.error("Ошибка при загрузке истории:", error);
  }
};

// Функция для форматирования строковых данных details
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

// Функция для очистки всей истории
const clearHistory = async () => {
  if (confirm("Вы уверены, что хотите очистить всю историю?")) {
    try {
      await axios.delete("/api/history");
      history.value = []; // Очищаем историю на клиенте
      console.log("История успешно очищена");
    } catch (error) {
      console.error("Ошибка при очистке истории:", error);
    }
  }
};

// Функция для удаления отдельного события
const deleteEvent = async (id) => {
  if (confirm("Вы уверены, что хотите удалить это событие?")) {
    try {
      await axios.delete(`/api/history/${id}`);
      history.value = history.value.filter((item) => item.id !== id); // Удаляем событие из истории на клиенте
      console.log(`Событие с ID ${id} удалено`);
    } catch (error) {
      console.error(`Ошибка при удалении события с ID ${id}:`, error);
    }
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
/* Стили для кнопок */
button {
  padding: 6px 12px;
  margin-right: 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  background-color: #007bff;
  color: white;
}
button:hover {
  background-color: #0056b3;
}
.clear-button {
  margin-bottom: 10px;
  background-color: #dc3545;
}
.clear-button:hover {
  background-color: #c82333;
}
</style>
