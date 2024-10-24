<template>
  <div class="add-siz-page">
    <h1>Добавить новое СЗ</h1>
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
      <!-- Напряжение ЭУ (кВ) -->
      <InputField
        fieldId="voltage"
        label="Напряжение ЭУ (кВ):"
        v-bind:modelValue="siz.voltage"
        v-on:update:modelValue="(value) => (siz.voltage = value)"
        @change="handleVoltageChange"
        :options="voltages"
        placeholder="Выберите напряжение
      ЭУ"
        newPlaceholder="Добавить новое напряжение ЭУ"
        v-bind:newValue="newVoltage"
        v-on:update:newValue="(value) => (newVoltage = value)"
      />

      <!-- Вид СЗ -->
      <InputField
        fieldId="type"
        label="Вид СЗ:"
        v-bind:modelValue="siz.type"
        v-on:update:modelValue="(value) => (siz.type = value)"
        @change="handleTypeChange"
        :options="types"
        placeholder="Выберите вид СЗ"
        newPlaceholder="Добавить новый вид СЗ"
        v-bind:newValue="newType"
        v-on:update:newValue="(value) => (newType = value)"
      />

      <!-- Тип СЗ -->
      <InputField
        fieldId="szType"
        label="Тип СЗ:"
        v-bind:modelValue="siz.szType"
        v-on:update:modelValue="(value) => (siz.szType = value)"
        :options="filteredSzTypes"
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
          @change="updateLastInspectDateAndInspectionResult"
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
        <button type="submit">Добавить СЗ</button>
        <button @click="noSubmit">Отмена</button>
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
import {
  handleTypeChange,
  handleVoltageChange,
} from "../utils/handleChange.js";
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
        voltage: "",
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
      newVoltage: "",
      newSzType: "",
      newInspectionResult: "",
      filteredSzTypes: [], // Массив для фильтрации типов СЗ
    };
  },
  computed: {
    ...mapState([
      "locations",
      "types",
      "voltages",
      "szTypes",
      "inspectionResults",
    ]),
    isPzType() {
      return PZ_TYPES.includes(this.siz.type);
    },
  },
  mounted() {
    // Устанавливаем дату последнего осмотра как текущую дату и результат осмотра как "Осмотрено"
    this.siz.lastInspectDate = getLastInspectDate();
    this.siz.inspectionResult = "Осмотрено.";
  },
  methods: {
    ...mapActions([
      "addSIZ",
      "addLocation",
      "addType",
      "addVoltage",
      "addSzType",
      "addInspectionResult",
    ]),
    handleTypeChange() {
      // Вызов функции изменения типа
      handleTypeChange(this.siz, this.$store.state);
      // Обновление отфильтрованных типов СЗ
      this.filteredSzTypes = this.$store.state.filteredSzTypes;
    },
    handleVoltageChange() {
      // Вызов функции изменения напряжения
      handleVoltageChange(this.siz, this.$store.state);
      // Обновление отфильтрованных типов СЗ
      this.filteredSzTypes = this.$store.state.filteredSzTypes;
    },
    // Обновление даты последнего осмотра и результат осмотра
    updateLastInspectDateAndInspectionResult() {
      this.updateLastInspectDate();
      this.updateInspectionResult();
    },
    // Обновление даты следующего испытания и результат осмотра
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
    noSubmit() {
      this.$router.push("/security-device");
    },

    async submitForm() {
      const toast = useToast();

      // Проверяем и добавляем новые значения, если они введены
      if (this.newLocation) {
        this.$store.commit("ADD_LOCATION", this.newLocation); // Добавляем новое местоположение
        this.siz.location = this.newLocation; // Устанавливаем новое значение в объект СЗ
      }
      if (this.newType) {
        this.$store.commit("ADD_TYPE", this.newType); // Добавляем новый тип
        this.siz.type = this.newType;
      }
      if (this.newVoltage) {
        this.$store.commit("ADD_VOLTAGE_CLASS", this.newVoltage); // Добавляем новый Напряжение ЭУ
        this.siz.voltage = this.newVoltage;
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
        toast.success("СЗ успешно добавлено!");

        // Принудительное обновление данных через Vuex
        await this.$store.dispatch("loadSIZItems", { force: true });

        this.$router.push({
          name: "Security Device",
          query: { newItemId }, // Передаем новый элемент через query
        });
      } catch (error) {
        if (error.response && error.response.status === 400) {
          toast.error("СЗ с таким номером уже существует!");
        } else {
          toast.error("Ошибка при добавлении СЗ!");
        }
        console.error("Ошибка при добавлении СЗ:", error);
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
  display: flex;
  place-content: center space-between;
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
