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
        @change="calculateNextTestDate"
        required
      />
      <InputField
        label="Дата следующего испытания"
        type="date"
        v-model="siz.nextTestDate"
        required
      />
      <InputField
        label="Дата последнего осмотра"
        type="date"
        v-model="siz.lastInspectDate"
      />
      <InputField
        label="Количество"
        type="number"
        v-model="siz.quantity"
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
import DateCalculations from "../components/DateCalculations.vue";
import { mapState } from "vuex";

export default {
  name: "EditDevicePage",
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
  mounted() {
    if (this.$route.params.id) {
      const existingSIZ = this.$store.getters.getSizItems.find(
        (item) => item.id === +this.$route.params.id
      );
      if (existingSIZ) {
        this.siz = { ...existingSIZ };
      }
    }
  },
  methods: {
    submitForm() {
      if (this.newLocation) this.siz.location = this.newLocation;
      if (this.newType) this.siz.type = this.newType;
      if (this.newVoltageClass) this.siz.voltageClass = this.newVoltageClass;
      if (this.newSzType) this.siz.szType = this.newSzType;
      if (this.newNote) this.siz.note = this.newNote;

      this.$emit("updateSIZ", this.siz);
      this.$router.push("/security-device");
    },
    calculateNextTestDate() {
      this.siz.nextTestDate = this.$refs.dateCalculations.setNextTestDate(
        this.siz.testDate,
        this.siz.type
      );
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
