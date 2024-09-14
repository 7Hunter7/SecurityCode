const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const sizRoutes = require("./routes/sizRoutes");
const errorHandler = require("./middlewares/errorHandler");
const logger = require("./logger"); // Подключаем Winston

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Подключение к MongoDB
mongoose
  .connect("mongodb://localhost:27017/siz_inventory", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => logger.info("MongoDB connected")) // Логируем подключение
  .catch((err) => {
    logger.error("Ошибка подключения к MongoDB:", err);
    process.exit(1); // Завершаем процесс при ошибке подключения
  });

// Подключение маршрутов
app.use("/api/siz-items", sizRoutes);

// Централизованная обработка ошибок
app.use(errorHandler);

// Запуск сервера
app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});
