import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import sequelize from "./src/data/db.js"; // Подключение к базе данных
import sizRoutes from "./src/routes/sizRoutes.js"; // Маршруты для СИЗ
import errorHandler from "./src/middlewares/errorHandler.js"; // Обработчик ошибок
import { importCSV } from "./src/data/importCSV.js"; // Импорт функции для импорта данных

const app = express();
const PORT = process.env.PORT || 3000;

// Добавлена поддержка CORS
const cors = require("cors");
app.use(cors());

// Middleware для парсинга JSON
app.use(express.json());

// Подключение маршрутов
app.use(
  "/api/siz-items",
  (req, res, next) => {
    console.log("Запрос получен на /api/siz-items");
    next();
  },
  sizRoutes
);

// Подключение статических файлов (если используется)
const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.use(express.static(path.join(__dirname, "public")));

// Обработка всех остальных маршрутов и возврат index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(process.cwd(), "public", "index.html"));
});

// Обработка несуществующих маршрутов
app.use((req, res) => {
  res.status(404).send({
    message: "URL not found",
  });
});

// Middleware для обработки ошибок
app.use((err, req, res, next) => {
  res.status(err.statusCode || 500);
  res.json({ error: err.message });
});

// Асинхронная синхронизация базы данных
const syncDatabase = async () => {
  try {
    await sequelize.sync();
    console.log("База данных синхронизирована");
  } catch (err) {
    console.error("Ошибка синхронизации базы данных:", err);
  }
};

// Централизованная обработка ошибок
app.use(errorHandler);

// Вызов импорта до запуска сервера
importCSV().then(() => {
  // Запуск синхронизации базы данных
  syncDatabase();

  // Запуск сервера после завершения импорта
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
