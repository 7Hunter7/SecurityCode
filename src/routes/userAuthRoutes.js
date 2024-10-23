import express from "express";
import User from "../models/User.js";
import jwt from "jsonwebtoken"; // JWT для создания токенов
import { userValidationSchema } from "../validation/userValidation.js";
import logger from "../logger.js";

const router = express.Router();

// Вход в систему (аутентификация)
router.post("/login", async (req, res, next) => {
  const { username, password } = req.body;

  try {
    // Находим пользователя по имени
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(404).json({ message: "Пользователь не найден" });
    }

    // Проверяем пароль
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Неверный пароль" });
    }

    // Генерация токена (JWT)
    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        role: user.role,
      },
      process.env.JWT_SECRET, // Секретный ключ для подписи токена
      { expiresIn: "1h" }
    );

    // Отправка токена на клиент
    res.status(200).json({ token });
    logger.info(`Пользователь ${user.username} успешно вошел в систему`);
  } catch (error) {
    logger.error(`Ошибка аутентификации: ${error.message}`);
    next(error);
  }
});

// Регистрация нового пользователя
router.post("/register", async (req, res, next) => {
  const { error } = userValidationSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    // Проверка, существует ли пользователь с таким же username или email
    const existingUser = await User.findOne({
      where: { username: req.body.username },
    });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Пользователь с таким именем уже существует" });
    }

    // Создание нового пользователя
    const newUser = await User.create(req.body);
    logger.info(
      `Новый пользователь успешно зарегистрирован с ID: ${newUser.id}`
    );

    // Удаление пароля из ответа перед отправкой данных на клиент
    const userData = newUser.toJSON();
    delete userData.password;

    res.status(201).json(newUser);
  } catch (error) {
    logger.error(`Ошибка регистрации нового пользователя: ${error.message}`);
    next(error);
  }
});

export default router;
