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

      <!-- Напряжение ЭУ (кВ) -->
      <InputField
        fieldId="voltageClass"
        label="Напряжение ЭУ (кВ):"
        v-bind:modelValue="siz.voltageClass"
        v-on:update:modelValue="(value) => (siz.voltageClass = value)"
        :options="voltageClasses"
        placeholder="Выберите 'Напряжение ЭУ'"
        newPlaceholder="Добавить новое 'Напряжение ЭУ'"
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
          @change="updateLastInspectDate"
          required
        />
      </div>

      <!-- Дата испытания -->
      <div class="form-group" v-if="!isPzType">
        <label for="testDate">Дата испытания:</label>
        <input
          type="date"
          v-model="siz.testDate"
          id="testDate"
          @change="updateTestDate"
          required
        />
      </div>

      <!-- Дата следующего испытания -->
      <div class="form-group" v-if="!isPzType">
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
          @change="updateInspectionResult"
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
import { createSIZItem } from "../services/apiService.js";
import {
  calculateNextTestDate,
  getLastInspectDate,
  getAutomaticInspectionResult,
} from "../utils/dateUtils.js";
import { useToast } from "vue-toastification"; // Импорт уведомлений
import { PZ_TYPES } from "../constants/constants.js";

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
    isPzType() {
      return PZ_TYPES.includes(this.siz.type);
    },
  },
  methods: {
    ...mapActions([
      "addSIZ",
      "addLocation",
      "addType",
      "addVoltageClass",
      "addSzType",
      "addInspectionResult",
    ]),

    // Обновляем дату следующего испытания и результат осмотра
    updateTestDate() {
      this.calculateNextTestDate();
      this.updateInspectionResult();
    },
    calculateNextTestDate() {
      if (this.siz.testDate) {
        const parsedTestDate = new Date(this.siz.testDate);
        if (isNaN(parsedTestDate.getTime())) {
          const toast = useToast(); // Вызов уведомления
          toast.error("Недействительная дата испытания!");
          console.error("Недействительная дата:", this.siz.testDate);
          return;
        }
        this.siz.nextTestDate = calculateNextTestDate(
          this.siz.type,
          parsedTestDate
        );
        this.updateLastInspectDate();
      } else {
        const toast = useToast(); // Вызов уведомления
        toast.error("Пожалуйста, укажите дату испытания!");
        console.error("Дата испытания не указана");
      }
    },
    updateLastInspectDate() {
      this.siz.lastInspectDate = getLastInspectDate();
      this.updateInspectionResult();
    },
    updateInspectionResult() {
      const currentDate = new Date();
      const nextTestDate = new Date(this.siz.nextTestDate);
      const differenceInMs = nextTestDate - currentDate;

      this.siz.inspectionResult = getAutomaticInspectionResult(
        differenceInMs,
        this.siz.lastInspectDate
      );
    },
    async submitForm() {
      const toast = useToast();

      // Проверяем и добавляем новые значения, если они введены
      if (this.newLocation) {
        this.$store.commit("ADD_LOCATION", this.newLocation); // Добавляем новое местоположение
        this.siz.location = this.newLocation; // Устанавливаем новое значение в объект СИЗ
      }
      if (this.newType) {
        this.$store.commit("ADD_TYPE", this.newType); // Добавляем новый тип
        this.siz.type = this.newType;
      }
      if (this.newVoltageClass) {
        this.$store.commit("ADD_VOLTAGE_CLASS", this.newVoltageClass); // Добавляем новый Напряжение ЭУ
        this.siz.voltageClass = this.newVoltageClass;
      }
      if (this.newSzType) {
        this.$store.commit("ADD_SZ_TYPE", this.newSzType); // Добавляем новый тип СЗ
        this.siz.szType = this.newSzType;
      }
      if (this.newInspectionResult) {
        this.$store.commit("ADD_INSPECTION_RESULT", this.newInspectionResult); // Добавляем новый результат осмотра
        this.siz.inspectionResult = this.newInspectionResult;
      }

      // Преобразование числовых значений
      this.siz.number = Number(this.siz.number);
      this.siz.quantity = Number(this.siz.quantity);

      try {
        const response = await createSIZItem(this.siz);
        const newItemId = response.data.id; // ID нового элемента

        // Успешное уведомление
        toast.success("СИЗ успешно добавлено!");

        // Принудительное обновление данных через Vuex
        await this.$store.dispatch("loadSIZItems");

        this.$router.push({
          name: "Security Device",
          query: { newItemId }, // Передаем новый элемент через query
        });
      } catch (error) {
        if (error.response && error.response.status === 400) {
          toast.error("СИЗ с таким номером уже существует!");
        } else {
          toast.error("Ошибка при добавлении СИЗ!");
        }
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
