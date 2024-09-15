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

// Подключение к MongoDB
const mongoUri = process.env.MONGO_URI;
console.log("MONGO_URI:", mongoUri);
if (!mongoUri) {
  throw new Error("MONGO_URI is not defined in environment variables");
}

// Подключение к MongoDB Atlas через переменную окружения
mongoose
  .connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("Ошибка подключения к MongoDB:", err));

// Подключение маршрутов
app.use("/api/siz-items", sizRoutes);

// Централизованная обработка ошибок
app.use(errorHandler);

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
