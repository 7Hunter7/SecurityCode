import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    inventory: [],
  },
  mutations: {
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
    allItems: (state) => state.inventory,
  },
});
