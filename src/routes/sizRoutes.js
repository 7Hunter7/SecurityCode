const express = require("express");
const router = express.Router();
const SIZItem = require("../models/SIZItem"); // Импорт модели
const { sizItemValidationSchema } = require("../validation/sizValidation"); // Валидация с Joi

// Получить все СИЗ
router.get("/", async (req, res) => {
  try {
    const items = await SIZItem.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Добавить новое СИЗ с проверкой уникальности
router.post("/", async (req, res) => {
  // Валидация с помощью Joi
  const { error } = sizItemValidationSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  // Проверяем, существует ли уже запись с таким же номером
  try {
    const existingItem = await SIZItem.findOne({ number: req.body.number });
    if (existingItem) {
      return res
        .status(400)
        .json({ message: "СИЗ с таким номером уже существует!" });
    }
    // Создание и сохранение нового СИЗ
    const item = new SIZItem(req.body);
    const newItem = await item.save();
    res.status(201).json(newItem);
    // Если Mongoose найдёт ошибку валидации
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Обновить существующее СИЗ
router.put("/:id", async (req, res) => {
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
router.delete("/:id", async (req, res) => {
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

module.exports = router;
