const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const sizRoutes = require("./routes/sizRoutes");
const errorHandler = require("./middlewares/errorHandler");
require("dotenv").config(); // Подключаем dotenv для работы с переменными окружения

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
