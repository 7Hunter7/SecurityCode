<template>
  <div class="registration-page">
    <h1>Регистрация пользователя</h1>

    <form @submit.prevent="submitRegistrationData">
      <!-- Имя -->
      <InputField
        fieldId="firstName"
        label="Имя:"
        v-model="user.firstName"
        required
      />

      <!-- Фамилия -->
      <InputField
        fieldId="lastName"
        label="Фамилия:"
        v-model="user.lastName"
        required
      />

      <!-- Отчество -->
      <InputField
        fieldId="middleName"
        label="Отчество:"
        v-model="user.middleName"
      />

      <!-- Почта -->
      <InputField
        fieldId="email"
        label="Почта:"
        v-model="user.email"
        inputType="email"
        required
      />

      <!-- Телефон -->
      <InputField
        fieldId="phone"
        label="Телефон:"
        v-model="user.phone"
        inputType="tel"
        required
      />

      <!-- Подразделение -->
      <InputField
        fieldId="department"
        label="Подразделение:"
        v-model="user.department"
        :options="departments"
        placeholder="Выберите подразделение"
        newPlaceholder="Добавить новое подразделение"
        v-bind:newValue="newDepartment"
        v-on:update:newValue="(value) => (newDepartment = value)"
        required
      />

      <!-- Кнопка для отправки данных -->
      <div class="form-actions">
        <button type="submit">Зарегистрировать пользователя</button>
      </div>
    </form>
  </div>
</template>

<script>
import InputField from "../components/InputField.vue"; // Подключение InputField
import axios from "axios"; // Для отправки данных на сервер

export default {
  name: "RegistrationPage",
  components: {
    InputField,
  },
  data() {
    return {
      user: {
        firstName: "",
        lastName: "",
        middleName: "",
        email: "",
        phone: "",
        department: "",
      },
      newDepartment: "", // Для нового подразделения
      departments: ["IT", "HR", "Finance", "Marketing"], // Пример опций подразделений
    };
  },
  methods: {
    async submitRegistrationData() {
      try {
        // Подготовка данных для отправки
        const userData = { ...this.user };
        if (this.newDepartment) {
          userData.department = this.newDepartment; // Использовать новое подразделение, если оно указано
        }

        // Отправка данных на сервер
        const response = await axios.post("/api/users", userData);
        console.log("Пользователь успешно зарегистрирован:", response.data);
      } catch (error) {
        console.error("Ошибка регистрации пользователя:", error);
      }
    },
  },
};
</script>

<style scoped>
.registration-page {
  padding: 20px;
  max-width: 600px;
  margin: auto;
}

.form-actions {
  margin-top: 20px;
}

.form-actions button {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 5px;
}

.form-actions button:hover {
  background-color: #0056b3;
}
</style>
