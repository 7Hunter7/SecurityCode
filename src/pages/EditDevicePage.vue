<template>
  <div class="edit-siz-page">
    <h1>Редактировать СИЗ</h1>

    <form @submit.prevent="submitForm">
      <!-- Используем компонент InputField для каждого поля -->
      <InputField
        label="Местонахождение"
        :options="locations"
        v-model="siz.location"
        :newValue.sync="newLocation"
      />
      <InputField
        label="Вид СЗ"
        :options="types"
        v-model="siz.type"
        :newValue.sync="newType"
      />
      <InputField
        label="Класс напряжения (кВ)"
        :options="voltageClasses"
        v-model="siz.voltageClass"
        :newValue.sync="newVoltageClass"
      />
      <InputField
        label="Тип СЗ"
        :options="szTypes"
        v-model="siz.szType"
        :newValue.sync="newSzType"
      />
      <InputField label="№ СЗ" type="text" v-model="siz.number" required />
      <InputField
        label="Дата испытания"
        type="date"
        v-model="siz.testDate"
        :newValue.sync="newTestDate"
        @change="calculateNextTestDate"
        required
      />
      <InputField
        label="Дата следующего испытания"
        type="date"
        v-model="siz.nextTestDate"
        :newValue.sync="newNextTestDate"
        required
      />
      <InputField
        label="Дата последнего осмотра"
        type="date"
        v-model="siz.lastInspectDate"
        :newValue.sync="newLastInspectDate"
      />
      <InputField
        label="Количество"
        type="number"
        v-model="siz.quantity"
        :newValue.sync="newQuantity"
        min="1"
        required
      />
      <InputField
        label="Примечания"
        :options="notes"
        v-model="siz.note"
        :newValue.sync="newNote"
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
  getAutomaticNote,
} from "../utils/dateUtils.js";
import { mapState, mapActions, mapGetters } from "vuex";

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
      newLocation: "",
      newType: "",
      newVoltageClass: "",
      newSzType: "",
      newTestDate: "",
      newNextTestDate: "",
      newLastInspectDate: "",
      newQuantity: "",
      newNote: "",
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
        } else {
          console.warn("Не удалось найти СИЗ с таким ID");
        }
      }
    },
    submitForm() {
      [
        "location",
        "type",
        "voltageClass",
        "szType",
        "number",
        "testDate",
        "nextTestDate",
        "lastInspectDate",
        "quantity",
        "note",
      ].forEach((field) => {
        const newValue =
          this[`new${field.charAt(0).toUpperCase() + field.slice(1)}`];
        if (newValue) {
          this.siz[field] = newValue;
        }
      });

      this.$emit("updateSIZ", this.siz);
      this.$router.push("/security-device");
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
