const express = require("express");
const router = express.Router();
const SIZItem = require("../models/SIZItem"); // Импорт модели
const { sizItemValidationSchema } = require("../validation/sizValidation"); // Валидация с Joi

// Создание middleware для обработки ошибок
const handleError = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

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
router.post(
  "/",
  handleError(async (req, res) => {
    const { error } = sizItemValidationSchema.validate(req.body);
    if (error)
      return res.status(400).json({ message: error.details[0].message });

    const existingItem = await SIZItem.findOne({ number: req.body.number });
    if (existingItem) {
      return res
        .status(400)
        .json({ message: "СИЗ с таким номером уже существует!" });
    }

    const item = new SIZItem(req.body);
    const newItem = await item.save();
    res.status(201).json(newItem);
  })
);
// Обновить существующее СИЗ
router.put("/:id", findSIZById, async (req, res) => {
  const { error } = sizItemValidationSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message }); // Ошибка валидации, 400 Bad Request
  try {
    req.sizItem.set(req.body); // Обновляем найденный объект
    const updatedItem = await req.sizItem.save(); // Сохраняем обновления
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
