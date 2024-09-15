import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import sizRoutes from "./src/routes/sizRoutes.js";
import errorHandler from "./src/middlewares/errorHandler.js";
import dotenv from "dotenv"; // Подключаем dotenv для работы с переменными окружения

dotenv.config(); // Настраиваем dotenv

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Подключение к MongoDB Atlas через переменную окружения
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Atlas connected"))
  .catch((err) => {
    console.error("Ошибка подключения к MongoDB:", err);
    process.exit(1); // Выход из приложения, если подключение не удалось
  });

// Подключение маршрутов
app.use("/api/siz-items", sizRoutes);

// Централизованная обработка ошибок
app.use(errorHandler);

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
