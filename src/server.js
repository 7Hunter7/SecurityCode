const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const sizRoutes = require("./routes/sizRoutes");
const errorHandler = require("./middlewares/errorHandler"); // Подключаем обработчик ошибок

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Подключение к MongoDB
mongoose
  .connect("mongodb://localhost:27017/siz_inventory", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// Подключение маршрутов
app.use("/api/siz-items", sizRoutes);

// Централизованная обработка ошибок
app.use(errorHandler);

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
