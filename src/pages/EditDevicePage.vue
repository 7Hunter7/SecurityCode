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
        v-model="formattedTestDate"
        @input="updateTestDate"
        @change="calculateNextTestDate"
        required
      />
      <InputField
        label="Дата следующего испытания"
        type="date"
        v-model="formattedNextTestDate"
        @input="updateNextTestDate"
        required
      />
      <InputField
        label="Дата последнего осмотра"
        type="date"
        v-model="formattedLastInspectDate"
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
      <InputField label="Примечания" :options="notes" v-model="siz.note" />

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
  getAutomaticNote,
} from "../utils/dateUtils.js";
import { mapState, mapActions, mapGetters } from "vuex";
import { format } from "date-fns"; // Форматирование дат

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
        note: "",
      },
      formattedTestDate: "", // Форматированная дата для отображения
      formattedNextTestDate: "",
      formattedLastInspectDate: "",
    };
  },
  computed: {
    ...mapState(["locations", "types", "voltageClasses", "szTypes", "notes"]),
    ...mapGetters(["getSizItems"]),
  },
  mounted() {
    this.loadData(); // Загрузка данных при монтировании компонента
  },
  methods: {
    ...mapActions(["loadSIZItems"]),
    loadData() {
      // Проверка наличия данных в store
      if (!this.getSizItems.length) {
        this.loadSIZItems().then(() => this.fillFormData());
      } else {
        this.fillFormData();
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

          // Преобразуем даты в нужный формат
          this.formattedTestDate = this.formatDate(this.siz.testDate);
          this.formattedNextTestDate = this.formatDate(this.siz.nextTestDate);
          this.formattedLastInspectDate = this.formatDate(
            this.siz.lastInspectDate
          );
        } else {
          console.warn("Не удалось найти СИЗ с таким ID");
        }
      }
    },
    formatDate(date) {
      if (!date) return "";
      return format(new Date(date), "dd.MM.yyyy"); // Используем формат дд.мм.гггг
    },
    updateTestDate(event) {
      this.siz.testDate = event.target.value;
      this.formattedTestDate = this.formatDate(this.siz.testDate);
    },
    updateNextTestDate(event) {
      this.siz.nextTestDate = event.target.value;
      this.formattedNextTestDate = this.formatDate(this.siz.nextTestDate);
    },
    updateLastInspectDate(event) {
      this.siz.lastInspectDate = event.target.value;
      this.formattedLastInspectDate = this.formatDate(this.siz.lastInspectDate);
    },
    calculateNextTestDate() {
      if (this.siz.testDate && this.siz.type) {
        this.siz.nextTestDate = calculateNextTestDate(
          this.siz.type,
          new Date(this.siz.testDate)
        );
        this.siz.lastInspectDate = getLastInspectDate();
        const differenceInMs = new Date(this.siz.nextTestDate) - new Date();
        this.siz.note = getAutomaticNote(differenceInMs);
      }
    },
    submitForm() {
      this.$emit("updateSIZ", this.siz);
      this.$router.push("/security-device");
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
