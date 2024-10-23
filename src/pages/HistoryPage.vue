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
          <td>
            <div
              v-for="detail in formatDetails(item.details)"
              :key="detail.label"
            >
              <span :class="{ 'red-text': detail.changed }">
                {{ detail.label }}: {{ detail.value }}
              </span>
              <span v-if="detail.oldValue">
                (было: {{ detail.oldValue }})
              </span>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <!-- Кнопка "Наверх" -->
    <ScrollTopButton />
  </main>
</template>

<script setup>
import ScrollTopButton from "../components/ScrollTopButton .vue";
import { ref, onMounted } from "vue";
import axios from "axios";
import { reverseformatDate } from "../utils/dateUtils.js";
import { useToast } from "vue-toastification"; // Импорт уведомлений

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
  if (!details || (!details.newData && !details.oldData)) {
    return [{ label: "—", value: "—", changed: false }];
  }
  try {
    const { oldData = {}, newData = {} } = details;

    // Поля для отображения
    const fields = [
      { label: "Место", key: "location" },
      { label: "Вид", key: "type" },
      { label: "Напряжение", key: "voltage", suffix: " кВ" },
      { label: "Тип", key: "szType" },
      { label: "№", key: "number" },
      { label: "Кол-во", key: "quantity" },
      { label: "Дата исп.", key: "testDate" },
      { label: "Дата след. исп.", key: "nextTestDate" },
      { label: "Дата осмотра", key: "lastInspectDate" },
      { label: "Результат", key: "inspectionResult" },
    ];

    return fields.map(({ label, key, suffix = "" }) => {
      const oldValue = oldData[key] || "—";
      const newValue = newData[key] || "—";

      // Преобразование дат для отображения
      const displayOldValue =
        key.includes("Date") && oldValue !== "—"
          ? reverseformatDate(oldValue)
          : oldValue;
      const displayNewValue =
        key.includes("Date") && newValue !== "—"
          ? reverseformatDate(newValue)
          : newValue;

      const hasChanged =
        displayOldValue !== displayNewValue && displayOldValue !== "—";

      return {
        label,
        value: `${displayNewValue}${suffix}`,
        changed: hasChanged, // Флаг для подсветки изменений
        oldValue: hasChanged ? `${displayOldValue}${suffix}` : null, // Показываем старое значение, только если изменилось
      };
    });
  } catch (error) {
    console.error("Ошибка при обработке данных:", error);
    return [{ label: "Некорректные данные", value: "—", changed: false }];
  }
};

// Функция для очистки всей истории
const clearHistory = async () => {
  const toast = useToast();
  if (confirm("Вы уверены, что хотите очистить всю историю?")) {
    try {
      await axios.delete("/api/history");
      history.value = []; // Очищаем историю на клиенте
      toast.success("История успешно очищена");
      console.log("История успешно очищена");
    } catch (error) {
      toast.error("Ошибка при очистке истории");
      console.error("Ошибка при очистке истории:", error);
    }
  }
};

// Функция для удаления отдельного события
const deleteEvent = async (id) => {
  const toast = useToast();
  if (confirm("Вы уверены, что хотите удалить это событие?")) {
    try {
      await axios.delete(`/api/history/${id}`);
      history.value = history.value.filter((item) => item.id !== id); // Удаляем событие из истории на клиенте
      toast.success("Событие успешно удалено");
      console.log(`Событие с ID ${id} удалено`);
    } catch (error) {
      toast.error("Ошибка при удалении события");
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
