import express from "express";
import User from "../models/User.js";
import { authorize } from "../middlewares/authorize.js";
import { userValidationSchema } from "../validation/userValidation.js"; // Импорт схемы валидации
import logger from "../logger.js";

const router = express.Router();

// Получение всех пользователей
router.get("/", authorize(["admin"]), async (req, res) => {
  try {
    const users = await User.findAll();
    logger.info("Все пользователи успешно получены");
    res.json(users);
  } catch (error) {
    logger.error(`Ошибка получения пользователей: ${error.message}`);
    res.status(500).json({ message: "Ошибка получения пользователей" });
  }
});

// Добавление нового пользователя
router.post("/", authorize(["admin"]), async (req, res, next) => {
  // Валидация данных пользователя перед созданием
  const { error } = userValidationSchema.validate(req.body);
  if (error) {
    logger.warn(`Ошибка валидации данных пользователя: ${error.message}`);
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    const { username, password, role, firstName, lastName, email, phone } =
      req.body;
    const newUser = await User.create({
      username,
      password,
      role,
      firstName,
      lastName,
      email,
      phone,
    });
    logger.info(`Новый пользователь успешно создан с ID: ${newUser.id}`);
    res.status(201).json(newUser);
  } catch (error) {
    logger.error(`Ошибка создания нового пользователя: ${error.message}`);
    next(error);
  }
});

// Обновление данных пользователя
router.put("/:id", authorize(["admin"]), async (req, res, next) => {
  // Валидация данных пользователя перед обновлением
  const { error } = userValidationSchema.validate(req.body);
  if (error) {
    logger.warn(
      `Ошибка валидации при обновлении данных пользователя: ${error.message}`
    );
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    const user = await User.findByPk(req.params.id);
    if (user) {
      const { role, firstName, lastName, email, phone } = req.body;
      user.role = role;
      user.firstName = firstName;
      user.lastName = lastName;
      user.email = email;
      user.phone = phone;
      await user.save();
      logger.info(`Пользователь с ID: ${user.id} успешно обновлен`);
      res.json(user);
    } else {
      res.status(404).json({ message: "Пользователь не найден" });
      logger.warn(`Пользователь с ID: ${req.params.id} не найден`);
    }
  } catch (error) {
    logger.error(`Ошибка обновления данных пользователя: ${error.message}`);
    next(error);
  }
});

// Удаление пользователя
router.delete("/:id", authorize(["admin"]), async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (user) {
      await user.destroy();
      logger.info(`Пользователь с ID: ${user.id} успешно удален`);
      res.json({ message: "Пользователь удален" });
    } else {
      res.status(404).json({ message: "Пользователь не найден" });
      logger.warn(`Пользователь с ID:${user.id} не найден`);
    }
  } catch (error) {
    logger.error(`Ошибка удаления пользователя: ${error.message}`);
    next(error);
  }
});

export default router;
