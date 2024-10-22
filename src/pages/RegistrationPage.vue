<template>
  <div class="registration-page">
    <h1>Регистрация пользователя</h1>

    <form @submit.prevent="submitRegistrationForm">
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
        :options="departments"
        v-model="user.department"
        placeholder="Выберите подразделение"
        newPlaceholder="Добавить новое подразделение"
        v-bind:newValue="newDepartment"
        @update:newValue="addNewDepartment"
        required
      />

      <!-- Кнопка для отправки данных -->
      <div class="form-actions">
        <button type="submit">Зарегистрироваться</button>
        <button @click.prevent="noSubmit">Отмена</button>
      </div>
    </form>
  </div>
</template>

<script>
import InputField from "../components/InputField.vue"; // Подключение InputField
import { mapGetters, mapActions } from "vuex";
import { useToast } from "vue-toastification"; // Импорт уведомлений

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
    };
  },
  computed: {
    ...mapGetters(["getDepartments"]), // Получение списка подразделений
    departments() {
      return this.getDepartments;
    },
  },
  methods: {
    ...mapActions(["createUser", "addDepartment"]),

    // Метод для добавления нового подразделения в хранилище
    addNewDepartment(newDepartment) {
      if (newDepartment && !this.departments.includes(newDepartment)) {
        this.addDepartment(newDepartment);
        this.user.department = newDepartment; // Новое подразделение
      }
    },

    // Метод для отправки данных регистрации
    async submitRegistrationForm() {
      const toast = useToast();

      try {
        const userData = {
          firstName: this.user.firstName,
          lastName: this.user.lastName,
          middleName: this.user.middleName,
          department: this.user.department,
          email: this.user.email,
          phone: this.user.phone,
        };

        // Отправлка данных на сервер
        await this.createUser(userData); // Экшен для создания пользователя
        // Успешное уведомление
        toast.success("Пользователь успешно зарегистрирован!");
        console.log("Пользователь зарегистрирован:", userData);

        // Перенаправление на страницу профиля после успешной регистрации
        this.$router.push(`/profile/${userId}`);
      } catch (error) {
        toast.error("Ошибка при регистрации пользователя!");
        console.error("Ошибка при регистрации:", error);
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
