<template>
  <div class="edit-siz-page">
    <h1>{{ isEditMode ? "Редактировать СИЗ" : "Добавить новое СИЗ" }}</h1>

    <form @submit.prevent="submitForm">
      <!-- Название -->
      <div class="form-group">
        <label for="name">Название СИЗ:</label>
        <input
          v-model="siz.name"
          type="text"
          id="name"
          placeholder="Введите название СИЗ"
          required
        />
      </div>

      <!-- Категория -->
      <div class="form-group">
        <label for="category">Категория:</label>
        <select v-model="siz.category" id="category" required>
          <option value="">Выберите категорию</option>
          <option value="каска">Каска</option>
          <option value="перчатки">Перчатки</option>
          <option value="очки">Очки</option>
          <!-- Добавить другие категории -->
        </select>
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

      <!-- Состояние -->
      <div class="form-group">
        <label for="status">Состояние:</label>
        <select v-model="siz.status" id="status" required>
          <option value="">Выберите состояние</option>
          <option value="в наличии">В наличии</option>
          <option value="на складе">На складе</option>
          <option value="в ремонте">В ремонте</option>
        </select>
      </div>

      <!-- Кнопка отправки -->
      <div class="form-actions">
        <button type="submit">
          {{ isEditMode ? "Сохранить изменения" : "Добавить СИЗ" }}
        </button>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  name: "EditDevicePage",
  props: {
    // Если редактируем существующий элемент, он передается через пропс
    existingSIZ: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      siz: {
        name: "",
        category: "",
        quantity: 1,
        status: "",
      },
      isEditMode: false,
    };
  },
  mounted() {
    // Если передан существующий СИЗ, включаем режим редактирования
    if (this.existingSIZ) {
      this.siz = { ...this.existingSIZ };
      this.isEditMode = true;
    }
  },
  methods: {
    submitForm() {
      if (this.isEditMode) {
        // Логика обновления существующего СИЗ
        this.$emit("updateSIZ", this.siz);
      } else {
        // Логика добавления нового СИЗ
        this.$emit("addSIZ", this.siz);
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
