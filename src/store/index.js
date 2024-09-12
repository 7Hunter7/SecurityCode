import { Store } from "vuex";

export default new Store({
  state: {
    inventory: [],
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
    voltageClasses: ["0,4", "6", "10", "15", "20", "35", "110", "220"],
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
    SIZItems: [
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
      // Добавить другие записи
    ],
  },
  mutations: {
    // методы для изменения состояния
    setInventory(state, inventory) {
      state.inventory = inventory;
    },
  },
  actions: {
    updateInventory({ commit }, inventory) {
      commit("setInventory", inventory);
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
  },
});
