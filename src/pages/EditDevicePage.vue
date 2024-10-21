<template>
  <div class="edit-siz-page">
    <h1>Редактировать СЗ</h1>

    <form @submit.prevent="submitForm">
      <!-- Местонахождение -->
      <InputField
        fieldId="location"
        label="Местонахождение:"
        v-model="siz.location"
        v-bind:modelValue="siz.location"
        v-on:update:modelValue="(value) => (siz.location = value)"
        :options="locations"
        placeholder="Выберите местонахождение"
        newPlaceholder="Добавить новое местонахождение"
        v-bind:newValue="newLocation"
        v-on:update:newValue="(value) => (newLocation = value)"
        required
      />

      <!-- Напряжение ЭУ (кВ) -->
      <InputField
        fieldId="voltage"
        label="Напряжение ЭУ (кВ):"
        v-model="siz.voltage"
        v-bind:modelValue="siz.voltage"
        v-on:update:modelValue="(value) => (siz.voltage = value)"
        :options="voltages"
        placeholder="Выберите напряжение ЭУ"
        newPlaceholder="Добавить новое напряжение ЭУ"
        v-bind:newValue="newVoltage"
        v-on:update:newValue="(value) => (newVoltage = value)"
        required
      />

      <!-- Вид СЗ -->
      <InputField
        fieldId="type"
        label="Вид СЗ:"
        v-model="siz.type"
        v-bind:modelValue="siz.type"
        v-on:update:modelValue="(value) => (iz.type = value)"
        :options="types"
        placeholder="Выберите вид СЗ"
        newPlaceholder="Добавить новый вид СЗ"
        v-bind:newValue="newType"
        v-on:update:newValue="(value) => (newType = value)"
        required
      />

      <!-- Тип СЗ -->
      <InputField
        fieldId="szType"
        label="Тип СЗ:"
        v-model="siz.szType"
        v-bind:modelValue="siz.szType"
        v-on:update:modelValue="(value) => (siz.szType = value)"
        :options="szTypes"
        placeholder="Выберите тип СЗ"
        newPlaceholder="Добавить новый тип СЗ"
        v-bind:newValue="newSzType"
        v-on:update:newValue="(value) => (newSzType = value)"
        required
      />

      <!-- № СЗ -->
      <InputField
        label="№ СЗ"
        v-model="siz.number"
        type="text"
        placeholder="Введите номер СЗ"
        @change="updateLastInspectDateAndInspectionResult"
        required
      />

      <!-- Дата испытания -->
      <InputField
        label="Дата испытания"
        type="date"
        v-if="!isPZType"
        v-model="siz.testDate"
        @input="updateTestDate"
        @change="calculateNextTestDate"
        required
      />

      <!-- Дата следующего испытания -->
      <InputField
        label="Дата следующего испытания"
        type="date"
        v-if="!isPZType"
        v-model="siz.nextTestDate"
        @input="updateNextTestDate"
        required
      />

      <!-- Дата последнего осмотра -->
      <InputField
        label="Дата последнего осмотра"
        type="date"
        v-model="siz.lastInspectDate"
        @input="updateLastInspectDate"
        @change="updateInspectionResult"
        required
      />

      <!-- Количество -->
      <InputField
        label="Количество"
        type="number"
        v-model="siz.quantity"
        :inputType="'number'"
        min="1"
        required
      />

      <!-- Результаты осмотра -->
      <InputField
        fieldId="inspectionResult"
        label="Результат осмотра:"
        v-model="siz.inspectionResult"
        v-bind:modelValue="siz.inspectionResult"
        v-on:update:modelValue="(value) => (siz.inspectionResult = value)"
        :options="inspectionResults"
        placeholder="Выберите результат осмотра"
        newPlaceholder="Добавить новый результат осмотра"
        v-bind:newValue="newInspectionResult"
        v-on:update:newValue="(value) => (newInspectionResult = value)"
        required
      />

      <!-- Кнопка для сохранения изменений -->
      <div class="form-actions">
        <button type="submit">Сохранить изменения</button>
        <button @click="noSubmit">Отмена</button>
      </div>
    </form>
  </div>
</template>

<script>
import InputField from "../components/InputField.vue";
import {
  calculateNextTestDate,
  getLastInspectDate,
  getAutomaticInspectionResult,
  parseAndFormatDate,
} from "../utils/dateUtils.js";
import { mapState, mapActions, mapGetters } from "vuex";
import { updateSIZItem } from "../services/apiService.js";
import { useToast } from "vue-toastification"; // Импорт уведомлений
import { PZ_TYPES } from "../constants/constants.js";

