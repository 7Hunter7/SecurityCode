<template>
  <div class="siz-inventory">
    <h1>Учет средств индивидуальной защиты</h1>
    <!-- Компонент фильтров -->
    <FiltersComponent
      :locations="uniqueLocations"
      :types="uniqueTypes"
      :voltagees="uniquevoltagees"
      @filterChanged="handleFilterChange"
    />
    <!-- Таблица СИЗ -->
    <table>
      <thead>
        <tr>
          <th>Местонахождение</th>
          <th>Вид СЗ</th>
          <th>Напряжение ЭУ(кВ)</th>
          <th>Тип СЗ</th>
          <th>№ СЗ</th>
          <th>Дата испытания</th>
          <th>Дата следующего испытания</th>
          <th>Дата последнего осмотра</th>
          <th>Кол-во</th>
          <th>Результат осмотра</th>
          <th>Действия</th>
        </tr>
      </thead>
      <tbody>
        <tr
          class="table-row"
          v-for="item in filteredSIZItems"
          :key="item.id"
          :data-id="item.id"
          :class="{ 'blink-green': item.id == newAddedId }"
        >
          <td class="location">
            {{ item.location }}
            <span v-if="item.id == newAddedId" class="new-label">Новое СЗ</span>
          </td>
          <td class="type">{{ item.type }}</td>
          <td class="voltage">{{ item.voltage }}</td>
          <td class="szType">{{ item.szType }}</td>
          <td class="number">{{ item.number }}</td>
          <td class="testDate">{{ formatDate(item.testDate, item.type) }}</td>
          <td class="nextTestDate">
            {{ formatDate(item.nextTestDate, item.type) }}
          </td>
          <td class="lastInspectDate">
            {{ formatDate(item.lastInspectDate) }}
          </td>
          <td class="quantity">{{ item.quantity }}</td>
          <td class="inspection-result">{{ item.inspectionResult }}</td>
          <td>
            <button @click="editSIZ(item)">Редактировать</button>
            <button @click="deleteSIZ(item)">Удалить</button>
          </td>
        </tr>
      </tbody>
      <tfoot>
        <!-- Строка для подсчета общего количества СИЗ -->
        <tr>
          <td colspan="8" style="text-align: right"><strong>Всего:</strong></td>
          <td>
            <strong>{{ totalQuantity }}</strong>
          </td>
          <td colspan="2"></td>
        </tr>
      </tfoot>
    </table>
  </div>
</template>

<script>
import FiltersComponent from "../components/FiltersComponent.vue";
import { mapGetters, mapActions } from "vuex";
import { useToast } from "vue-toastification";
import { PZ_TYPES } from "../constants/constants.js";

