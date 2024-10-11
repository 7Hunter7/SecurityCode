import express from "express";
import History from "../models/History.js";

const router = express.Router();

// Получить всю историю
router.get("/", async (req, res, next) => {
  try {
    const history = await History.findAll({
      order: [["timestamp", "DESC"]],
    });
    res.status(200).json(history);
  } catch (err) {
    next(err);
  }
});

// Удалить всю историю
router.delete("/", async (req, res, next) => {
  try {
    // Удаляем все записи истории
    await History.destroy({ where: {} });
    res.status(200).json({ message: "История успешно очищена" });
  } catch (err) {
    next(err);
  }
});

// Удалить конкретное событие по ID
router.delete("/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    const event = await History.findByPk(id);
    if (!event) {
      return res.status(404).json({ message: "Событие не найдено" });
    }
    // Удаляем конкретное событие
    await event.destroy();
    res.status(200).json({ message: `Событие с ID ${id} успешно удалено` });
  } catch (err) {
    next(err);
  }
});

export default router;
