import { createStore } from "vuex";
import axios from "axios";

export default createStore({
  state: {
    sizItems: [], // Хранилище для данных о СИЗ
    filteredSIZItems: [], // Хранилище для отфильтрованных данных о СИЗ
    locations: [
      "new",
      "ПС 35 кВ Жуково",
      "ПС 35 кВ Дегтярево",
      "ПС 35 кВ Кукарино",
      "ПС 35 кВ Воскресенское",
      "ПС 110 кВ Ивановская-6",
      "ПС 110 кВ Ивановская-14",
      "ПС 110 кВ Строммашина",
      "ПС 110 кВ Дружба",
      "ПС 110 кВ Лежнево",
      "Бригада",
      "ОВБ",
      "ТП 0,4/6кВ",
      "ТП 0,4/10кВ",
    ],
    types: [
      "new",
      "Диэлектрические перчатки",
      "Диэлектрические боты",
      "Указатель напряжения",
      "Указатель напряжения для фазировки",
      "Штанга оперативная (универсальная)",
      "Клещи изолирующие",
      "Изолирующий инструмент, комплект",
      "Комплект штанг для установки ПЗ",
      "КШЗ",
      "КШЗ (с изолирующей штангой)",
      "ПЗ для РУ",
      "ПЗ для ВЛ",
      "ПЗ для ИВЛ",
      "Наброс для ВЛ",
    ],
    voltageClasses: ["new", "0,4", "1", "6", "10", "15", "35", "110"],
    szTypes: [
      "new",
      "—",
      "УНК-04Л",
      "УН-1",
      "УНН-1",
      "УВНИ 6-10",
      "УВНИ 6-10 КБ",
      "УВНФ 6-10",
      "УВНсТФ 6-10",
      "УВНИ 6-35",
      "УВНК 6-35",
      "УВНБК 6-35",
      "УВНБУ 6-35",
      "УВНБУ 35-110",
      "УВНИ 10-110",
      "УВН-90М",
      "ШО-1",
      "ШО-10",
      "ШО-10/15",
      "ШО-15",
      "ШО-35",
      "ШО-110",
      "ШОУ-1",
      "ШОУ-6",
      "ШОУ-10",
      "ШОУ-35",
      "ШОУ-110",
      "КШЗ-0,4",
      "КШЗ-10",
      "ЗПП-15-3/35",
      "ЗПП-ПТР-35",
      "ЗПЛ-35-3/3",
      "ЗПП-110",
      "ПЗ СИП",
      "ЗПЛ-0,4",
      "ЗПЛ-10",
      "ЗНЛ-10",
      "ЗПП-1-3/3-16",
      "ЗПП-1-3/3-25",
      "ЗПП-15-3/3-35",
      "ЗПП-15-3/3-50",
      "ЗПП-35-3/3-25",
      "ЗПП-35-3/3-35",
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
