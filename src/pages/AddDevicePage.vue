<template>
  <div class="add-siz-page">
    <h1>Добавить новое СИЗ</h1>
    <form @submit.prevent="submitForm">
      <!-- Местонахождение -->
      <InputField
        fieldId="location"
        label="Местонахождение:"
        v-model="siz.location"
        :options="locations"
        placeholder="Выберите местонахождение"
        newPlaceholder="Добавить новое местонахождение"
        v-model:newValue="newLocation"
      />

      <!-- Вид СЗ -->
      <InputField
        fieldId="type"
        label="Вид СЗ:"
        v-model="siz.type"
        :options="types"
        placeholder="Выберите вид СЗ"
        newPlaceholder="Добавить новый вид СЗ"
        v-model:newValue="newType"
      />

      <!-- Класс напряжения (кВ) -->
      <InputField
        fieldId="voltageClass"
        label="Класс напряжения (кВ):"
        v-model="siz.voltageClass"
        :options="voltageClasses"
        placeholder="Выберите класс напряжения"
        newPlaceholder="Добавить новый класс напряжения"
        v-model:newValue="newVoltageClass"
      />

      <!-- Тип СЗ -->
      <InputField
        fieldId="szType"
        label="Тип СЗ:"
        v-model="siz.szType"
        :options="szTypes"
        placeholder="Выберите тип СЗ"
        newPlaceholder="Добавить новый тип СЗ"
        v-model:newValue="newSzType"
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
        v-model="siz.note"
        :options="notes"
        placeholder="Выберите примечание"
        newPlaceholder="Добавить новое примечание"
        v-model:newValue="newNote"
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
import DateCalculations from "../components/DateCalculations.vue";
import { mapState } from "vuex";

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
    setNextTestDate() {
      this.$refs.dateCalculations.setNextTestDate(this.siz);
    },
    submitForm() {
      if (this.newLocation) this.siz.location = this.newLocation;
      if (this.newType) this.siz.type = this.newType;
      if (this.newVoltageClass) this.siz.voltageClass = this.newVoltageClass;
      if (this.newSzType) this.siz.szType = this.newSzType;
      if (this.newNote) this.siz.note = this.newNote;

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
