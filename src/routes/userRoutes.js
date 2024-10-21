import express from "express";
import User from "../models/User.js";
import { userValidationSchema } from "../validation/userValidation.js";
import logger from "../logger.js";
import multer from "multer";
import path from "path";

const router = express.Router();

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

// Получение данных о пользователе по ID
router.get("/:id", async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "Пользователь не найден" });
    }
    logger.info("Данные пользователя успешно получены");
    res.status(200).json(user);
  } catch (error) {
    logger.error(`Ошибка получения данных пользователя: ${error.message}`);
    res.status(500).json({ message: "Ошибка получения данных" });
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
router.put("/:id", async (req, res, next) => {
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
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "Пользователь не найден" });
    }

    await user.update(req.body);
    logger.info(`Данные пользователя с ID: ${req.params.id} успешно обновлены`);
    res.status(200).json({ message: "Данные пользователя обновлены", user });
  } catch (error) {
    logger.error(`Ошибка обновления данных пользователя: ${error.message}`);
    next(error);
  }
});

// Загрузка фото профиля
router.post(
  "/:id/upload-photo",
  upload.single("profilePhoto"),
  async (req, res, next) => {
    try {
      const user = await User.findByPk(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "Пользователь не найден" });
      }

      user.profilePhoto = req.file.path; // Сохраняем путь к файлу в базе данных
      await user.save();

      res.status(200).json({ message: "Фото профиля загружено", user });
    } catch (error) {
      logger.error(`Ошибка загрузки фото профиля: ${error.message}`);
      next(error);
    }
  }
);

// Удаление пользователя
router.delete("/:id", async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "Пользователь не найден" });
    }

    await user.destroy();
    logger.info(`Пользователь успешно удален`);
    res.status(200).json({ message: "Пользователь удален" });
  } catch (error) {
    logger.error(`Ошибка удаления пользователя: ${error.message}`);
    next(error);
  }
});

export default router;
