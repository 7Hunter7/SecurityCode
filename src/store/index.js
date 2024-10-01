import { createStore } from "vuex";
import axios from "axios";

export default createStore({
  state: {
    sizItems: [], // Хранилище для данных о СИЗ
    filteredSIZItems: [], // Хранилище для отфильтрованных данных о СИЗ
    locations: [
      "new",
      "ПС 110 кВ Ивановская-6",
      "ПС 35 кВ Жуково",
      "ПС 35 кВ Дегтярево",
      "ПС 35 кВ Кукарино",
      "ПС 35 кВ Воскресенское",
      "ПС 110 кВ Ивановская-14",
      "ПС 110 кВ Строммашина",
      "ПС 110 кВ Дружба",
      "ПС 110 кВ Лежнево",
      "Бригада",
      "ОВБ",
      "ТП 0,4/10кВ",
      "ТП 0,4/10кВ",
    ],
    types: [
      "new",
      "Диэлектрические перчатки",
      "Диэлектрические боты",
      "Указатель напряжения",
      "Изолирующая штанга",
    ],
    voltageClasses: [
      "new",
      "0,4",
      "1",
      "3",
      "6",
      "10",
      "15",
      "20",
      "35",
      "110",
      "220",
    ],
    szTypes: [
      "new",
      "-",
      "УНН-0,4",
      "УН-1",
      "УНН-1",
      "УВН-6",
      "УВН-10",
      "УВН-35",
      "УВБНК-35",
      "УВН-110",
      "УВН-220",
      "ШО-1",
      "ШО-10",
      "ШО-15",
      "ШО-35",
      "ШО-110",
      "ШО-220",
      "ШОУ-1",
      "ШОУ-6",
      "ШОУ-10",
      "ШОУ-35",
      "ШОУ-110",
      "ШОУ-220",
    ],
    notes: [
      "new",
      "Осмотрено",
      "Испытано",
      "Осмотрено, Испытано",
      "Необходимо отправить на испытания!",
      "Испытание просрочено!",
    ],
  },
  mutations: {
    // методы для изменения состояния
    SET_SIZ_ITEMS(state, items) {
      if (Array.isArray(items)) {
        state.sizItems = items;
      } else {
        console.error("Получены некорректные данные, ожидался массив");
      }
    },
    SET_FILTERED_SIZ_ITEMS(state, filteredItems) {
      state.filteredSIZItems = filteredItems;
    },
    ADD_SIZ(state, newSIZ) {
      state.sizItems.push(newSIZ); // Добавление нового СИЗ
    },
    UPDATE_SIZ(state, updatedSIZ) {
      const index = state.sizItems.findIndex((siz) => siz.id === updatedSIZ.id);
      if (index !== -1) {
        state.sizItems.splice(index, 1, updatedSIZ); // Обновление СИЗ
      }
    },
    DELETE_SIZ(state, id) {
      state.sizItems = state.sizItems.filter((item) => item.id !== id); // Удаление СИЗ по id
    },
  },
  actions: {
    async loadSIZItems({ commit }) {
      try {
        const response = await axios.get("http://localhost:3000/api/siz-items");
        // Запрос на сервер для получения данных
        if (Array.isArray(response.data)) {
          commit("SET_SIZ_ITEMS", response.data); // Сохраняем данные в state
        } else {
          console.error("Expected array but got:", response.data);
          this.sizItems = []; // Пустой массив по умолчанию
        }
      } catch (error) {
        console.error("Ошибка загрузки данных:", error);
        this.sizItems = []; // Пустой массив в случае ошибки
      }
    },
    // Применение фильтров к данным
    applyFilters({ commit, state }, filters) {
      const filteredItems = state.sizItems.filter((item) => {
        const matchesSearch = filters.search
          ? item.type.toLowerCase().includes(filters.search.toLowerCase())
          : true;
        const matchesLocation = filters.selectedLocation
          ? item.location === filters.selectedLocation
          : true;
        const matchesType = filters.selectedType
          ? item.type === filters.selectedType
          : true;
        const matchesVoltageClass = filters.selectedVoltageClass
          ? item.voltageClass === filters.selectedVoltageClass
          : true;
        const matchesDateFrom = filters.testDateFrom
          ? new Date(item.testDate) >= new Date(filters.testDateFrom)
          : true;
        const matchesDateTo = filters.testDateTo
          ? new Date(item.testDate) <= new Date(filters.testDateTo)
          : true;

        return (
          matchesSearch &&
          matchesLocation &&
          matchesType &&
          matchesVoltageClass &&
          matchesDateFrom &&
          matchesDateTo
        );
      });
      commit("SET_FILTERED_SIZ_ITEMS", filteredItems);
    },
    async addSIZ({ commit }, newSIZ) {
      try {
        // Валидация данных перед добавлением
        if (!newSIZ.location || !newSIZ.type || !newSIZ.number) {
          throw new Error("Заполните все обязательные поля!");
        }
        const response = await axios.post("/api/siz", newSIZ); // Запрос на сервер
        commit("ADD_SIZ", response.data); // Добавляем в store данные из ответа сервера
      } catch (error) {
        console.error("Ошибка при добавлении СИЗ:", error);
      }
    },
    async updateSIZ({ commit }, updatedSIZ) {
      try {
        // Валидация данных перед обновлением
        if (!updatedSIZ.location || !updatedSIZ.type || !updatedSIZ.number) {
          throw new Error("Заполните все обязательные поля!");
        }
        const response = await axios.put(
          `/api/siz/${updatedSIZ.id}`,
          updatedSIZ
        ); // Запрос на сервер
        commit("UPDATE_SIZ", response.data); // Обновляем в store
      } catch (error) {
        console.error("Ошибка при обновлении СИЗ:", error);
      }
    },
    async deleteSIZ({ commit }, id) {
      try {
        await axios.delete(`/api/siz-items/${id}`);
        commit("DELETE_SIZ", id); // Удаляем запись локально в хранилище
      } catch (error) {
        console.error("Ошибка удаления СИЗ:", error);
      }
    },
  },
  getters: {
    // методы для чтения состояния
    getSizItems: (state) => state.sizItems,
    getFilteredSizItems: (state) => state.filteredSIZItems,

    getLocations: (state) => state.locations,
    getTypes: (state) => state.types,
    getVoltageClasses: (state) => state.voltageClasses,
    getSzTypes: (state) => state.szTypes,
    getNotes: (state) => state.notes,
  },
});
