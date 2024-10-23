import express from "express";
import { authorize } from "../middlewares/authorize.js";

const router = express.Router();

// Получение всех пользователей
router.get("/", authorize(["admin"]), async (req, res) => {
  const users = await User.findAll();
  res.json(users);
});

// Добавление нового пользователя
router.post("/", authorize(["admin"]), async (req, res) => {
  const { username, password, role } = req.body;
  const newUser = await User.create({ username, password, role });
  res.json(newUser);
});

// Обновление данных пользователя
router.put("/:id", authorize(["admin"]), async (req, res) => {
  const { role } = req.body;
  const user = await User.findByPk(req.params.id);
  if (user) {
    user.role = role;
    await user.save();
    res.json(user);
  } else {
    res.status(404).json({ message: "Пользователь не найден" });
  }
});

// Удаление пользователя
router.delete("/:id", authorize(["admin"]), async (req, res) => {
  const user = await User.findByPk(req.params.id);
  if (user) {
    await user.destroy();
    res.json({ message: "Пользователь удален" });
  } else {
    res.status(404).json({ message: "Пользователь не найден" });
  }
});

export default router;
