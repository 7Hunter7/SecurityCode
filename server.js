import express from "express";
import path from "path";
import cors from "cors";
import { fileURLToPath } from "url";
import sequelize from "./src/data/db.js"; // Подключение к базе данных
import sizRoutes from "./src/routes/sizRoutes.js"; // Маршруты для СИЗ
import historyRoutes from "./src/routes/historyRoutes.js"; // Подключение маршрута истории
import errorHandler from "./src/middlewares/errorHandler.js"; // Обработчик ошибок
import { importCSV } from "./src/data/importCSV.js"; // Импорт функции для импорта данных

const app = express();
const PORT = process.env.PORT || 3000;

// Настройка CORS
const allowedOrigins = ["http://localhost:5173", "http://localhost:3000"]; // Разрешить запросы только с этих доменов
const corsOptions = {
  origin: (origin, callback) => {
    // Разрешаем запросы, если источник есть в списке
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"], // Разрешённые методы запросов
  allowedHeaders: ["Content-Type", "Authorization"], // Разрешённые заголовки
};

app.use(cors(corsOptions));

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

app.use("/api/history", historyRoutes); // Маршруты истории

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

// Асинхронная синхронизация базы данных и импорт данных
const syncAndImportData = async () => {
  try {
    await sequelize.sync();
    console.log("База данных синхронизирована");

    await importCSV();
    console.log("Данные CSV импортированы");
  } catch (err) {
    console.error("Ошибка при синхронизации или импорте данных:", err);
  }
};

// Централизованная обработка ошибок
app.use(errorHandler);

// Запуск синхронизации базы данных и импорта данных
syncAndImportData().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
