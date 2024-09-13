import { Store } from "vuex";
import axios from "axios";

export default new Store({
  state: {
    inventory: [], // Список всех СИЗ
    locations: [
      "ТП 0,4/6-10кВ",
      "Подстанция 35кВ",
      "Подстанция 110кВ",
      "Подстанция 220кВ",
    ],
    types: [
      "Диэлектрические перчатки",
      "Диэлектрические боты",
      "Указатель напряжения",
      "Изолирующая штанга",
    ],
    voltageClasses: ["0,4", "1", "6", "10", "15", "20", "35", "110", "220"],
    szTypes: [
      "Перчатки",
      "Боты",
      "УНН-0,4",
      "УНН-0,6",
      "УНН-1",
      "УВН-6",
      "УВН-10",
      "УВН-35",
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
      "Осмотрено",
      "Испытано",
      "Осмотрено, Испытано",
      "Необходимо отправить на испытания!",
      "Испытание просрочено!",
    ],
    // Пример данных СИЗ
    sizItems: [
      {
        id: 1,
        location: "Подстанция 1",
        type: "Диэлектрические перчатки",
        voltageClass: "1",
        szType: "Перчатки",
        number: "1",
        testDate: "01.06.2024",
        nextTestDate: "01.12.2024",
        lastInspectDate: "01.09.2024",
        quantity: 1,
        quantityByClass: 1,
        note: "Осмотрено, Испытано",
      },
      {
        id: 2,
        location: "Подстанция 2",
        type: "Диэлектрические боты",
        voltageClass: "10",
        szType: "Боты",
        number: "10",
        testDate: "01.01.2021",
        nextTestDate: "01.01.2024",
        lastInspectDate: "01.09.2024",
        quantity: 1,
        quantityByClass: 1,
        note: "Испытание просрочено!",
      },
      {
        id: 3,
        location: "Подстанция 3",
        type: "Указатель напряжения",
        voltageClass: "35",
        szType: "УВН-35",
        number: "33",
        testDate: "01.01.2024",
        nextTestDate: "01.01.2025",
        lastInspectDate: "01.09.2024",
        quantity: 1,
        quantityByClass: 1,
        note: "Испытано",
      },
    ],
  },
  mutations: {
    // методы для изменения состояния
    setInventory(state, inventory) {
      state.inventory = inventory;
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
  },
  actions: {
    async addSIZ({ commit }, newSIZ) {
      try {
        const response = await axios.post("/api/siz", newSIZ); // Запрос на сервер
        commit("ADD_SIZ", response.data); // Добавляем в store данные из ответа сервера
      } catch (error) {
        console.error("Ошибка при добавлении СИЗ:", error);
      }
    },
    async updateSIZ({ commit }, updatedSIZ) {
      try {
        const response = await axios.put(
          `/api/siz/${updatedSIZ.id}`,
          updatedSIZ
        ); // Запрос на сервер
        commit("UPDATE_SIZ", response.data); // Обновляем в store
      } catch (error) {
        console.error("Ошибка при обновлении СИЗ:", error);
      }
    },
  },
  getters: {
    // методы для чтения состояния
    allItems: (state) => state.inventory,
    getLocations: (state) => state.locations,
    getTypes: (state) => state.types,
    getVoltageClasses: (state) => state.voltageClasses,
    getSzTypes: (state) => state.szTypes,
    getNotes: (state) => state.notes,
    getSizItems: (state) => state.sizItems,
  },
});
