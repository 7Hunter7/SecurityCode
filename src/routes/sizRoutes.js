const express = require("express");
const router = express.Router();
const SIZItem = require("../models/SIZItem"); // Импорт модели
const { sizItemValidationSchema } = require("../validation/sizValidation"); // Валидация с Joi

// Получить все СИЗ
router.get("/", async (req, res) => {
  try {
    const items = await SIZItem.find();
    res.status(200).json(items); // Успешный запрос, возвращаем 200 OK
  } catch (err) {
    res.status(500).json({ message: err.message }); // Ошибка сервера
  }
});

// Добавить новое СИЗ с проверкой уникальности
router.post("/", async (req, res) => {
  // Валидация с помощью Joi
  const { error } = sizItemValidationSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message }); // Ошибка валидации, 400 Bad Request

  // Проверяем, существует ли уже запись с таким же номером
  try {
    const existingItem = await SIZItem.findOne({ number: req.body.number });
    if (existingItem) {
      return res
        .status(400)
        .json({ message: "СИЗ с таким номером уже существует!" }); // Дубликат, 400 Bad Request
    }
    // Создание и сохранение нового СИЗ
    const item = new SIZItem(req.body);
    const newItem = await item.save();
    res.status(201).json(newItem); // Успешное создание, 201 Created
  } catch (err) {
    res.status(500).json({ message: err.message }); // Ошибка сервера, 500 Internal Server Error
  }
});

// Обновить существующее СИЗ
router.put("/:id", async (req, res) => {
  const { error } = sizItemValidationSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message }); // Ошибка валидации, 400 Bad Request
  try {
    const updatedItem = await SIZItem.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedItem) {
      return res.status(404).json({ message: "СИЗ не найдено" }); // Не найдено, 404 Not Found
    }
    res.status(200).json({ message: "СИЗ успешно обновлено", updatedItem }); // Успешное обновление, 200 OK
  } catch (err) {
    res.status(500).json({ message: err.message }); // Ошибка сервера, 500 Internal Server Error
  }
});

// Удалить СИЗ
router.delete("/:id", async (req, res) => {
  try {
    const deletedItem = await SIZItem.findByIdAndDelete(req.params.id);
    if (!deletedItem) {
      return res.status(404).json({ message: "СИЗ не найдено!" }); // Не найдено, 404 Not Found
    }
    res.status(204).send(); // Успешное удаление, 204 No Content, без тела ответа
  } catch (err) {
    res.status(500).json({ message: err.message }); // Ошибка сервера, 500 Internal Server Error
  }
});

module.exports = router;
