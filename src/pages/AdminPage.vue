<template>
  <div class="admin-page">
    <h1>Панель администратора</h1>

    <!-- Кнопка для добавления нового пользователя -->
    <button :disabled="isLoading" @click="openAddUserModal">
      Добавить пользователя
    </button>

    <!-- Таблица с пользователями -->
    <table>
      <thead>
        <tr>
          <th>Имя</th>
          <th>Почта</th>
          <th>Подразделение</th>
          <th>Права доступа</th>
          <th>Действия</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user.id">
          <td>{{ user.firstName }} {{ user.lastName }}</td>
          <td>{{ user.email }}</td>
          <td>{{ user.department }}</td>
          <td>{{ user.role }}</td>
          <td>
            <button :disabled="isLoading" @click="openEditUserModal(user)">
              Редактировать
            </button>
            <button :disabled="isLoading" @click="handleDeleteUser(user.id)">
              Удалить
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Модальное окно для добавления/редактирования пользователей -->
    <UserModal
      v-if="showUserModal"
      :isEdit="isEdit"
      :user="selectedUser"
      @close="closeUserModal"
      @submit="submitUserData"
    />
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import UserModal from "../components/UserModal.vue";
import { useToast } from "vue-toastification"; // Импорт уведомлений

export default {
  name: "AdminPage",
  components: { UserModal },
  data() {
    return {
      showUserModal: false, // Флаг для отображения модального окна
      isEdit: false, // Флаг для различения добавления/редактирования
      selectedUser: null, // Пользователь, выбранный для редактирования
      isLoading: false, // Флаг управление загрузкой во время сохранения пользователя
    };
  },
  async mounted() {
    await this.fetchUsers(); // Загрузка пользователей
  },
  computed: {
    ...mapGetters(["getAllUsers"]),

    users() {
      return this.getAllUsers || []; // Возвращаем всех пользователей
    },
  },
  methods: {
    ...mapActions(["fetchUsers", "addUser", "updateUser", "deleteUser"]),

    // Открыть модальное окно для добавления пользователя
    openAddUserModal() {
      this.isEdit = false;
      this.selectedUser = null;
      this.showUserModal = true;
    },

    // Открыть модальное окно для редактирования пользователя
    openEditUserModal(user) {
      this.isEdit = true;
      this.selectedUser = { ...user }; // Данные пользователя скопированы
      this.showUserModal = true;
    },

    // Закрыть модальное окно
    closeUserModal() {
      this.showUserModal = false;
    },

    // Отправка данных пользователя (создание или редактирование)
    async submitUserData(userData) {
      const toast = useToast();

      this.isLoading = true; // Устанавка флага загрузки
      try {
        if (this.isEdit) {
          await this.updateUser(userData);
        } else {
          await this.addUser(userData);
        }
        this.closeUserModal();
        this.fetchUsers(); // Перезагрузка списока пользователей после изменений
        toast.success("Данные пользователя успешно сохранены!");
        console.log(
          `Данные пользователя с ID: ${userData.id} - успешно сохранены: ${userData}.`
        );
      } catch (error) {
        toast.error("Ошибка сохранения данных пользователя!");
        console.error("Ошибка при сохранении данных пользователя:", error);
      } finally {
        this.isLoading = false; // Сброс флага загрузки
      }
    },

    // Удаление пользователя
    async handleDeleteUser(userId) {
      const toast = useToast();

      if (confirm("Вы уверены, что хотите удалить этого пользователя?")) {
        try {
          await this.deleteUser(userId);
          this.fetchUsers(); // Перезагрузка список пользователей после удаления
          toast.success("Пользователь успешно удален!");
          console.log(`Пользователь с ID: ${userId} - успешно удален.`);
        } catch (error) {
          toast.error("Ошибка удалении пользователя!");
          console.error("Ошибка при удалении пользователя:", error);
        }
      }
    },
  },
};
</script>

<style scoped>
.admin-page {
  padding: 20px;
}
table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}
table th,
table td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}
button {
  padding: 5px 10px;
  margin: 5px;
}
</style>
