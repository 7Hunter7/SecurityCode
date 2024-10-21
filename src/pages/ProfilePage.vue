<template>
  <div class="profile-page">
    <h1>Профиль пользователя</h1>

    <form @submit.prevent="submitProfileData">
      <!-- Фото профиля -->
      <div class="form-group">
        <label for="profilePhoto">Фото профиля:</label>
        <input type="file" @change="uploadProfilePhoto" accept="image/*" />
        <img
          v-if="profilePhotoUrl"
          :src="profilePhotoUrl"
          alt="Profile Photo"
          class="profile-photo"
        />
      </div>

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
        required
      />

      <!-- Подразделение -->
      <InputField
        fieldId="department"
        label="Подразделение:"
        v-model="user.department"
        required
      />

      <!-- Почта -->
      <div class="form-group">
        <label for="email">Почта:</label>
        <input type="email" id="email" v-model="user.email" required />
        <button
          @click="sendEmailVerification"
          :disabled="emailVerificationInProgress"
        >
          {{ emailVerified ? "Почта подтверждена ✅" : "Подтвердить почту" }}
        </button>
        <div v-if="emailVerificationInProgress" class="loader"></div>
      </div>

      <!-- Телефон -->
      <div class="form-group">
        <label for="phone">Телефон:</label>
        <input type="tel" id="phone" v-model="user.phone" required />
        <button
          @click="sendPhoneVerification"
          :disabled="phoneVerificationInProgress"
        >
          {{ phoneVerified ? "Телефон подтвержден ✅" : "Подтвердить телефон" }}
        </button>
        <div v-if="phoneVerificationInProgress" class="loader"></div>
      </div>

      <!-- Настройки уведомлений -->
      <div class="form-group">
        <label>Получать уведомления:</label>
        <div>
          <label>
            <input type="checkbox" v-model="user.notifications.email" />
            На почту
          </label>
          <label>
            <input type="checkbox" v-model="user.notifications.phone" />
            На телефон
          </label>
        </div>
      </div>

      <!-- Кнопка для сохранения изменений -->
      <div class="form-actions">
        <button type="submit" :disabled="isSaving">Сохранить изменения</button>
      </div>
    </form>
  </div>
</template>

<script>
import InputField from "../components/InputField.vue";

export default {
  name: "ProfilePage",
  components: { InputField },
  data() {
    return {
      user: {
        firstName: "",
        lastName: "",
        middleName: "",
        department: "",
        email: "",
        phone: "",
        notifications: {
          email: false,
          phone: false,
        },
      },
      profilePhotoUrl: null,
      emailVerified: false,
      phoneVerified: false,
      emailVerificationInProgress: false,
      phoneVerificationInProgress: false,
      isSaving: false, // Для управления состоянием кнопки сохранения
    };
  },
  methods: {
    async submitProfileData() {
      this.isSaving = true;
      // Логика для отправки данных профиля на сервер
      console.log("Данные профиля:", this.user);
      try {
        // Эмуляция запроса на сервер для сохранения данных
        await new Promise((resolve) => setTimeout(resolve, 1000));
        alert("Профиль успешно сохранен!");
      } catch (error) {
        console.error("Ошибка сохранения профиля:", error);
      } finally {
        this.isSaving = false;
      }
    },
    uploadProfilePhoto(event) {
      const file = event.target.files[0];
      // Логика для загрузки фото профиля (например, отправка на сервер)
      if (file && file.size < 5 * 1024 * 1024) {
        // Проверка размера файла
        this.profilePhotoUrl = URL.createObjectURL(file);
      } else {
        alert("Размер файла слишком велик!");
      }
    },
    async sendEmailVerification() {
      this.emailVerificationInProgress = true;
      try {
        // Эмуляция отправки кода подтверждения на почту
        await new Promise((resolve) => setTimeout(resolve, 2000));
        alert("Код подтверждения отправлен на почту.");
        this.emailVerified = true; // Предполагаем, что верификация успешна
      } catch (error) {
        console.error("Ошибка подтверждения почты:", error);
      } finally {
        this.emailVerificationInProgress = false;
      }
    },
    async sendPhoneVerification() {
      this.phoneVerificationInProgress = true;
      try {
        // Эмуляция отправки кода подтверждения на телефон
        await new Promise((resolve) => setTimeout(resolve, 2000));
        alert("Код подтверждения отправлен на телефон.");
        this.phoneVerified = true; // Предполагаем, что верификация успешна
      } catch (error) {
        console.error("Ошибка подтверждения телефона:", error);
      } finally {
        this.phoneVerificationInProgress = false;
      }
    },
  },
};
</script>

<style scoped>
.profile-page {
  padding: 20px;
  max-width: 600px;
  margin: auto;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
}

.form-group input {
  width: 100%;
  padding: 8px;
  margin-top: 5px;
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

.profile-photo {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  margin-top: 10px;
}

.loader {
  border: 4px solid #f3f3f3;
  border-radius: 50%;
  border-top: 4px solid #3498db;
  width: 20px;
  height: 20px;
  animation: spin 2s linear infinite;
  margin-top: 10px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
