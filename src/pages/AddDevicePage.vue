<template>
  <div class="add-siz-page">
    <h1>Добавить новое СИЗ</h1>
    <form @submit.prevent="submitForm">
      <!-- Местонахождение -->
      <InputField
        fieldId="location"
        label="Местонахождение:"
        v-bind:modelValue="siz.location"
        v-on:update:modelValue="(value) => (siz.location = value)"
        :options="locations"
        placeholder="Выберите местонахождение"
        newPlaceholder="Добавить новое местонахождение"
        v-bind:newValue="newLocation"
        v-on:update:newValue="(value) => (newLocation = value)"
      />

      <!-- Вид СЗ -->
      <InputField
        fieldId="type"
        label="Вид СЗ:"
        v-bind:modelValue="siz.type"
        v-on:update:modelValue="(value) => (siz.type = value)"
        :options="types"
        placeholder="Выберите вид СЗ"
        newPlaceholder="Добавить новый вид СЗ"
        v-bind:newValue="newType"
        v-on:update:newValue="(value) => (newType = value)"
      />

      <!-- Класс напряжения (кВ) -->
      <InputField
        fieldId="voltageClass"
        label="Класс напряжения (кВ):"
        v-bind:modelValue="siz.voltageClass"
        v-on:update:modelValue="(value) => (siz.voltageClass = value)"
        :options="voltageClasses"
        placeholder="Выберите класс напряжения"
        newPlaceholder="Добавить новый класс напряжения"
        v-bind:newValue="newVoltageClass"
        v-on:update:newValue="(value) => (newVoltageClass = value)"
      />

      <!-- Тип СЗ -->
      <InputField
        fieldId="szType"
        label="Тип СЗ:"
        v-bind:modelValue="siz.szType"
        v-on:update:modelValue="(value) => (siz.szType = value)"
        :options="szTypes"
        placeholder="Выберите тип СЗ"
        newPlaceholder="Добавить новый тип СЗ"
        v-bind:newValue="newSzType"
        v-on:update:newValue="(value) => (newSzType = value)"
      />

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
          @change="calculateNextTestDate"
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
        <input
          type="date"
          v-model="siz.lastInspectDate"
          id="lastInspectDate"
          required
        />
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
          required
        />
      </div>

      <!-- Примечания -->
      <InputField
        fieldId="note"
        label="Примечания:"
        v-bind:modelValue="siz.note"
        v-on:update:modelValue="(value) => (siz.note = value)"
        :options="notes"
        placeholder="Выберите примечание"
        newPlaceholder="Добавить новое примечание"
        v-bind:newValue="newNote"
        v-on:update:newValue="(value) => (newNote = value)"
      />

      <!-- Кнопка добавления -->
      <div class="form-actions">
        <button type="submit">Добавить СИЗ</button>
      </div>
    </form>

    <!-- Подключаем компонент для расчета дат -->
    <DateCalculations
      ref="dateCalculations"
      :siz="siz"
      @updateNextTestDate="updateNextTestDate"
      @updateLastInspectDate="updateLastInspectDate"
      @updateNote="updateNote"
    />
  </div>
</template>

<script>
import InputField from "../components/InputField.vue";
import DateCalculations from "../components/DateCalculations.vue";
import { mapState } from "vuex";
import {
  calculateNextTestDate,
  getLastInspectDate,
  getAutomaticNote,
} from "../utils/dateUtils.js";

export default {
  name: "AddDevicePage",
  components: {
    InputField,
    DateCalculations,
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
      newLocation: "",
      newType: "",
      newVoltageClass: "",
      newSzType: "",
      newNote: "",
    };
  },
  computed: {
    ...mapState(["locations", "types", "voltageClasses", "szTypes", "notes"]),
  },
  methods: {
    calculateNextTestDate() {
      this.siz.nextTestDate = calculateNextTestDate(
        this.siz.type,
        new Date(this.siz.testDate)
      );
      this.updateLastInspectDate();
      this.updateNote();
    },
    updateLastInspectDate() {
      this.siz.lastInspectDate = getLastInspectDate();
    },
    updateNote() {
      const currentDate = new Date();
      const nextTestDate = new Date(this.siz.nextTestDate);
      const differenceInMs = nextTestDate - currentDate;

      this.siz.note = getAutomaticNote(differenceInMs);
    },
    submitForm() {
      ["location", "type", "voltageClass", "szType", "note"].forEach(
        (field) => {
          const newValue =
            this[`new${field.charAt(0).toUpperCase() + field.slice(1)}`];
          if (newValue) {
            this.siz[field] = newValue;
          }
        }
      );
      this.$emit("addSIZ", this.siz);
      this.$router.push("/security-device");
    },
  },
};
</script>

<style scoped>
.add-siz-page {
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
