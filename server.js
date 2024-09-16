import express from "express";
import sequelize from "./src/db.js";
import sizRoutes from "./src/routes/sizRoutes.js";
import errorHandler from "./src/middlewares/errorHandler.js";
import bodyParser from "body-parser";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());

// Подключение к базе данных и синхронизация модели
sequelize
  .sync()
  .then(() => {
    console.log("База данных синхронизирована");
  })
  .catch((err) => {
    console.error("Ошибка синхронизации базы данных:", err);
  });

// Подключение маршрутов
app.use("/api/siz-items", sizRoutes);

// Централизованная обработка ошибок
app.use(errorHandler);

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