export default {
  name: "SecurityDevicePage",
  components: {
    FiltersComponent,
  },
  data() {
    return {
      notificationsShown: false, // Уведомления еще не показаны
      shownInspectionNotifications: new Set(), // Отслеживание уведомлений по осмотру
      shownTestNotifications: new Set(), // Отслеживание уведомлений по испытаниям
      newAddedId: null, // Отслеживание нового элемента
    };
  },
  // Отслеживание изменений
  watch: {
    filteredSIZItems() {
      // Сбрасываем трекер уведомлений при изменении фильтров
      this.resetNotificationsTracker();
      this.$nextTick(() => {
        this.applyStyles();
      });
    },
  },
  async mounted() {
    await this.loadData(); // Асинхронная загрузка данных

    this.$nextTick(() => {
      this.applyStyles(); // Применение стилей
      this.checkForOverdueInspectionsAndTests(); // Логика уведомлений
    });
    // Получаем переданный ID нового элемента из query
    const newItemId = this.$route.query.newItemId;
    if (newItemId) {
      this.newAddedId = newItemId;
    }
  },
  async onUpdated() {
    await this.loadData(true);
  },
  computed: {
    ...mapGetters(["getSizItems", "getFilteredSizItems"]),
    filteredSIZItems() {
      return this.getFilteredSizItems.length > 0
        ? this.getFilteredSizItems
        : this.getSizItems;
    },
    // Динамическое заполнение выпадающих списков
    uniqueLocations() {
      return [...new Set(this.getSizItems.map((item) => item.location))];
    },
    uniqueTypes() {
      return [...new Set(this.filteredSIZItems.map((item) => item.type))];
    },
    uniquevoltagees() {
      return [...new Set(this.filteredSIZItems.map((item) => item.voltage))];
    },
    // Подсчет общего количества СИЗ по колонке "Кол-во"
    totalQuantity() {
      return this.filteredSIZItems.reduce((total, item) => {
        return total + parseInt(item.quantity, 10);
      }, 0);
    },
  },
  methods: {
    ...mapActions(["loadSIZItems", "deleteSIZ", "applyFilters"]),

    // Обновление данных
    async loadData(forceUpdate = false) {
      if (!this.getSizItems.length || forceUpdate) {
        try {
          await this.loadSIZItems(); // Загружаем данные через Vuex
          console.log("Данные успешно обновлены");
        } catch (error) {
          console.error("Ошибка при обновлении данных", error);
        }
      } else {
        console.log("Данные уже загружены, обновление не требуется");
      }
    },

    // Форматирование дат
    formatDate(date, type) {
      if (!date || PZ_TYPES.includes(type)) return "—"; // Если дата не указана или тип СЗ относится к PZ_TYPES, возвращаем "—"
      const options = { year: "numeric", month: "2-digit", day: "2-digit" };
      return new Date(date).toLocaleDateString("ru-RU", options);
    },

    // Фильтрация данных
    handleFilterChange(filters) {
      let filteredItems = [...this.getSizItems]; //Полный набор данных
      // Фильтр по строке поиска
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        filteredItems = filteredItems.filter(
          (item) =>
            item.type.toLowerCase().includes(searchTerm) ||
            item.szType.toLowerCase().includes(searchTerm) ||
            item.number.toString().includes(searchTerm)
        );
      }
      // Фильтр по местоположению
      if (filters.selectedLocation) {
        filteredItems = filteredItems.filter(
          (item) => item.location === filters.selectedLocation
        );
      }
      // Фильтр по типу СЗ
      if (filters.selectedType) {
        filteredItems = filteredItems.filter(
          (item) => item.type === filters.selectedType
        );
      }
      // Фильтр по классу напряжения
      if (filters.selectedVoltage) {
        filteredItems = filteredItems.filter(
          (item) => item.voltage === filters.selectedVoltage
        );
      }
      // Фильтр по дате испытания "от"
      if (filters.nextTestDateFrom) {
        const filterDateFrom = new Date(filters.nextTestDateFrom)
          .toISOString()
          .split("T")[0];
        filteredItems = filteredItems.filter(
          (item) =>
            new Date(item.nextTestDate).toISOString().split("T")[0] >=
            filterDateFrom
        );
      }
      // Фильтр по дате испытания "до"
      if (filters.nextTestDateTo) {
        const filterDateTo = new Date(filters.nextTestDateTo)
          .toISOString()
          .split("T")[0];
        filteredItems = filteredItems.filter(
          (item) =>
            new Date(item.nextTestDate).toISOString().split("T")[0] <=
            filterDateTo
        );
      }
      // Применение фильтров в store через мутацию
      this.$store.commit("SET_FILTERED_SIZ_ITEMS", filteredItems);
      this.$nextTick(() => {
        this.applyStyles();
      });
    },
    // Редактирование элемента
    editSIZ(item) {
      this.loadData(true).then(() => {
        this.$router.push({ name: "Edit Device", query: { id: item.id } }); // Переход на страницу редактирования
      });
    },
    // Удаление элемента
    async deleteSIZ(item) {
      const toast = useToast(); // Инициализация уведомлений
      if (
        confirm(`Вы уверены, что хотите удалить ${item.type} ${item.number}?`)
      ) {
        try {
          await this.$store.dispatch("deleteSIZ", item.id);
          toast.success("СИЗ успешно удалено!");
          console.log("СИЗ успешно удалено");
          // Принудительное обновление данных через Vuex
          await this.loadData(true);
        } catch (error) {
          toast.error("Ошибка при удалении СИЗ!");
          console.error("Ошибка при удалении СИЗ", error);
          н;
        }
      }
    },
    // Применение стилей на основе результата осмотра
    applyStyles() {
      const rows = document.querySelectorAll(".table-row");
      rows.forEach((row) => {
        const itemId = row.dataset.id;
        // Если это новый элемент, добавляем класс для мигающей рамки
        if (this.newAddedId && this.newAddedId === itemId) {
          row.classList.add("blink-green");
        }
        // Добавляем класс по результатам осмотра
        const inspectionResult =
          row.querySelector(".inspection-result").textContent;

        if (inspectionResult.includes("Осмотрено.")) {
          row.querySelector(".inspection-result").classList.add("green-text");
        }
        if (inspectionResult.includes("Испытано.")) {
          row.querySelector(".inspection-result").classList.add("green-text");
        }
        if (inspectionResult.includes("Необходимо выполнить осмотр!")) {
          row.querySelector(".inspection-result").classList.add("orange-text");
          row.classList.add("blink-orange");
        }
        if (inspectionResult.includes("Испытание просрочено!")) {
          row.querySelector(".inspection-result").classList.add("red-text");
          row.classList.add("blink-red");
        }
      });
      // Сбрасываем состояние нового элемента
      setTimeout(() => {
        this.newlyAddedId = null;
      }, 5000);
    },
    // Всплывающие сообщения при наличии просроченных осмотров или испытаниях
    checkForOverdueInspectionsAndTests() {
      if (this.notificationsShown) return; // Если уведомления уже показаны, ничего не делаем
      const toast = useToast(); // Инициализация уведомлений
      const rows = document.querySelectorAll(".table-row");

      rows.forEach((row) => {
        const inspectionResult =
          row.querySelector(".inspection-result").textContent;
        const location = row.querySelector(".location").textContent;
        const type = row.querySelector(".type").textContent;
        const number = row.querySelector(".number").textContent;
        const itemId = row.dataset.id; // Уникальный идентификатор строки из data-id
        // Проверка просрочки осмотра
        if (
          inspectionResult.includes("Необходимо выполнить осмотр!") &&
          !this.shownInspectionNotifications.has(itemId)
        ) {
          toast.warning(
            `Необходимо выполнить осмотр СИЗ: ${type} №${number} ${location}!`,
            {
              timeout: 7000,
            }
          );
          this.shownInspectionNotifications.add(itemId); // Добавляем в трекер уведомлений
        }
        // Проверка просрочки испытаний
        if (
          inspectionResult.includes("Испытание просрочено!") &
          !this.shownTestNotifications.has(itemId)
        ) {
          toast.error(
            `Необходимо выполнить испытания СИЗ: ${type} №${number} ${location}`,
            {
              timeout: 10000,
            }
          );
          this.shownTestNotifications.add(itemId); // Добавляем в трекер уведомлений
        }
      });
      this.notificationsShown = true; // Устанавливаем флаг, что уведомления были показаны
    },
    // Сбрасываем трекеры при обновлении фильтров
    resetNotificationsTracker() {
      this.shownInspectionNotifications.clear();
      this.shownTestNotifications.clear();
    },
  },
};
</script>

