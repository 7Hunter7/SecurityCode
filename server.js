import express from "express";
import sequelize from "./src/data/db.js"; // Подключение к базе данных
import sizRoutes from "./src/routes/sizRoutes.js"; // Маршруты для СИЗ
import errorHandler from "./src/middlewares/errorHandler.js"; // Обработчик ошибок
import bodyParser from "body-parser"; // Парсинг тела запроса

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware для парсинга JSON
app.use(bodyParser.json());

// Middleware для парсинга данных формы
app.use(bodyParser.urlencoded({ extended: true }));

// Асинхронная синхронизация базы данных
const syncDatabase = async () => {
  try {
    await sequelize.sync();
    console.log("База данных синхронизирована");
  } catch (err) {
    console.error("Ошибка синхронизации базы данных:", err);
  }
};

// Запуск синхронизации
syncDatabase();

// Подключение маршрутов
app.use(
  "/api/siz-items",
  (req, res, next) => {
    console.log("Запрос получен на /api/siz-items");
    next();
  },
  sizRoutes
);

// Централизованная обработка ошибок
app.use(errorHandler);

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
