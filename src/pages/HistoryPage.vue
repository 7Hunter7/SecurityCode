<template>
  <main>
    <h1>История изменений</h1>
    <table>
      <thead>
        <tr>
          <th>Дата</th>
          <th>Действие</th>
          <th>Тип</th>
          <th>ID</th>
          <th>Пользователь</th>
          <th>Детали</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in history" :key="item.id">
          <td>{{ new Date(item.timestamp).toLocaleString() }}</td>
          <td>{{ item.action }}</td>
          <td>{{ item.entityType }}</td>
          <td>{{ item.entityId }}</td>
          <td>{{ item.userId || "Неизвестно" }}</td>
          <td>{{ JSON.stringify(item.details) }}</td>
        </tr>
      </tbody>
    </table>
  </main>
</template>

<script setup></script>

<style scoped></style>
