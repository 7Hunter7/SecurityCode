import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import sequelize from "./src/data/db.js"; // Подключение к базе данных
import sizRoutes from "./src/routes/sizRoutes.js"; // Маршруты для СИЗ
import errorHandler from "./src/middlewares/errorHandler.js"; // Обработчик ошибок
// import bodyParser from "body-parser"; // Парсинг тела запроса

const app = express();
const PORT = process.env.PORT || 3000;

// Определение __dirname для ES-модуля
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware для парсинга JSON
app.use(express.json());

// Подключение маршрутов
app.use("/api/siz-items", sizRoutes);

// Обработка статических файлов для клиента
app.use(express.static(path.join(__dirname, "public")));

// Получить все СИЗ
app.get("/api/siz-items", async (req, res, next) => {
  try {
    const items = await SIZItem.findAll(); // Предполагается, что SIZItem — это ваша модель для работы с базой данных
    res.status(200).json(items);
  } catch (err) {
    next(err);
  }
});
// Обработка всех остальных маршрутов и возврат index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Обработка несуществующих маршрутов
app.use((req, res) => {
  res.status(404).send({
    message: "URL not found",
  });
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
