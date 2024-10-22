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
        :options="departments"
        v-model="user.department"
        placeholder="Выберите подразделение"
        newPlaceholder="Добавить новое подразделение"
        v-bind:newValue="newDepartment"
        @update:newValue="addNewDepartment"
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
import { mapActions, mapGetters } from "vuex";
import { useToast } from "vue-toastification"; // Импорт уведомлений

export default {
  name: "ProfilePage",
  components: { InputField },
  data() {
    return {
      profilePhotoUrl: null,
      emailVerified: false,
      phoneVerified: false,
      emailVerificationInProgress: false,
      phoneVerificationInProgress: false,
      isSaving: false, // Управление состоянием кнопки сохранения
    };
  },
  computed: {
    ...mapGetters(["getUser"]),
    user() {
      return this.getUser || {}; // Пустой объект, если нет данных пользователя
    },
  },
  async created() {
    // Загрузка данных пользователя при загрузке компонента
    await this.loadUser();
  },
  methods: {
    ...mapActions(["loadUser", "updateUser"]),

    async submitProfileData() {
      const toast = useToast();
      this.isSaving = true;

      try {
        // Отправка обновленных данных пользователя на сервер
        await this.updateUser(this.user);
        toast.success("Профиль успешно сохранен!");
        console.log("Профиль успешно сохранен!");
      } catch (error) {
        toast.error("Ошибка при сохранения профиля!");
        console.error("Ошибка сохранения профиля:", error);
      } finally {
        this.isSaving = false;
      }
    },

    uploadProfilePhoto(event) {
      const toast = useToast();
      const file = event.target.files[0];

      // Логика для загрузки фото профиля (например, отправка на сервер)
      if (file && file.size < 5 * 1024 * 1024) {
        // Проверка размера файла
        this.profilePhotoUrl = URL.createObjectURL(file);
        toast.success("Фото профиля успешно обновлено!");
      } else {
        toast.error("Размер файла должен быть не более 5Мб!");
        console.log("Размер файла более 5Мб!");
      }
    },

    async sendEmailVerification() {
      const toast = useToast();
      this.emailVerificationInProgress = true;

      try {
        // Эмуляция отправки кода подтверждения на почту
        await new Promise((resolve) => setTimeout(resolve, 2000));
        toast.success("Код подтверждения отправлен на почту!");
        console.log("Код подтверждения отправлен на почту");
        this.emailVerified = true; // Предполагаем, что верификация успешна
        toast.success("Почта успешно подтверждена!");
      } catch (error) {
        toast.error("Ошибка подтверждения почты!");
        console.error("Ошибка подтверждения почты:", error);
      } finally {
        this.emailVerificationInProgress = false;
      }
    },
    async sendPhoneVerification() {
      const toast = useToast();
      this.phoneVerificationInProgress = true;

      try {
        // Эмуляция отправки кода подтверждения на телефон
        await new Promise((resolve) => setTimeout(resolve, 2000));
        toast.success("Код подтверждения отправлен на телефон!");
        console.log("Код подтверждения отправлен на телефон");
        this.phoneVerified = true; // Предполагаем, что верификация успешна
        toast.success("Телефон успешно подтвержден!");
      } catch (error) {
        toast.error("Ошибка подтверждения телефона!");
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
