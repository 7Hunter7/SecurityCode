import express from "express";
import User from "../models/User.js";
import { authenticateToken, authorizeRole } from "../middlewares/authorize.js";
import { userValidationSchema } from "../validation/userValidation.js"; // Импорт схемы валидации
import logger from "../logger.js";
import bcrypt from "bcrypt";

const router = express.Router();

// Защищённый маршрут для получения всех пользователей (только администратор)
router.get(
  "/users",
  authenticateToken,
  authorizeRole(["admin"]),
  async (req, res) => {
    try {
      const users = await User.findAll();
      logger.info("Все пользователи успешно получены");
      res.json(users);
    } catch (error) {
      logger.error(`Ошибка получения пользователей: ${error.message}`);
      res.status(500).json({ message: "Ошибка получения пользователей" });
    }
  }
);

// Добавление нового пользователя
router.post(
  "/users",
  authenticateToken,
  authorizeRole(["admin"]),
  async (req, res, next) => {
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

      // Удаление пароля из ответа перед отправкой данных на клиент
      const userData = newUser.toJSON();
      delete userData.password;

      res.status(201).json(newUser);
    } catch (error) {
      logger.error(`Ошибка создания нового пользователя: ${error.message}`);
      next(error);
    }
  }
);

// Защищённый маршрут для обновления данных пользователя (администратор или сам пользователь)
router.put("/users/:id", authenticateToken, async (req, res, next) => {
  // Валидация данных пользователя перед обновлением
  const { error } = userValidationSchema.validate(req.body);
  if (error) {
    logger.warn(
      `Ошибка валидации при обновлении данных пользователя: ${error.message}`
    );
    return res.status(400).json({ message: error.details[0].message });
  }

  const userId = req.params.id;
  // Разрешаем администратору или самому пользователю обновлять данные
  if (req.user.role !== "admin" && req.user.id !== parseInt(userId)) {
    return res
      .status(403)
      .json({ message: "У вас нет прав для редактирования этих данных" });
  }
  try {
    const user = await User.findByPk(userId);
    if (user) {
      // Обновление данных пользователя
      await user.update(req.body);
      res.json(user);
      logger.info(`Данные пользователя с ID: ${user.id} успешно обновлены`);
    } else {
      res.status(404).json({ message: "Пользователь не найден" });
      logger.warn(`Пользователь с ID: ${req.params.id} не найден`);
    }
  } catch (error) {
    logger.error(`Ошибка обновления данных пользователя: ${error.message}`);
    next(error);
  }
});

// Защищённый маршрут для удаления пользователя (только администратор)
router.delete(
  "/users/:id",
  authenticateToken,
  authorizeRole(["admin"]),
  async (req, res, next) => {
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
  }
);

export default router;
