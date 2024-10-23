<template>
  <div class="modal">
    <div class="modal-content">
      <h2>
        {{ isEdit ? "Редактировать пользователя" : "Добавить пользователя" }}
      </h2>

      <!-- Имя пользователя -->
      <InputField
        fieldId="firstName"
        label="Имя:"
        v-model="userData.firstName"
        required
      />

      <!-- Фамилия пользователя -->
      <InputField
        fieldId="lastName"
        label="Фамилия:"
        v-model="userData.lastName"
        required
      />

      <!-- Почта пользователя -->
      <InputField
        fieldId="email"
        label="Почта:"
        type="email"
        v-model="userData.email"
        required
      />

      <!-- Роль (Права доступа) -->
      <select v-model="userData.role" required>
        <option value="user">Пользователь</option>
        <option value="advanced_user">Опытный пользователь</option>
        <option value="admin">Администратор</option>
      </select>

      <!-- Кнопки -->
      <div class="actions">
        <button @click="submitUser">Сохранить</button>
        <button @click="$emit('close')">Отмена</button>
      </div>
    </div>
  </div>
</template>

<script>
import InputField from "../components/InputField.vue";

export default {
  name: "UserModal",
  props: {
    isEdit: Boolean,
    user: Object,
  },
  data() {
    return {
      userData: this.user || {
        firstName: "",
        lastName: "",
        email: "",
        role: "user", // Роль по умолчанию — пользователь
      },
    };
  },
  methods: {
    submitUser() {
      this.$emit("submit", this.userData);
    },
  },
};
</script>

<style scoped>
.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}
.modal-content {
  background: white;
  padding: 20px;
  width: 400px;
  border-radius: 8px;
}
.actions {
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
}
</style>
