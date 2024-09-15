import express from "express";
import SIZItem from "../models/SIZItem.js";
import { sizItemValidationSchema } from "../validation/sizValidation.js";
import logger from "../logger.js"; // Подключаем Winston
const router = express.Router();

// Проверка наличия СИЗ
async function findSIZById(req, res, next) {
  try {
    const sizItem = await SIZItem.findById(req.params.id);
    if (!sizItem) {
      const error = new Error("СИЗ не найдено");
      error.statusCode = 404;
      return next(error);
    }
    req.sizItem = sizItem;
    next();
  } catch (err) {
    if (err.name === "CastError" && err.kind === "ObjectId") {
      const error = new Error("Некорректный идентификатор СИЗ");
      error.statusCode = 400;
      return next(error);
    }
    next(err);
  }
}

// Получить все СИЗ
router.get("/", async (req, res, next) => {
  try {
    const items = await SIZItem.find();
    logger.info("Все СИЗ успешно получены");
    res.status(200).json(items);
  } catch (err) {
    logger.error("Ошибка получения СИЗ:", err);
    next(err); // Передаем ошибку
  }
});

// Добавить новое СИЗ с проверкой уникальности
router.post("/", async (req, res, next) => {
  const { error } = sizItemValidationSchema.validate(req.body);
  if (error) {
    const err = new Error(error.details[0].message);
    err.statusCode = 400;
    logger.warn(`Ошибка валидации при добавлении СИЗ: ${err.message}`);
    return next(err);
  }

  try {
    const existingItem = await SIZItem.findOne({ number: req.body.number });
    if (existingItem) {
      const err = new Error("СИЗ с таким номером уже существует!");
      err.statusCode = 400;
      logger.warn("Попытка добавить дублирующее СИЗ");
      return next(err);
    }

    const item = new SIZItem(req.body);
    const newItem = await item.save();
    logger.info(`СИЗ успешно добавлено с ID: ${newItem._id}`);
    res.status(201).json(newItem);
  } catch (err) {
    logger.error("Ошибка при добавлении нового СИЗ:", err);
    next(err);
  }
});

// Обновить существующее СИЗ
router.put("/:id", findSIZById, async (req, res, next) => {
  const { error } = sizItemValidationSchema.validate(req.body);
  if (error) {
    const err = new Error(error.details[0].message);
    err.statusCode = 400;
    return next(err);
  }

  try {
    // Проверяем, существует ли другой СИЗ с таким же номером
    if (req.body.number && req.body.number !== req.sizItem.number) {
      const existingItem = await SIZItem.findOne({ number: req.body.number });
      if (existingItem) {
        const err = new Error("СИЗ с таким номером уже существует!");
        err.statusCode = 400;
        return next(err);
      }
    }

    req.sizItem.set(req.body);
    const updatedItem = await req.sizItem.save();
    res.status(200).json({ message: "СИЗ успешно обновлено", updatedItem });
  } catch (err) {
    next(err);
  }
});

// Удалить СИЗ
router.delete("/:id", findSIZById, async (req, res, next) => {
  try {
    await req.sizItem.remove();
    res.status(204).send(); // Успешное удаление, без тела
  } catch (err) {
    next(err);
  }
});

export default router;
