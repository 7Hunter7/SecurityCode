import express from "express";
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/userController.js";

const router = express.Router();

router.get("/", getUsers); // Получение всех пользователей
router.post("/", createUser); // Добавление нового пользователя
router.put("/:id", updateUser); // Обновление данных пользователя
router.delete("/:id", deleteUser); // Удаление пользователя

export default router;
