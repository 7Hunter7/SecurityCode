import express from "express";
import SIZItem from "../models/SIZItem.js";
import History from "../models/History.js";
import { sizItemValidationSchema } from "../validation/sizValidation.js";
import { authenticateToken, authorizeRole } from "../middlewares/authorize.js"; // Подключение миддлвэра для проверки прав доступа
import logger from "../logger.js"; // Подключение Winston

const router = express.Router();

// Проверка наличия СИЗ
async function findSIZById(req, res, next) {
  try {
    const sizItem = await SIZItem.findByPk(req.params.id);
    if (!sizItem) {
      const error = new Error("СЗ не найдено");
      error.statusCode = 404;
      return next(error);
    }
    req.sizItem = sizItem;
    next();
  } catch (err) {
    logger.error(`Ошибка поиска СЗ по ID: ${err.message}`);
    next(err);
  }
}

// Получить все СИЗ
router.get("/", authenticateToken, async (req, res, next) => {
  try {
    const items = await SIZItem.findAll();
    console.log(`Найдено ${items.length} записей в базе данных.`);
    logger.info("Все СЗ успешно получены");
    res.status(200).json(items);
  } catch (err) {
    logger.error("Ошибка получения СЗ:", err);
    res.status(500).json({ message: "Ошибка получения данных" });
    next(err);
  }
});

// Добавить новое СИЗ с проверкой уникальности
router.post(
  "/",
  authenticateToken,
  authorizeRole(["advanced_user", "admin"]),
  // Только опытные пользователи и администраторы могут добавлять СИЗ
  async (req, res, next) => {
    console.log("Запрос на добавление СЗ получен:", req.body);
    const { error } = sizItemValidationSchema.validate(req.body);
    if (error) {
      const err = new Error(error.details[0].message);
      err.statusCode = 400;
      logger.warn(`Ошибка валидации при добавлении СЗ: ${err.message}`);
      return next(err);
    }

    // Проверка уникальности СИЗ
    try {
      const existingItem = await SIZItem.findOne({
        where: {
          location: req.body.location,
          type: req.body.type,
          number: req.body.number,
        },
      });
      if (existingItem) {
        const err = new Error("СЗ с таким номером уже существует!");
        err.statusCode = 400;
        logger.warn("Попытка добавить дублирующее СЗ");
        return next(err);
      }
      const newItem = await SIZItem.create(req.body);

      // Логирование добавления СИЗ
      await History.create({
        action: "Добавление",
        sizType: newItem.type,
        sizNumber: newItem.number,
        userId: req.user?.id || null, // Если есть учет пользователей
        details: { newData: req.body },
      });

      logger.info(`СЗ успешно добавлено с ID: ${newItem.id}`);
      res.status(201).json(newItem);
    } catch (err) {
      logger.error(`Ошибка при добавлении нового СЗ: ${err.message}`);
      next(err);
    }
  }
);

// Обновить существующее СИЗ
router.put(
  "/:id",
  authenticateToken,
  authorizeRole(["advanced_user", "admin"]),
  // Только опытные пользователи и администраторы могут редактировать СИЗ
  findSIZById,
  async (req, res, next) => {
    const { error } = sizItemValidationSchema.validate(req.body);
    if (error) {
      const err = new Error(error.details[0].message);
      err.statusCode = 400;
      logger.warn(`Ошибка валидации при обновлении СЗ: ${err.message}`);
      return next(err);
    }
    // Проверка на дублирующее СЗ
    try {
      const existingItem = await SIZItem.findOne({
        where: {
          location: req.body.location,
          type: req.body.type,
          number: req.body.number,
        },
      });
      if (existingItem && existingItem.id !== req.sizItem.id) {
        const err = new Error("СЗ с таким номером уже существует!");
        err.statusCode = 400;
        logger.warn(
          `Попытка обновления на дублирующий номер СЗ: ${req.body.number}`
        );
        return next(err);
      }
      // Сохранение данных до обновления
      const oldData = { ...req.sizItem.dataValues };

      await req.sizItem.update(req.body);

      // Логирование редактирования СИЗ
      await History.create({
        action: "Редактирование",
        sizType: req.sizItem.type,
        sizNumber: req.sizItem.number,
        userId: req.user?.id || null,
        details: { oldData, newData: req.body },
      });

      logger.info(`СЗ с ID: ${req.sizItem.id} успешно обновлено`);
      res
        .status(200)
        .json({ message: "СЗ успешно обновлено", updatedItem: req.sizItem });
    } catch (err) {
      logger.error(`Ошибка обновления СЗ: ${err.message}`);
      next(err);
    }
  }
);

// Удалить СИЗ
router.delete(
  "/:id",
  authenticateToken,
  authorizeRole(["advanced_user", "admin"]),
  // Только опытные пользователи и администраторы могут удалять СИЗ
  findSIZById,
  async (req, res, next) => {
    const oldData = { ...req.sizItem.dataValues }; // Сохранение данных до удаления
    console.log(oldData);

    try {
      // Удаление записи
      await req.sizItem.destroy();

      try {
        // Логирование удаления СИЗ
        await History.create({
          action: "Удаление",
          sizType: oldData.type,
          sizNumber: oldData.number,
          userId: req.user?.id || null,
          details: { oldData },
        });
        console.log("Данные для сохранения в History:", {
          action: "Удаление",
          sizType: oldData.type,
          sizNumber: oldData.number,
          userId: req.user?.id || null,
          details: { oldData },
        });
      } catch (err) {
        logger.error(`Ошибка при создании записи в History: ${err.message}`, {
          stack: err.stack,
        });
        next(err);
      }
      logger.info(`СЗ с ID: ${oldData.id} успешно удалено`);
      res
        .status(200)
        .json({ message: `СЗ с ID ${oldData.id} успешно удалено` });
    } catch (err) {
      logger.error(
        `Ошибка удаления СЗ с ID: ${req.sizItem.id}: ${err.message}`,
        {
          stack: err.stack,
        }
      );
      next(err);
    }
  }
);

export default router;
