import { createStore } from "vuex";
import axios from "axios";

export default createStore({
  state: {
    user: null, // Хранилище для данных пользователя
    users: [], // Хранилище для зарегистрированных пользователей
    // Филиалы
    branches: [
      "Владимирэнерго",
      "Ивэнерго",
      "Калугаэнерго",
      "Кировэнерго",
      "Мариэнерго",
      "Нижновэнерго",
      "Рязаньэнерго",
      "Тулэнерго",
      "Удмуртэнерго",
    ],
    // Подразделения
    departments: ["new", "РЭС", "СПС УВС", "УВС", "СРЗАиМ", "Служба испытаний"],
    // РЭСы
    districts: [
      "Вичугский РЭС",
      "Ивановский РЭС",
      "Кинешемский РЭС",
      "Пучежский РЭС",
      "Тейковский РЭС",
      "Шуйский РЭС",
      "Ивановские городские электрические сети",
    ],
    // Бригады
    brigades: [
      "new",
      "Ивановская бригада",
      "Пестяковская бригада",
      "Тейковская бригада",
      "Фурмановская бригада",
      "Шуйская бригада",
      "Южная бригада",
    ],
    selectedBranch: null, // Текущий выбранный филиал
    selectedDepartment: null, // Текущее выбранное подразделение
    selectedDistrict: null, // Текущий выбранный район (РЭС)
    selectedBrigade: null, // Текущая выбранная бригада
    sizItems: [], // Хранилище для данных о СЗ
    filteredSIZItems: [], // Хранилище для отфильтрованных данных о СЗ
    savedFilters: null, // Хранилище для фильтров
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
      "ТП 0,4/6 кВ",
      "ТП 0,4/10 кВ",
    ],
    types: [
      "new",
      "Перчатки диэлектрические",
      "Боты диэлектрические",
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
    voltages: ["new", "0,4", "1", "6", "10", "15", "35", "110"],
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
      "ШО-6",
      "ШО-10",
      "ШО-10/15",
      "ШО-15",
      "ШО-35",
      "ШО-110",
      "ШОУ-1",
      "ШОУ-6",
      "ШОУ-10",
      "ШОУ-15",
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
    inspectionResults: [
      "new",
      "Испытано.",
      "Осмотрено.",
      "Осмотрено. Испытано.",
      "Осмотрено. Необходимо отправить на испытания!",
      "Осмотрено. Испытание просрочено!",
      "Необходимо выполнить осмотр!",
      "Необходимо выполнить осмотр! Испытано.",
      "Необходимо отправить на испытания!",
      "Испытание просрочено!",
    ],
  },
  mutations: {
    // Мутация для добавления нового подразделения
    ADD_DEPARTMENT(state, newDepartment) {
      if (!state.departments.includes(newDepartment)) {
        state.departments.push(newDepartment);
      }
    },
    // Мутация для добавления новой бригады
    ADD_BRIGADE(state, newBrigade) {
      if (!state.brigades.includes(newBrigade)) {
        state.brigades.push(newBrigade);
      }
    },
    // Мутация для выбора филиала
    SET_SELECTED_BRANCH(state, branch) {
      state.selectedBranch = branch;
    },
    // Мутация для выбора подразделения
    SET_SELECTED_DEPARTMENT(state, department) {
      state.selectedDepartment = department;
    },
    // Мутация для выбора района (РЭС)
    SET_SELECTED_DISTRICT(state, district) {
      state.selectedDistrict = district;
    },
    // Мутация для выбора бригады
    SET_SELECTED_BRIGADE(state, brigade) {
      state.selectedBrigade = brigade;
    },
    // Мутация для изменения пользователя
    ADD_USER(state, user) {
      if (!state.users.includes(user)) {
        state.users.push(user);
      }
    },
    SET_USER(state, userData) {
      state.user = userData;
    },
    SET_USERS(state, users) {
      state.users = users;
    },
    UPDATE_USER(state, updatedUser) {
      const index = state.users.findIndex((user) => user.id === updatedUser.id);
      if (index !== -1) {
        state.users.splice(index, 1, updatedUser);
      }
    },
    DELETE_USER(state, userId) {
      state.users = state.users.filter((user) => user.id !== userId);
    },
    // Мутация для добавления нового местоположения
    ADD_LOCATION(state, newLocation) {
      if (!state.locations.includes(newLocation)) {
        state.locations.push(newLocation);
      }
    },
    // Мутация для добавления нового типа
    ADD_TYPE(state, newType) {
      if (!state.types.includes(newType)) {
        state.types.push(newType);
      }
    },
    // Мутация для добавления нового класса напряжения
    ADD_VOLTAGE(state, newVoltage) {
      if (!state.voltages.includes(newVoltage)) {
        state.voltages.push(newVoltage);
      }
    },
    // Мутация для добавления нового типа СЗ
    ADD_SZ_TYPE(state, newSzType) {
      if (!state.szTypes.includes(newSzType)) {
        state.szTypes.push(newSzType);
      }
    },
    // Мутация для добавления нового результата осмотра
    ADD_INSPECTION_RESULT(state, newInspectionResult) {
      if (!state.inspectionResults.includes(newInspectionResult)) {
        state.inspectionResults.push(newInspectionResult);
      }
    },
    // Мутация для добавления нового подразделения
    ADD_DEPARTMENT(state, newDepartment) {
      if (!state.departments.includes(newDepartment)) {
        state.departments.push(newDepartment);
      }
    },
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
    SET_SAVED_FILTERS(state, filters) {
      state.savedFilters = filters; // Сохраняем фильтры
    },
    ADD_SIZ(state, newSIZ) {
      console.log(`Новое СИЗ передано в store: ${newSIZ}`);
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
    // Экшен для добавления нового подразделения
    addDepartment({ commit }, newDepartment) {
      commit("ADD_DEPARTMENT", newDepartment);
    },
    // Экшен для добавления новой бригады
    addBrigade({ commit }, newBrigade) {
      commit("ADD_BRIGADE", newBrigade);
    },
    // Экшен для выбора филиала
    selectBranch({ commit }, branch) {
      commit("SET_SELECTED_BRANCH", branch);
    },
    // Экшен для выбора подразделения
    selectDepartment({ commit }, department) {
      commit("SET_SELECTED_DEPARTMENT", department);
    },
    // Экшен для выбора района (РЭС)
    selectDistrict({ commit }, district) {
      commit("SET_SELECTED_DISTRICT", district);
    },
    // Экшен для выбора бригады
    selectBrigade({ commit }, brigade) {
      commit("SET_SELECTED_BRIGADE", brigade);
    },
    // Экшен для загрузки всех пользователей (Администрирование)
    async fetchUsers({ commit }) {
      try {
        const response = await axios.get("/api/users");
        commit("SET_USERS", response.data);
      } catch (error) {
        console.error("Ошибка при загрузке пользователей:", error);
      }
    },
    // Экшен для создания нового пользователя (Администрирование)
    async addUser({ commit }, newUser) {
      try {
        const response = await axios.post("/api/users", newUser);
        commit("ADD_USER", response.data);
      } catch (error) {
        console.error("Ошибка при добавлении пользователя:", error);
      }
    },
    // Экшен для создания нового пользователя (Регистрация)
    async createUser({ commit }, userData) {
      try {
        // Запрос на сервер
        const response = await axios.post("/api/users", userData);
        const newUser = response.data;
        // Устанавка текущего пользователя
        commit("SET_USER", newUser);
        console.log("Пользователь успешно зарегистрирован:", newUser);
      } catch (error) {
        console.error("Ошибка при регистрации пользователя:", error);
        throw error; // Проброс ошибки дальше
      }
    },
    // Экшен для загрузки данных пользователя (Профиль)
    async loadUser({ commit, state }) {
      try {
        if (!state.user || !state.user.id) {
          throw new Error("User not logged in");
        }
        const response = await axios.get(`/api/users/${state.user.id}`);
        commit("SET_USER", response.data);
      } catch (error) {
        console.error("Ошибка при загрузке данных пользователя:", error);
      }
    },
    // Экшен для обновления данных пользователя
    async updateUser({ commit, state }, updatedUser) {
      try {
        if (!state.user || !state.user.id) {
          throw new Error("User not logged in");
        }
        // Обновление данных на сервере
        const response = await axios.put(
          `/api/users/${updatedUser.id}`,
          updatedUser
        );
        commit("UPDATE_USER", response.data);
      } catch (error) {
        console.error("Ошибка при обновлении пользователя:", error);
        throw error;
      }
    },
    async deleteUser({ commit }, userId) {
      try {
        await axios.delete(`/api/users/${userId}`);
        commit("DELETE_USER", userId);
      } catch (error) {
        console.error("Ошибка при удалении пользователя:", error);
      }
    },
    // Экшены для СЗ
    addLocation({ commit }, newLocation) {
      commit("ADD_LOCATION", newLocation);
    },
    addType({ commit }, newType) {
      commit("ADD_TYPE", newType);
    },
    addVoltage({ commit }, newVoltage) {
      commit("ADD_VOLTAGE", newVoltage);
    },
    addSzType({ commit }, newSzType) {
      commit("ADD_SZ_TYPE", newSzType);
    },
    addInspectionResult({ commit }, newInspectionResult) {
      commit("ADD_INSPECTION_RESULT", newInspectionResult);
    },
    // Добавление нового подразделения
    addDepartment({ commit }, newDepartment) {
      commit("ADD_DEPARTMENT", newDepartment);
    },
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
          ? item.type.toLowerCase().includes(filters.search.toLowerCase()) ||
            item.szType.toLowerCase().includes(filters.search.toLowerCase()) ||
            item.number.toString().includes(filters.search)
          : true;
        const matchesLocation = filters.selectedLocation
          ? item.location === filters.selectedLocation
          : true;
        const matchesType = filters.selectedType
          ? item.type === filters.selectedType
          : true;
        const matchesVoltage = filters.selectedVoltage
          ? item.voltage === filters.selectedVoltage
          : true;

        // Преобразование дат в ISO формат перед сравнением
        const itemNextTestDate = new Date(item.nextTestDate)
          .toISOString()
          .split("T")[0];
        const filterDateFrom = filters.nextTestDateFrom
          ? new Date(filters.nextTestDateFrom).toISOString().split("T")[0]
          : null;
        const filterDateTo = filters.nextTestDateTo
          ? new Date(filters.nextTestDateTo).toISOString().split("T")[0]
          : null;

        const matchesDateFrom = filterDateFrom
          ? itemNextTestDate >= filterDateFrom
          : true;
        const matchesDateTo = filterDateTo
          ? itemNextTestDate <= filterDateTo
          : true;

        return (
          matchesSearch &&
          matchesLocation &&
          matchesType &&
          matchesVoltage &&
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
        // Запрос на сервер
        const response = await axios.post("api/siz-items", newSIZ);
        // Добавляем в store данные из ответа сервера
        commit("ADD_SIZ", response.data);
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
    // Getter для получения списка филиалов
    getBranches: (state) => state.branches,
    // Getter для получения списка подразделений
    getDepartments: (state) => state.departments,
    // Getter для получения списка районов (РЭС)
    getDistricts: (state) => state.districts,
    // Getter для получения списка бригад
    getBrigades: (state) => state.brigades,
    // Getter для получения текущего выбранного филиала
    getSelectedBranch: (state) => state.selectedBranch,
    // Getter для получения текущего выбранного подразделения
    getSelectedDepartment: (state) => state.selectedDepartment,
    // Getter для получения текущего выбранного района (РЭС)
    getSelectedDistrict: (state) => state.selectedDistrict,
    // Getter для получения текущей выбранной бригады
    getSelectedBrigade: (state) => state.selectedBrigade,
    // Getter для получения данных пользователя
    getUser: (state) => state.user,
    // Getter для получения всех зарегистрированных пользователей
    getAllUsers: (state) => state.users,
    // Getter для получения списка подразделений
    getDepartments: (state) => state.departments,

    // Getters для получения данных о СЗ
    getSizItems: (state) => state.sizItems,
    getFilteredSizItems: (state) => state.filteredSIZItems,
    getLocations: (state) => state.locations,
    getTypes: (state) => state.types,
    getVoltages: (state) => state.voltages,
    getSzTypes: (state) => state.szTypes,
    getInspectionResults: (state) => state.inspectionResults,
  },
});
