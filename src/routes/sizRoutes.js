const express = require("express");
const router = express.Router();
const SIZItem = require("../models/SIZItem"); // Импорт модели
const { sizItemValidationSchema } = require("../validation/sizValidation"); // Валидация с Joi

// Проверка наличия СИЗ
async function findSIZById(req, res, next) {
  let sizItem;
  try {
    sizItem = await SIZItem.findById(req.params.id);
    if (!sizItem) {
      return res.status(404).json({ message: "СИЗ не найдено" }); // Не найдено, 404 Not Found
    }
    req.sizItem = sizItem; // Сохраняем найденный объект в запрос
    next();
  } catch (err) {
    return res.status(500).json({ message: err.message }); // Ошибка сервера
  }
}

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
router.put("/:id", findSIZById, async (req, res) => {
  const { error } = sizItemValidationSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message }); // Ошибка валидации, 400 Bad Request
  try {
    const updatedItem = await SIZItem.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json({ message: "СИЗ успешно обновлено", updatedItem }); // Успешное обновление, 200 OK
  } catch (err) {
    res.status(500).json({ message: err.message }); // Ошибка сервера
  }
});

// Удалить СИЗ
router.delete("/:id", findSIZById, async (req, res) => {
  try {
    await req.sizItem.remove(); // Используем сохранённый объект
    res.status(204).send(); // Успешное удаление, 204 No Content
  } catch (err) {
    res.status(500).json({ message: err.message }); // Ошибка сервера
  }
});

module.exports = router;
