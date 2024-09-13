const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const Joi = require("joi");

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

// Определение схемы и модели с валидацией
const SIZItemSchema = new mongoose.Schema({
  location: { type: String, required: true, minlength: 3, maxlength: 100 },
  type: { type: String, required: true, minlength: 3, maxlength: 100 },
  voltageClass: {
    type: String,
    required: true,
    enum: [
      "0,4",
      "1",
      "3",
      "6",
      "10",
      "15",
      "20",
      "35",
      "110",
      "150",
      "220",
      "330",
      "500",
      "750",
      "1150",
    ],
  },
  szType: { type: String, required: true },
  number: { type: Number, required: true, unique: true }, // Уникальный номер
  testDate: { type: Date, required: true },
  nextTestDate: { type: Date, required: true },
  lastInspectDate: { type: Date, default: Date.now },
  quantity: { type: Number, required: true, min: 1 },
  note: { type: String, maxlength: 255 },
});
SIZItemSchema.index({ number: 1 }, { unique: true }); // Создание уникального индекса

const SIZItem = mongoose.model("SIZItem", SIZItemSchema);
// Команда для применения индексов:
SIZItem.syncIndexes();

// Схема валидации Joi
const sizItemValidationSchema = Joi.object({
  location: Joi.string().min(3).max(100).required(),
  type: Joi.string().min(3).max(100).required(),
  voltageClass: Joi.string()
    .valid(
      "0,4",
      "1",
      "3",
      "6",
      "10",
      "15",
      "20",
      "35",
      "110",
      "150",
      "220",
      "330",
      "500",
      "750",
      "1150"
    )
    .required(),
  szType: Joi.string().required(),
  number: Joi.number().integer().required(),
  testDate: Joi.date().required(),
  nextTestDate: Joi.date().required(),
  lastInspectDate: Joi.date(),
  quantity: Joi.number().integer().min(1).required(),
  note: Joi.string().max(255),
});

// Маршруты (Routes):
// Получить все СИЗ из базы данных
app.get("/api/siz-items", async (req, res) => {
  try {
    const items = await SIZItem.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Маршрут для добавления нового СИЗ с проверкой уникальности
app.post("/api/siz-items", async (req, res) => {
  // Валидация с помощью Joi
  const { error } = sizItemValidationSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  try {
    // Проверяем, существует ли уже запись с таким же номером
    const existingItem = await SIZItem.findOne({ number: req.body.number });
    if (existingItem) {
      return res
        .status(400)
        .json({ message: "СИЗ с таким номером уже существует" });
    }
    // Создание и сохранение нового СИЗ
    const item = new SIZItem(req.body);
    // Сохранение данных с использованием встроенной валидации Mongoose
    const newItem = await item.save();
    res.status(201).json(newItem);
  } catch (err) {
    // Если Mongoose найдёт ошибку валидации
    res.status(400).json({ message: err.message });
  }
});

// Обновить существующее СИЗ по его id
app.put("/api/siz-items/:id", async (req, res) => {
  // Валидация с помощью Joi перед обновлением
  const { error } = sizItemValidationSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  try {
    const updatedItem = await SIZItem.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedItem) {
      return res.status(404).json({ message: "СИЗ не найдено" });
    }
    res.json(updatedItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Удалить СИЗ
app.delete("/api/siz-items/:id", async (req, res) => {
  try {
    const deletedItem = await SIZItem.findByIdAndDelete(req.params.id);
    if (!deletedItem) {
      return res.status(404).json({ message: "СИЗ не найдено" });
    }
    res.json({ message: "СИЗ удалено" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
