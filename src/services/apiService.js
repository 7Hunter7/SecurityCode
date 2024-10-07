import axios from "axios";

const API_URL = "/api"; // Используем прокси

// Получение всех записей СИЗ
export const getSIZItems = () => axios.get(`${API_URL}/siz-items`);

// Создание новой записи СИЗ
export const createSIZItem = (item) => axios.post(`${API_URL}/siz-items`, item);

// Обновление записи СИЗ
export const updateSIZItem = (id, updatedItem) =>
  axios.put(`${API_URL}/siz-items/${id}`, updatedItem);

// Удаление записи СИЗ
export const deleteSIZItem = (id) => axios.delete(`${API_URL}/siz-items/${id}`);
