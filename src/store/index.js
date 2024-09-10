import { Store } from "vuex";

export default new Store({
  state: {
    inventory: [],
    types: ["Диэлектрические перчатки", "Защитные очки", "Изолирующие каски"],
    voltageClasses: [
      "0,4",
      "6",
      "10",
      "15",
      "20",
      "35",
      "110",
      "220",
      "330",
      "550",
    ],
    szTypes: ["Перчатки", "Очки", "Каски"],
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
        quantity: 100,
        quantityByClass: 100,
        note: "Исытания не требуются",
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
        lastInspectDate: "01.01.2023",
        quantity: 50,
        quantityByClass: 50,
        note: "Требуется проверка",
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
  },
});
