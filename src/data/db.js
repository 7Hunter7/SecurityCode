import { Sequelize } from "sequelize";

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./database.sqlite", // Файл базы данных
  logging: false, // Выключить логи, если не нужны
});

// Проверка соединения с БД
sequelize
  .authenticate()
  .then(() => console.log("Соединение с базой данных успешно установлено."))
  .catch((err) => console.error("Невозможно подключиться к базе данных:", err));

export default sequelize;
