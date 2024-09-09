import { Store } from "vuex";

export default new Store({
  state: {
    inventory: [],
    types: ["Диэлектрические перчатки", "Защитные очки", "Изолирующие каски"],
    voltageClasses: ["0,4 кВ", "10 кВ", "35 кВ", "110 кВ"],
    szTypes: ["Перчатки", "Очки", "Каски"],
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
