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

      <!-- Результаты осмотра -->
      <InputField
        fieldId="inspectionResult"
        label="Результат осмотра:"
        v-bind:modelValue="siz.inspectionResult"
        v-on:update:modelValue="(value) => (siz.inspectionResult = value)"
        :options="inspectionResults"
        placeholder="Выберите результат осмотра"
        newPlaceholder="Добавить новый результат осмотра"
        v-bind:newValue="newInspectionResult"
        v-on:update:newValue="(value) => (newInspectionResult = value)"
      />

      <!-- Кнопка добавления -->
      <div class="form-actions">
        <button type="submit">Добавить СИЗ</button>
      </div>
    </form>
  </div>
</template>

<script>
import InputField from "../components/InputField.vue";
import { mapState, mapActions } from "vuex";
import {
  calculateNextTestDate,
  getLastInspectDate,
  getAutomaticInspectionResult,
} from "../utils/dateUtils.js";

export default {
  name: "AddDevicePage",
  components: {
    InputField,
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
        inspectionResult: "",
      },
      newLocation: "",
      newType: "",
      newVoltageClass: "",
      newSzType: "",
      newInspectionResult: "",
    };
  },
  computed: {
    ...mapState([
      "locations",
      "types",
      "voltageClasses",
      "szTypes",
      "inspectionResults",
    ]),
  },
  methods: {
    ...mapActions(["addSIZ"]),
    calculateNextTestDate() {
      this.siz.nextTestDate = calculateNextTestDate(
        this.siz.type,
        new Date(this.siz.testDate)
      );
      this.updateLastInspectDate();
      this.updateInspectionResult();
    },
    updateLastInspectDate() {
      this.siz.lastInspectDate = getLastInspectDate();
    },
    updateInspectionResult() {
      const currentDate = new Date();
      const nextTestDate = new Date(this.siz.nextTestDate);
      const differenceInMs = nextTestDate - currentDate;

      this.siz.inspectionResult = getAutomaticInspectionResult(differenceInMs);
    },
    async submitForm() {
      // Применяем новые значения, если они добавлены
      [
        "location",
        "type",
        "voltageClass",
        "szType",
        "inspectionResult",
      ].forEach((field) => {
        const newValue =
          this[`new${field.charAt(0).toUpperCase() + field.slice(1)}`];
        if (newValue) {
          this.siz[field] = newValue;
        }
      });
      try {
        await this.addSIZ(this.siz); // Добавляем новый элемент
        console.log("СИЗ успешно добавлено");
        this.$router.push("/security-device"); // Переход  на страницу /security-device после успешного добавления
      } catch (error) {
        console.error("Ошибка при добавлении СИЗ:", error);
      }
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
