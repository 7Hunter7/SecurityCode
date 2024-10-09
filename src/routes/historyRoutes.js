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

export default router;
