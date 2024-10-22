import express from "express";
import User from "../models/User.js";
import { userValidationSchema } from "../validation/userValidation.js";
import logger from "../logger.js";
import multer from "multer";

const router = express.Router();

// Middleware для поиска пользователя по ID
async function findUserById(req, res, next) {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      const error = new Error("Пользователь не найден");
      error.statusCode = 404;
      return next(error);
    }
    req.user = user;
    next();
    logger.info("Пользователь успешно найден");
  } catch (error) {
    logger.error(`Ошибка поиска пользователя по ID: ${error.message}`);
    next(error);
  }
}

// Настройки для хранения файлов
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/profile-photos");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// Получение пользователя по ID
router.get("/:id", findUserById, async (req, res, next) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    logger.error(`Ошибка получения пользователя: ${error.message}`);
    res.status(500).json({ message: "Ошибка получения пользователя" });
    next(error);
  }
});

// Создание нового пользователя
router.post("/", async (req, res, next) => {
  const { error } = userValidationSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    const newUser = await User.create(req.body);
    logger.info(`Новый пользователь успешно создан с ID: ${newUser.id}`);
    res.status(201).json(newUser);
  } catch (error) {
    logger.error(`Ошибка создания нового пользователя: ${error.message}`);
    next(error);
  }
});

// Обновление данных пользователя
router.put("/:id", findUserById, async (req, res, next) => {
  const { error } = userValidationSchema.validate(req.body);
  if (error) {
    const err = new Error(error.details[0].message);
    err.statusCode = 400;
    logger.warn(
      `Ошибка валидации при обновлении данных пользователя: ${err.message}`
    );
    return next(err);
  }

  try {
    await req.user.update(req.body);
    logger.info(`Пользователь с ID: ${req.user.id} успешно обновлен`);
    res.status(200).json(req.user);
  } catch (error) {
    logger.error(`Ошибка обновления данных пользователя: ${error.message}`);
    next(error);
  }
});

// Загрузка фото профиля
router.post(
  "/:id/upload-photo",
  findUserById,
  upload.single("profilePhoto"),
  async (req, res, next) => {
    try {
      req.user.profilePhoto = req.file.path; // Сохраняем путь к файлу в базе данных
      await req.user.save();

      res.status(200).json({ message: "Фото профиля загружено" });
    } catch (error) {
      logger.error(`Ошибка загрузки фото профиля: ${error.message}`);
      next(error);
    }
  }
);

// Удаление пользователя
router.delete("/:id", async (req, res, next) => {
  try {
    await req.user.destroy();
    logger.info(`Пользователь с ID: ${req.user.id} успешно удален`);
    res
      .status(200)
      .json({ message: `Пользователь с ID ${req.user.id} успешно удален` });
  } catch (error) {
    logger.error(`Ошибка удаления пользователя: ${error.message}`);
    next(error);
  }
});

export default router;
