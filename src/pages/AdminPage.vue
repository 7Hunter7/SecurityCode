<template>
  <div class="admin-page">
    <h1>Панель администратора</h1>

    <!-- Кнопка для добавления нового пользователя -->
    <button @click="openAddUserModal">Добавить пользователя</button>

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
            <button @click="openEditUserModal(user)">Редактировать</button>
            <button @click="deleteUser(user.id)">Удалить</button>
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

export default {
  name: "AdminPage",
  components: { UserModal },
  data() {
    return {
      showUserModal: false, // Флаг для отображения модального окна
      isEdit: false, // Флаг для различения добавления/редактирования
      selectedUser: null, // Пользователь, выбранный для редактирования
    };
  },
  computed: {
    ...mapGetters(["getAllUsers"]),

    user() {
      return this.getAllUsers || {}; // Пустой объект, если нет пользователей;
    },
  },
  methods: {
    ...mapActions(["fetchUsers", "addUser", "updateUser", "deleteUser"]),

    async created() {
      // Загружаем список пользователей при открытии страницы
      await this.fetchUsers();
      this.users = this.getAllUsers;
    },

    // Открыть модальное окно для добавления пользователя
    openAddUserModal() {
      this.isEdit = false;
      this.selectedUser = null;
      this.showUserModal = true;
    },

    // Открыть модальное окно для редактирования пользователя
    openEditUserModal(user) {
      this.isEdit = true;
      this.selectedUser = { ...user }; // Копируем данные пользователя
      this.showUserModal = true;
    },

    // Закрыть модальное окно
    closeUserModal() {
      this.showUserModal = false;
    },

    // Отправка данных пользователя (создание или редактирование)
    async submitUserData(userData) {
      if (this.isEdit) {
        await this.updateUser(userData);
      } else {
        await this.addUser(userData);
      }
      this.closeUserModal();
      this.fetchUsers(); // Перезагружаем список пользователей после изменений
    },

    // Удаление пользователя
    async deleteUser(userId) {
      if (confirm("Вы уверены, что хотите удалить этого пользователя?")) {
        await this.deleteUser(userId);
        this.fetchUsers(); // Перезагружаем список пользователей после удаления
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
