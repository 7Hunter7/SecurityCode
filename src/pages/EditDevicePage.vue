<template>
  <div>
    <h1>Редактировать СИЗ"</h1>
    <form @submit.prevent="submitForm">
      <!-- Поля для редактирования -->
      <label>Местонахождение:</label>
      <input v-model="sizItem.location" type="text" required />

      <label>Вид СЗ:</label>
      <input v-model="sizItem.type" type="text" required />

      <label>Класс напряжения:</label>
      <input v-model="sizItem.voltageClass" type="text" required />

      <label>Тип СЗ:</label>
      <input v-model="sizItem.szType" type="text" required />

      <label>№ СЗ:</label>
      <input v-model="sizItem.number" type="number" required />

      <label>Дата испытания:</label>
      <input v-model="sizItem.testDate" type="date" required />

      <label>Дата следующего испытания:</label>
      <input v-model="sizItem.nextTestDate" type="date" required />

      <label>Дата последнего осмотра:</label>
      <input v-model="sizItem.lastInspectDate" type="date" />

      <label>Количество:</label>
      <input v-model="sizItem.quantity" type="number" required />

      <label>Примечание:</label>
      <input v-model="sizItem.note" type="text" />

      <button type="submit">
        {{ isEditMode ? "Сохранить изменения" : "Добавить" }}
      </button>
    </form>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "EditDevicePage",
  data() {
    return {
      isEditMode: false, // Проверка, режим редактирования или добавления
      sizItem: {
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
    };
  },
  async mounted() {
    const id = this.$route.query.id; // Получаем ID из query-параметров
    if (id) {
      this.isEditMode = true;
      try {
        const response = await axios.get(`/api/siz-items/${id}`);
        this.sizItem = response.data; // Загружаем данные выбранного элемента
      } catch (error) {
        console.error("Ошибка загрузки данных:", error);
      }
    }
  },
  methods: {
    async submitForm() {
      try {
        if (this.isEditMode) {
          await axios.put(
            `/api/siz-items/${this.$route.query.id}`,
            this.sizItem
          );
          alert("СИЗ успешно обновлено!");
        } else {
          await axios.post("/api/siz-items", this.sizItem);
          alert("СИЗ успешно добавлено!");
        }
        this.$router.push("/security-device"); // Переход обратно на страницу списка
      } catch (error) {
        console.error("Ошибка сохранения данных:", error);
      }
    },
  },
};
</script>
