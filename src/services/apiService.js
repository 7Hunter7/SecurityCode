import axios from "axios";

const API_URL = "http://localhost:3000/api/siz-items";

// Получение всех записей СИЗ
export const getSIZItems = () => axios.get(API_URL);

// Создание новой записи СИЗ
export const createSIZItem = (item) => axios.post(API_URL, item);

// Обновление записи СИЗ
export const updateSIZItem = (id, updatedItem) =>
  axios.put(`${API_URL}/${id}`, updatedItem);

// Удаление записи СИЗ
export const deleteSIZItem = (id) => axios.delete(`${API_URL}/${id}`);

const API_URL_USERS = "http://localhost:3000/api/users";

// Получение всех пользователей (администратор)
export const getUsers = () => axios.get(API_URL_USERS);

// Создание нового пользователя (администратор)
export const createUser = (user) => axios.post(API_URL_USERS, user);

// Обновление данных пользователя (администратор)
export const updateUser = (id, updatedUser) =>
  axios.put(`${API_URL_USERS}/${id}`, updatedUser);

// Удаление пользователя (администратор)
export const deleteUser = (id) => axios.delete(`${API_URL_USERS}/${id}`);
