<template>
  <div class="siz-page">
    <!-- Заголовок -->
    <h1>Учет средств индивидуальной защиты</h1>

    <!-- Панель поиска и фильтров -->
    <div class="controls">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Поиск по названию СИЗ..."
        @input="filterSIZ"
      />
      <select v-model="selectedCategory" @change="filterSIZ">
        <option value="">Все категории</option>
        <option value="каска">Каска</option>
        <option value="перчатки">Перчатки</option>
        <option value="боты">Боты</option>
        <!-- Добавить другие категории -->
      </select>
    </div>

    <!-- Таблица СИЗ -->
    <table>
      <thead>
        <tr>
          <th>Название</th>
          <th>Категория</th>
          <th>Количество</th>
          <th>Ед.изм.</th>
          <th>Состояние</th>
          <th>Действия</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in filteredSIZ" :key="item.id">
          <td>{{ item.name }}</td>
          <td>{{ item.category }}</td>
          <td>{{ item.quantity }}</td>
          <td>{{ item.units }}</td>
          <td>{{ item.status }}</td>
          <td>
            <button @click="editSIZ(item)">Редактировать</button>
            <button @click="deleteSIZ(item)">Удалить</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: "SecurityDevicePage",
  data() {
    return {
      // Данные СИЗ
      SIZItems: [
        {
          id: 1,
          name: "Каска",
          category: "каска",
          quantity: 50,
          units: "шт.",
          status: "в наличии",
        },
        {
          id: 2,
          name: "Перчатки",
          category: "перчатки",
          quantity: 100,
          units: "пар",
          status: "на испытаниях",
        },
        {
          id: 3,
          name: "Боты",
          category: "боты",
          quantity: 30,
          units: "пар",
          status: "на складе",
        },
        // Пример данных, можно добавить больше
      ],
      searchQuery: "",
      selectedCategory: "",
      filteredSIZ: [],
    };
  },
  mounted() {
    // Инициализация фильтрованных данных при загрузке страницы
    this.filteredSIZ = this.SIZItems;
  },
  methods: {
    filterSIZ() {
      // Фильтрация данных на основе поиска и выбранной категории
      this.filteredSIZ = this.SIZItems.filter((item) => {
        const matchesSearch = item.name
          .toLowerCase()
          .includes(this.searchQuery.toLowerCase());
        const matchesCategory = this.selectedCategory
          ? item.category === this.selectedCategory
          : true;
        return matchesSearch && matchesCategory;
      });
    },
    editSIZ(item) {
      // Логика редактирования СИЗ
      alert(`Редактировать: ${item.name}`);
    },
    deleteSIZ(item) {
      // Логика удаления СИЗ
      if (confirm(`Вы уверены, что хотите удалить ${item.name}?`)) {
        this.SIZItems = this.SIZItems.filter((siz) => siz.id !== item.id);
        this.filterSIZ(); // Обновить фильтрованные данные
      }
    },
  },
};
</script>

<style scoped>
.siz-page {
  padding: 20px;
}
.controls {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}
.controls input {
  padding: 8px;
  width: 200px;
}
.controls select {
  padding: 8px;
}
table {
  width: 100%;
  border-collapse: collapse;
}
table th,
table td {
  border: 1px solid #ddd;
  padding: 12px;
  text-align: left;
}
table th {
  background-color: #f4f4f4;
}
table tbody tr:hover {
  background-color: #f1f1f1;
}
button {
  padding: 6px 12px;
  margin-right: 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
button:hover {
  background-color: #007bff;
  color: white;
}
</style>
