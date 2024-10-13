<script setup>
import { RouterLink, RouterView } from "vue-router";
</script>

<template>
  <header class="header center">
    <!-- Навигационное меню -->
    <nav class="navigation">
      <RouterLink to="/">Главная</RouterLink>
      <RouterLink to="/add-device">Добавить СИЗ</RouterLink>
      <RouterLink to="/security-device">Учет СИЗ</RouterLink>
      <RouterLink to="/history">История</RouterLink>
      <RouterLink to="/settings">Настройки</RouterLink>
    </nav>
  </header>
  <!-- Здесь будут отображаться компоненты в зависимости от маршрута -->
  <RouterView />
</template>

<style scoped>
.header {
  background-color: #007bff;
}
.navigation {
  margin-bottom: 40px;
  display: flex;
  place-content: center space-around;
  gap: 20px;
  padding: 10px;
  background-color: #007bff;
}
.navigation ul {
  display: flex;
  list-style: none;
}
.navigation li {
  margin-right: 20px;
}
.navigation a {
  color: white;
  text-decoration: none;
}
.navigation a:hover {
  text-decoration: underline;
}
</style>
