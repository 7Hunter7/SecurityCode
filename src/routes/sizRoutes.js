import express from "express";
import SIZItem from "../models/SIZItem.js";
import { sizItemValidationSchema } from "../validation/sizValidation.js";
import logger from "../logger.js"; // Подключаем Winston

const router = express.Router();

// Проверка наличия СИЗ
async function findSIZById(req, res, next) {
  try {
    const sizItem = await SIZItem.findByPk(req.params.id); // Используем findByPk
    if (!sizItem) {
      const error = new Error("СИЗ не найдено");
      error.statusCode = 404;
      return next(error);
    }
    req.sizItem = sizItem;
    next();
  } catch (err) {
    logger.error(`Ошибка поиска СИЗ по ID: ${err.message}`);
    next(err);
  }
}

// Получить все СИЗ
router.get("/", async (req, res, next) => {
  try {
    const items = await SIZItem.findAll();
    console.log(`Найдено ${items.length} записей в базе данных.`);
    logger.info("Все СИЗ успешно получены");
    res.status(200).json(items);
  } catch (err) {
    logger.error("Ошибка получения СИЗ:", err);
    res.status(500).json({ message: "Ошибка получения данных" });
    next(err);
  }
});

// Добавить новое СИЗ с проверкой уникальности
router.post("/siz-items", async (req, res, next) => {
  console.log("Запрос на добавление СИЗ получен:", req.body);
  const { error } = sizItemValidationSchema.validate(req.body);
  if (error) {
    const err = new Error(error.details[0].message);
    err.statusCode = 400;
    logger.warn(`Ошибка валидации при добавлении СИЗ: ${err.message}`);
    return next(err);
  }

  try {
    const existingItem = await SIZItem.findOne({
      where: { number: req.body.number },
    });
    if (existingItem) {
      const err = new Error("СИЗ с таким номером уже существует!");
      err.statusCode = 400;
      logger.warn("Попытка добавить дублирующее СИЗ");
      return next(err);
    }

    const newItem = await SIZItem.create(req.body);
    logger.info(`СИЗ успешно добавлено с ID: ${newItem.id}`);
    res.status(201).json(newItem);
  } catch (err) {
    logger.error(`Ошибка при добавлении нового СИЗ: ${err.message}`);
    next(err);
  }
});

// Обновить существующее СИЗ
router.put("/:id", findSIZById, async (req, res, next) => {
  const { error } = sizItemValidationSchema.validate(req.body);
  if (error) {
    const err = new Error(error.details[0].message);
    err.statusCode = 400;
    logger.warn(`Ошибка валидации при обновлении СИЗ: ${err.message}`);
    return next(err);
  }

  try {
    const existingItem = await SIZItem.findOne({
      where: { number: req.body.number },
    });
    if (existingItem && existingItem.id !== req.sizItem.id) {
      const err = new Error("СИЗ с таким номером уже существует!");
      err.statusCode = 400;
      logger.warn(
        `Попытка обновления на дублирующий номер СИЗ: ${req.body.number}`
      );
      return next(err);
    }

    await req.sizItem.update(req.body); // Обновляем запись
    logger.info(`СИЗ с ID: ${req.sizItem.id} успешно обновлено`);
    res
      .status(200)
      .json({ message: "СИЗ успешно обновлено", updatedItem: req.sizItem });
  } catch (err) {
    logger.error(`Ошибка обновления СИЗ: ${err.message}`);
    next(err);
  }
});

// Удалить СИЗ
router.delete("/:id", findSIZById, async (req, res, next) => {
  try {
    await req.sizItem.destroy();
    logger.info(`СИЗ с ID: ${req.sizItem.id} успешно удалено`);
    res.status(204).send(); // Успешное удаление, без тела
  } catch (err) {
    logger.error(`Ошибка удаления СИЗ с ID: ${req.sizItem.id}: ${err.message}`);
    next(err);
  }
});

export default router;