<style scoped>
h1 {
  margin-block: 20px;
}
.siz-inventory {
  padding: 20px;
}
.filters {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}
.filters input {
  padding: 8px;
  width: 200px;
}
.filters select {
  padding: 8px;
}
table {
  width: 100%;
  border-collapse: collapse;
}
table th,
table td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}
table th {
  background-color: #f4f4f4;
}
table tbody tr:hover {
  background-color: #f1f1f1;
}
button {
  padding: 6px 12px;
  margin-right: 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
button:hover {
  background-color: #007bff;
  color: white;
}
/* Цвет для текста */
.green-text {
  color: green;
}
.orange-text {
  color: orange;
}
.red-text {
  color: red;
}
/* Класс для мигающей рамки */
.blink-green {
  position: relative;
  border: 3px solid green;
  border-radius: 0px 20px 0px 20px;
  animation: blink-green 1.5s infinite;
}
.blink-orange {
  border: 3px solid orange;
  border-radius: 0px 20px 0px 20px;
  animation: blink-orange 1.5s infinite;
}
.blink-red {
  border: 3px solid red;
  border-radius: 0px 20px 0px 20px;
  animation: blink-red 1s infinite;
}
/* Стиль для надписи "NEW" */
.new-label {
  position: absolute;
  top: 18%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: yellow;
  color: green;
  font-weight: bold;
  padding: 5px 10px;
  border-radius: 5px;
  z-index: 2; /* Надпись поверх строки */
  opacity: 0.9;
  animation: fade-in 1s ease-in-out; /* Добавление анимации */
}
/* Анимация для рамки */
@keyframes blink-green {
  0% {
    border-color: green;
  }
  50% {
    border-color: transparent;
  }
  100% {
    border-color: green;
  }
}
@keyframes blink-orange {
  0% {
    border-color: orange;
  }
  50% {
    border-color: transparent;
  }
  100% {
    border-color: orange;
  }
}
@keyframes blink-red {
  0% {
    border-color: red;
  }
  50% {
    border-color: transparent;
  }
  100% {
    border-color: red;
  }
}
/* Анимация для плавного появления */
@keyframes fade-in {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
</style>
