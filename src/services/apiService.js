import axios from "axios";

const API_URL = "/api/siz-items";

// Получение всех записей СИЗ
export const getSIZItems = () => axios.get(API_URL);

// Создание новой записи СИЗ
export const createSIZItem = (item) => axios.post(API_URL, item);

// Обновление записи СИЗ
export const updateSIZItem = (id, updatedItem) =>
  axios.put(`${API_URL}/${id}`, updatedItem);

// Удаление записи СИЗ
export const deleteSIZItem = (id) => axios.delete(`${API_URL}/${id}`);
