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
          <td>
            {{ item.action }}
            <button @click="deleteEvent(item.id)">Удалить событие</button>
          </td>
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

// Функция для загрузки истории с сервера
const loadHistory = async () => {
  try {
    const response = await axios.get("/api/history");
    history.value = response.data;
  } catch (error) {
    console.error("Ошибка при загрузке истории:", error);
  }
};

// Функция для форматирования строковых данных details с подсветкой изменений
const formatDetails = (details) => {
  if (!details || !details.newData) return "—";

  try {
    const { oldData = {}, newData = {} } = details;

    // Поля для отображения
    const fields = [
      { label: "Место", key: "location" },
      { label: "Вид", key: "type" },
      { label: "Класс", key: "voltageClass", suffix: " кВ" },
      { label: "Тип", key: "szType" },
      { label: "№", key: "number" },
      { label: "Кол-во", key: "quantity" },
      { label: "Дата исп.", key: "testDate" },
      { label: "Дата след. исп.", key: "nextTestDate" },
      { label: "Дата осмотра", key: "lastInspectDate" },
      { label: "Результат", key: "inspectionResult" },
    ];

    let formattedDetails = "";

    fields.forEach(({ label, key, suffix = "" }) => {
      const oldValue = oldData[key] || "—";
      const newValue = newData[key] || "—";

      // Сравниваем исходные значения дат
      if (oldValue !== newValue) {
        // Преобразуем даты для отображения
        const displayOldValue =
          key.includes("Date") && oldValue !== "—"
            ? reverseformatDate(oldValue) // Преобразование только для отображения
            : oldValue;
        const displayNewValue =
          key.includes("Date") && newValue !== "—"
            ? reverseformatDate(newValue) // Преобразование только для отображения
            : newValue;

        // Добавляем строку с подсветкой изменений
        formattedDetails += `<div>${label}: <span class="red-text">${displayNewValue}${suffix}</span>`;
        if (displayOldValue !== "—") {
          formattedDetails += ` (было: ${displayOldValue}${suffix})</div>`;
        } else {
          formattedDetails += `</div>`;
        }
      } else {
        // Если изменений нет, просто выводим значение
        const displayValue =
          key.includes("Date") && newValue !== "—"
            ? reverseformatDate(newValue)
            : newValue;
        formattedDetails += `<div>${label}: ${displayValue}${suffix}</div>`;
      }
    });

    return formattedDetails;
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
.red-text {
  color: red !important; /* для приоритета */
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
