<template>
  <div class="edit-siz-page">
    <h1>{{ isEditMode ? "Редактировать СИЗ" : "Добавить новое СИЗ" }}</h1>

    <form @submit.prevent="submitForm">
      <!-- Местонахождение -->
      <div class="form-group">
        <label for="location">Местонахождение:</label>
        <div>
          <select v-model="siz.location" id="location" required>
            <option value="">Выберите местонахождение</option>
            <option
              v-for="location in locations"
              :key="location"
              :value="location"
            >
              {{ location }}
            </option>
          </select>
          <input
            v-if="siz.location === 'new'"
            v-model="newLocation"
            type="text"
            placeholder="Добавить новое местонахождение"
          />
        </div>
      </div>

      <!-- Вид СЗ -->
      <div class="form-group">
        <label for="type">Вид СЗ:</label>
        <div>
          <select v-model="siz.type" id="type" required>
            <option value="">Выберите вид СЗ</option>
            <option v-for="type in types" :key="type" :value="type">
              {{ type }}
            </option>
          </select>
          <input
            v-if="siz.type === 'new'"
            v-model="newType"
            type="text"
            placeholder="Добавить новый вид СЗ"
          />
        </div>
      </div>

      <!-- Класс напряжения (кВ) -->
      <div class="form-group">
        <label for="voltageClass">Класс напряжения (кВ):</label>
        <div>
          <select v-model="siz.voltageClass" id="voltageClass" required>
            <option value="">Выберите класс напряжения</option>
            <option
              v-for="voltage in voltageClasses"
              :key="voltage"
              :value="voltage"
            >
              {{ voltage }} кВ
            </option>
          </select>
          <input
            v-if="siz.voltageClass === 'new'"
            v-model="newVoltageClass"
            type="text"
            placeholder="Добавить новый класс напряжения"
          />
        </div>
      </div>

      <!-- Тип СЗ -->
      <div class="form-group">
        <label for="szType">Тип СЗ:</label>
        <div>
          <select v-model="siz.szType" id="szType" required>
            <option value="">Выберите тип СЗ</option>
            <option v-for="szType in szTypes" :key="szType" :value="szType">
              {{ szType }}
            </option>
          </select>
          <input
            v-if="siz.szType === 'new'"
            v-model="newSzType"
            type="text"
            placeholder="Добавить новый тип СЗ"
          />
        </div>
      </div>

      <!-- № СЗ -->
      <div class="form-group">
        <label for="number">№ СЗ:</label>
        <input
          v-model="siz.number"
          type="text"
          id="number"
          placeholder="Введите номер СЗ"
          required
        />
      </div>

      <!-- Дата испытания -->
      <div class="form-group">
        <label for="testDate">Дата испытания:</label>
        <input
          type="date"
          v-model="siz.testDate"
          id="testDate"
          @change="setNextTestDate"
          required
        />
      </div>

      <!-- Дата следующего испытания -->
      <div class="form-group">
        <label for="nextTestDate">Дата следующего испытания:</label>
        <input
          type="date"
          v-model="siz.nextTestDate"
          id="nextTestDate"
          required
        />
      </div>

      <!-- Дата последнего осмотра -->
      <div class="form-group">
        <label for="lastInspectDate">Дата последнего осмотра:</label>
        <input type="date" v-model="siz.lastInspectDate" id="lastInspectDate" />
      </div>

      <!-- Количество -->
      <div class="form-group">
        <label for="quantity">Количество:</label>
        <input
          v-model="siz.quantity"
          type="number"
          id="quantity"
          min="1"
          placeholder="Введите количество"
          value="1"
          required
        />
      </div>

      <!-- Примечания -->
      <div class="form-group">
        <label for="note">Примечания:</label>
        <div>
          <select v-model="siz.note" id="note">
            <option value="">Выберите примечание</option>
            <option v-for="note in notes" :key="note" :value="note">
              {{ note }}
            </option>
          </select>
          <input
            v-if="siz.note === 'new'"
            v-model="newNote"
            type="text"
            placeholder="Добавить новое примечание"
          />
        </div>
      </div>

      <!-- Кнопка отправки -->
      <div class="form-actions">
        <button type="submit">
          {{ isEditMode ? "Сохранить изменения" : "Добавить СИЗ" }}
        </button>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  name: "EditDevicePage",
  props: {
    // Если редактируем существующий элемент, он передается через пропс
    existingSIZ: {
      type: Object,
      default: null,
    },
    locations: {
      type: Array,
      default: () => ["Подстанция 35кВ", "Подстанция 110кВ"],
    },
    types: {
      type: Array,
      default: () => [
        "Диэлектрические перчатки",
        "Диэлектрические боты",
        "Указатель напряжения",
        "Изолируюшая штанга",
      ],
    },
    voltageClasses: {
      type: Array,
      default: () => [1, 10, 35, 110],
    },
    szTypes: {
      type: Array,
      default: () => ["Перчатки", "Боты", "УВН", "ШОУ"],
    },
    notes: {
      type: Array,
      default: () => ["Требуется проверка", "Испытано", "Осмотрено"],
    },
  },
  data() {
    return {
      siz: {
        location: "",
        type: "",
        voltageClass: "",
        szType: "",
        number: "",
        testDate: "",
        nextTestDate: "",
        lastInspectDate: "",
        quantity: 1,
        note: "",
      },
      isEditMode: false,
      newLocation: "",
      newType: "",
      newVoltageClass: "",
      newSzType: "",
      newNote: "",
    };
  },
  mounted() {
    // Если передан существующий СИЗ, включаем режим редактирования
    if (this.existingSIZ) {
      this.siz = { ...this.existingSIZ };
      this.isEditMode = true;
    }
  },
  methods: {
    setNextTestDate() {
      if (!this.siz.testDate) return;

      const testDate = new Date(this.siz.testDate);
      let monthsToAdd = 0;

      switch (this.siz.type) {
        case "Диэлектрические перчатки":
          monthsToAdd = 6;
          break;
        case "Указатель напряжения":
          monthsToAdd = 12;
          break;
        case "Изолирующая штанга":
          monthsToAdd = 24;
          break;
        case "Диэлектрические боты":
          monthsToAdd = 36;
          break;
        default:
          return;
      }
      // Увеличение месяца
      const nextTestDate = new Date(
        testDate.setMonth(testDate.getMonth() + monthsToAdd)
      );
      this.siz.nextTestDate = nextTestDate.toISOString().substr(0, 10); // Форматируем в YYYY-MM-DD для календаря
    },
    submitForm() {
      // Если пользователь добавляет новое значение, используем его
      if (this.newLocation) this.siz.location = this.newLocation;
      if (this.newType) this.siz.type = this.newType;
      if (this.newVoltageClass) this.siz.voltageClass = this.newVoltageClass;
      if (this.newSzType) this.siz.szType = this.newSzType;
      if (this.newNote) this.siz.note = this.newNote;

      // В зависимости от режима, отправляем событие
      if (this.isEditMode) {
        this.$emit("updateSIZ", this.siz);
      } else {
        this.$emit("addSIZ", this.siz);
      }
    },
  },
};
</script>

<style scoped>
.edit-siz-page {
  padding: 20px;
}
.form-group {
  margin-bottom: 20px;
}
.form-group label {
  display: block;
  margin-bottom: 5px;
}
.form-group input,
.form-group select {
  width: 100%;
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #ddd;
}
.form-actions {
  margin-top: 20px;
}
.form-actions button {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
.form-actions button:hover {
  background-color: #0056b3;
}
</style>
