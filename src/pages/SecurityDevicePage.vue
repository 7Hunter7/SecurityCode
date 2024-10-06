<template>
  <div class="siz-inventory">
    <h1>Учет средств индивидуальной защиты</h1>
    <!-- Компонент фильтров -->
    <FiltersComponent
      :locations="uniqueLocations"
      :types="uniqueTypes"
      :voltageClasses="uniqueVoltageClasses"
      @filterChanged="handleFilterChange"
    />
    <!-- Таблица СИЗ -->
    <table>
      <thead>
        <tr>
          <th>Местонахождение</th>
          <th>Вид СЗ</th>
          <th>Класс напряжения (кВ)</th>
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
        >
          <td class="location">{{ item.location }}</td>
          <td class="type">{{ item.type }}</td>
          <td class="voltageClass">{{ item.voltageClass }}</td>
          <td class="szType">{{ item.szType }}</td>
          <td class="number">{{ item.number }}</td>
          <td class="testDate">{{ formatDate(item.testDate) }}</td>
          <td class="nextTestDate">{{ formatDate(item.nextTestDate) }}</td>
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

export default {
  name: "SecurityDevicePage",
  components: {
    FiltersComponent,
  },
  data() {
    return {
      shownInspectionNotifications: new Set(), // Отслеживание уведомлений по осмотру
      shownTestNotifications: new Set(), // Отслеживание уведомлений по испытаниям
    };
  },
  // Отслеживание изменений
  watch: {
    filteredSIZItems() {
      // Сбрасываем трекер уведомлений при изменении фильтров
      this.resetNotificationsTracker();
      this.$nextTick(() => {
        this.applyStyles();
        this.checkForOverdueInspectionsAndTests();
      });
    },
  },
  async mounted() {
    await this.loadData(); // Асинхронная загрузка данных

    this.$nextTick(() => {
      this.applyStyles(); // Применение стилей
      this.checkForOverdueInspectionsAndTests(); // Логика уведомлений
    });
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
    uniqueVoltageClasses() {
      return [
        ...new Set(this.filteredSIZItems.map((item) => item.voltageClass)),
      ];
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
    async loadData() {
      if (!this.getSizItems.length) {
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
    formatDate(date) {
      if (!date) return "—";
      const options = { year: "numeric", month: "2-digit", day: "2-digit" };
      return new Date(date).toLocaleDateString("ru-RU", options);
    },

    // Фильтрация данных
    handleFilterChange(filters) {
      let filteredItems = [...this.getSizItems]; //Полный набор данных
      // Фильтр по строке поиска
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        filteredItems = filteredItems.filter((item) =>
          item.type.toLowerCase().includes(searchTerm)
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
      if (filters.selectedVoltageClass) {
        filteredItems = filteredItems.filter(
          (item) => item.voltageClass === filters.selectedVoltageClass
        );
      }
      // Фильтр по дате испытания "от"
      if (filters.testDateFrom) {
        filteredItems = filteredItems.filter(
          (item) => new Date(item.testDate) >= new Date(filters.testDateFrom)
        );
      }
      // Фильтр по дате испытания "до"
      if (filters.testDateTo) {
        filteredItems = filteredItems.filter(
          (item) => new Date(item.testDate) <= new Date(filters.testDateTo)
        );
      }
      // Применение фильтров в store через мутацию
      this.$store.commit("SET_FILTERED_SIZ_ITEMS", filteredItems);
      this.$nextTick(() => {
        this.applyStyles();
        this.checkForOverdueInspectionsAndTests();
      });
    },
    // Редактирование элемента
    editSIZ(item) {
      this.$router.push({ name: "Edit Device", query: { id: item.id } }); // Переход на страницу редактирования
    },
    // Удаление элемента
    async deleteSIZ(item) {
      if (confirm(`Вы уверены, что хотите удалить ${item.type}?`)) {
        await this.deleteSIZ(item.id); // Удаляем элемент через Vuex
        await this.loadData();
      }
    },
    // Применение стилей на основе результата осмотра
    applyStyles() {
      const rows = document.querySelectorAll(".table-row");
      rows.forEach((row) => {
        // Получаем результат осмотра
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
    },
    // Всплывающие сообщения при наличии просроченных осмотров или испытаниях
    checkForOverdueInspectionsAndTests() {
      const toast = useToast(); // Инициализация уведомлений
      const rows = document.querySelectorAll(".table-row");

      rows.forEach((row) => {
        const inspectionResult =
          row.querySelector(".inspection-result").textContent;
        const location = row.querySelector(".location").textContent;
        const type = row.querySelector(".type").textContent;
        const itemId = row.dataset.id; // Уникальный идентификатор строки из data-id
        // Проверка просрочки осмотра
        if (
          inspectionResult.includes("Необходимо выполнить осмотр!") &&
          !this.shownInspectionNotifications.has(itemId)
        ) {
          toast.warning(
            `Необходимо выполнить осмотр СИЗ: ${type} ${location}!`,
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
            `Внимание! Необходимо выполнить испытания СИЗ: ${type} ${location}!`,
            {
              timeout: 10000,
            }
          );
          this.shownTestNotifications.add(itemId); // Добавляем в трекер уведомлений
        }
      });
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
/* Зеленый текст для "Осмотрено." и "Испытано." */
.green-text {
  color: green;
}
/* Желтый текст для "Необходимо выполнить осмотр!" */
.orange-text {
  color: orange;
}
/* Красный текст для "Испытание просрочено!" */
.red-text {
  color: red;
}
/* Анимация мигания желтой рамки */
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
/* Анимация мигания красной рамки */
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
/* Класс для желтой мигающей рамки */
.blink-orange {
  border: 3px solid orange;
  animation: blink-orange 1.5s infinite;
}
/* Класс для красной мигающей рамки */
.blink-red {
  border: 3px solid red;
  animation: blink-red 1s infinite;
}
</style>
