<template>
  <div class="edit-siz-page">
    <h1>Редактировать СИЗ</h1>

    <form @submit.prevent="submitForm">
      <!-- Используем компонент InputField для каждого поля -->
      <InputField
        label="Местонахождение"
        :options="locations"
        v-model="siz.location"
        required
      />
      <InputField label="Вид СЗ" :options="types" v-model="siz.type" required />
      <InputField
        label="Класс напряжения (кВ)"
        :options="voltageClasses"
        v-model="siz.voltageClass"
        required
      />
      <InputField
        label="Тип СЗ"
        :options="szTypes"
        v-model="siz.szType"
        required
      />
      <InputField label="№ СЗ" type="text" v-model="siz.number" required />
      <InputField
        label="Дата испытания"
        type="date"
        v-if="!isPZType"
        v-model="siz.testDate"
        @input="updateTestDate"
        @change="calculateNextTestDate"
        required
      />
      <InputField
        label="Дата следующего испытания"
        type="date"
        v-if="!isPZType"
        v-model="siz.nextTestDate"
        @input="updateNextTestDate"
        required
      />
      <InputField
        label="Дата последнего осмотра"
        type="date"
        v-model="siz.lastInspectDate"
        @input="updateLastInspectDate"
        required
      />
      <InputField
        label="Количество"
        type="number"
        v-model="siz.quantity"
        :inputType="'number'"
        min="1"
        required
      />
      <InputField
        label="Результат осмотра"
        :options="inspectionResults"
        v-model="siz.inspectionResult"
      />

      <!-- Кнопка для сохранения изменений -->
      <div class="form-actions">
        <button type="submit">Сохранить изменения</button>
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
        voltageClass: "",
        szType: "",
        number: "",
        testDate: "",
        nextTestDate: "",
        lastInspectDate: "",
        quantity: "1",
        inspectionResult: "",
      },
      formattedTestDate: "", // Форматированная дата для отображения
      formattedNextTestDate: "",
      formattedLastInspectDate: "",
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
    ...mapGetters(["getSizItems"]),
    isPZType() {
      return PZ_TYPES.includes(this.siz.type);
    },
  },
  async mounted() {
    await this.loadData(); // Асинхронная загрузка данных
  },
  methods: {
    ...mapActions(["loadSIZItems"]),
    async loadData() {
      try {
        // Загружаем данные независимо от их текущего состояния
        await this.loadSIZItems();
        console.log("Данные успешно обновлены");
        // Проверка наличия данных в store
        if (!this.getSizItems.length) {
          this.loadSIZItems().then(() => this.fillFormData());
        } else {
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
          console.warn("Не удалось найти СИЗ с таким ID");
        }
      }
    },
    updateTestDate(event) {
      this.siz.testDate = event.target.value;
    },
    updateNextTestDate(event) {
      this.siz.nextTestDate = event.target.value;
    },
    updateLastInspectDate(event) {
      this.siz.lastInspectDate = event.target.value;
    },
    calculateNextTestDate() {
      if (this.siz.testDate && this.siz.type) {
        this.siz.nextTestDate = calculateNextTestDate(
          this.siz.type,
          new Date(this.siz.testDate)
        );
        this.siz.lastInspectDate = getLastInspectDate();
        const differenceInMs = new Date(this.siz.nextTestDate) - new Date();
        this.siz.inspectionResult =
          getAutomaticInspectionResult(differenceInMs);
      }
    },
    async submitForm() {
      const toast = useToast();
      let testDateForSubmitForm;
      let nextTestDateForSubmitForm;
      let lastInspectDateForSubmitForm;

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
        voltageClass: this.siz.voltageClass,
        szType: this.siz.szType,
        number: Number(this.siz.number), // Преобразование в число
        testDate: testDateForSubmitForm,
        nextTestDate: nextTestDateForSubmitForm,
        lastInspectDate: lastInspectDateForSubmitForm,
        quantity: Number(this.siz.quantity), // Преобразование в число
        inspectionResult: this.siz.inspectionResult,
      };
      console.log("Данные для обновления:", updatedSIZ); // Отладка данных

      try {
        const response = await updateSIZItem(this.siz.id, updatedSIZ);
        // Успешное уведомление
        toast.success("СИЗ успешно обновлено!");
        console.log("СИЗ успешно обновлено:", response.data);
        // Принудительное обновление данных через Vuex
        await this.$store.dispatch("loadSIZItems");
        // Переход на страницу /security-device
        this.$router.push("/security-device");
      } catch (error) {
        toast.error("Ошибка при обновлении СИЗ!");
        console.error("Ошибка при обновлении СИЗ:", error);
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
