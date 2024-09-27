import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import sequelize from "./src/data/db.js"; // Подключение к базе данных
import sizRoutes from "./src/routes/sizRoutes.js"; // Маршруты для СИЗ
import errorHandler from "./src/middlewares/errorHandler.js"; // Обработчик ошибок
// import bodyParser from "body-parser"; // Парсинг тела запроса

const app = express();
const PORT = process.env.PORT || 5000;

// Определение __dirname для ES-модуля
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware для парсинга JSON
app.use(express.json());

// Подключение маршрутов
app.use("/api/siz-items", sizRoutes);

// Обработка статических файлов для клиента
app.use(express.static(path.join(__dirname, "public")));

// Если маршрут не найден в API
app.use("/api", (req, res) => {
  res.sendStatus(404); // Отправляет 404 статус
});

// Обработка всех остальных маршрутов и возврат index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// // Middleware для парсинга данных формы
// app.use(bodyParser.urlencoded({ extended: true }));

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

// Запуск синхронизации
syncDatabase();

// Подключение маршрутов
// app.use(
//   "/api/siz-items",
//   (req, res, next) => {
//     console.log("Запрос получен на /api/siz-items");
//     next();
//   },
//   sizRoutes
// );

// Централизованная обработка ошибок
app.use(errorHandler);

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
