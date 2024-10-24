import express from "express";
import SIZItem from "../models/SIZItem.js";
import History from "../models/History.js";
import { authenticateToken, authorizeRole } from "../middlewares/authorize.js"; // Подключение миддлвэра для проверки прав доступа
import { validateSIZ } from "../middlewares/validateSIZ.js"; // Подключение миддлвэра для валидации СИЗ
import logger from "../logger.js"; // Подключение Winston
import { apiResponse } from "../utils/apiResponse.js"; // Универсальнуая функция для формирования ответа

const router = express.Router();

// Проверка наличия СИЗ
async function findSIZById(req, res, next) {
  try {
    const sizItem = await SIZItem.findByPk(req.params.id);
    if (!sizItem) {
      return apiResponse(res, 404, "СЗ не найдено!", null);
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
  // Параметры пагинации из запроса
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.max(1, parseInt(req.query.limit) || 20);

  try {
    // Постраничный вывод при получении всех СИЗ
    const offset = (page - 1) * limit;
    const items = await SIZItem.findAndCountAll({
      offset,
      limit: parseInt(limit),
    });
    console.log(`Найдено ${items.length} записей в базе данных.`);
    logger.info("Все СЗ успешно получены");

    return apiResponse(res, 200, "Все СЗ успешно получены", {
      totalItems: items.count,
      totalPages: Math.ceil(items.count / limit),
      currentPage: page,
      items: items.rows,
    });
  } catch (err) {
    logger.error("Ошибка получения СЗ:", err);
    return apiResponse(res, 500, "Ошибка получения данных!");
  }
});

// Добавить новое СИЗ с проверкой уникальности
router.post(
  "/",
  authenticateToken,
  authorizeRole(["advanced_user", "admin"]),
  validateSIZ, // Middleware для валидации СИЗ
  async (req, res, next) => {
    console.log("Запрос на добавление СЗ получен:", req.body);

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
        logger.warn("Попытка добавить дублирующее СЗ");
        return apiResponse(res, 400, "СЗ с таким номером уже существует");
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
      return apiResponse(res, 201, "СЗ успешно добавлено", newItem);
    } catch (err) {
      logger.error(`Ошибка при добавлении нового СЗ: ${err.message}`);
      return apiResponse(res, 500, "Ошибка добавления нового СЗ");
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
  validateSIZ, // Middleware для валидации СИЗ
  async (req, res, next) => {
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
        logger.warn(
          `Попытка обновления на дублирующий номер СЗ: ${req.body.number}`
        );
        return apiResponse(
          res,
          400,
          "СЗ с таким номером уже существует!",
          null
        );
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
      return apiResponse(res, 200, "СЗ успешно обновлено", req.sizItem);
    } catch (err) {
      logger.error(`Ошибка обновления СЗ: ${err.message}`);
      return apiResponse(res, 500, "Ошибка обновления СЗ");
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
    // Сохранение данных до удаления
    const oldData = { ...req.sizItem.dataValues };

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
      } catch (err) {
        logger.error(`Ошибка при создании записи в History: ${err.message}`, {
          stack: err.stack,
        });
        next(err);
      }
      logger.info(`СЗ с ID: ${oldData.id} успешно удалено`);
      return apiResponse(res, 200, `СЗ с ID ${oldData.id} успешно удалено`);
    } catch (err) {
      logger.error(
        `Ошибка удаления СЗ с ID: ${req.sizItem.id}: ${err.message}`,
        {
          stack: err.stack,
        }
      );
      return apiResponse(res, 500, "Ошибка удаления СЗ");
    }
  }
);

export default router;