export default {
  name: "EditDevicePage",
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
        quantity: "1",
        inspectionResult: "",
      },
      newLocation: "",
      newType: "",
      newVoltage: "",
      newSzType: "",
      newInspectionResult: "",
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
    ...mapGetters(["getSizItems"]),
    isPZType() {
      return PZ_TYPES.includes(this.siz.type);
    },
  },
  async mounted() {
    await this.loadData(); // Асинхронная загрузка данных
  },
  methods: {
    ...mapActions([
      "loadSIZItems",
      "updateSIZ",
      "addLocation",
      "addType",
      "addVoltage",
      "addSzType",
      "addInspectionResult",
    ]),
    async loadData() {
      try {
        // Загружаем данные независимо от их текущего состояния
        await this.loadSIZItems();
        console.log("Данные успешно обновлены");
        // Проверка наличия данных в store
        if (!this.getSizItems.length) {
          this.loadSIZItems().then(() => this.fillFormData());
        } else {
          // Заполняем форму данными
          this.fillFormData();
        }
      } catch (error) {
        console.error("Ошибка при обновлении данных", error);
      }
    },
    fillFormData() {
      if (this.$route.query.id) {
        const existingSIZ = this.getSizItems.find(
          (item) => item.id === +this.$route.query.id
        );
        if (existingSIZ) {
          this.siz = { ...existingSIZ };
          this.siz.number = String(existingSIZ.number);
          this.siz.quantity = String(existingSIZ.quantity);

          // Преобразуем строки в формат yyyy-MM-dd для input
          if (PZ_TYPES.includes(this.siz.type)) {
            this.siz.testDate = null;
            this.siz.nextTestDate = null;
            this.siz.lastInspectDate = parseAndFormatDate(
              this.siz.lastInspectDate
            );
          } else {
            this.siz.testDate = parseAndFormatDate(this.siz.testDate);
            this.siz.nextTestDate = parseAndFormatDate(this.siz.nextTestDate);
            this.siz.lastInspectDate = parseAndFormatDate(
              this.siz.lastInspectDate
            );
          }
        } else {
          console.warn("Не удалось найти СЗ с таким ID");
        }
      }
    },

    // Обновление дат
    updateLastInspectDateAndInspectionResult() {
      this.updateLastInspectDate();
      this.updateInspectionResult();
    },
    updateTestDate(event) {
      this.siz.testDate = event.target.value;
      this.calculateNextTestDate();
    },
    updateNextTestDate(event) {
      this.siz.nextTestDate = event.target.value;
      this.updateInspectionResult();
    },
    updateLastInspectDate(event) {
      if (event) {
        this.siz.lastInspectDate = event.target.value;
      } else {
        this.siz.lastInspectDate = getLastInspectDate();
      }
      this.updateInspectionResult();
    },
    updateInspectionResult() {
      const differenceInMs = new Date(this.siz.nextTestDate) - new Date();
      this.siz.inspectionResult = getAutomaticInspectionResult(
        differenceInMs,
        this.siz.lastInspectDate
      );
    },
    calculateNextTestDate() {
      if (this.siz.testDate && this.siz.type) {
        this.siz.nextTestDate = calculateNextTestDate(
          this.siz.type,
          new Date(this.siz.testDate)
        );
      }
      this.updateInspectionResult();
    },
    noSubmit() {
      this.$router.push("/security-device");
    },

    async submitForm() {
      const toast = useToast();
      let testDateForSubmitForm;
      let nextTestDateForSubmitForm;
      let lastInspectDateForSubmitForm;

      // Применяем новые значения, если они добавлены
      ["location", "type", "voltage", "szType", "inspectionResult"].forEach(
        (field) => {
          const newValue =
            this[`new${field.charAt(0).toUpperCase() + field.slice(1)}`];
          if (newValue) {
            this.siz[field] = newValue;

            // Добавляем новые значения в store
            this[`add${field.charAt(0).toUpperCase() + field.slice(1)}`](
              newValue
            );
          }
        }
      );

      // Преобразуем дату
      if (PZ_TYPES.includes(this.siz.type)) {
        testDateForSubmitForm = null;
        nextTestDateForSubmitForm = null;
        lastInspectDateForSubmitForm = parseAndFormatDate(
          this.siz.lastInspectDate
        );
      } else {
        testDateForSubmitForm = parseAndFormatDate(this.siz.testDate);
        nextTestDateForSubmitForm = parseAndFormatDate(this.siz.nextTestDate);
        lastInspectDateForSubmitForm = parseAndFormatDate(
          this.siz.lastInspectDate
        );
      }
      const updatedSIZ = {
        location: this.siz.location,
        type: this.siz.type,
        voltage: this.siz.voltage,
        szType: this.siz.szType,
        number: Number(this.siz.number), // Преобразование в число
        testDate: testDateForSubmitForm || null,
        nextTestDate: nextTestDateForSubmitForm || null,
        lastInspectDate: lastInspectDateForSubmitForm,
        quantity: Number(this.siz.quantity), // Преобразование в число
        inspectionResult: this.siz.inspectionResult,
      };
      console.log("Данные для обновления:", updatedSIZ); // Отладка данных

      try {
        const response = await updateSIZItem(this.siz.id, updatedSIZ);
        // Успешное уведомление
        toast.success("СЗ успешно обновлено!");
        console.log("СЗ успешно обновлено:", response.data);
        // Принудительное обновление данных через Vuex
        await this.$store.dispatch("loadSIZItems", { force: true });
        // Переход на страницу /security-device
        this.$router.push("/security-device");
      } catch (error) {
        toast.error("Ошибка при обновлении СЗ!");
        console.error("Ошибка при обновлении СЗ:", error);
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
