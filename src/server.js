const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Подключение к MongoDB
mongoose
  .connect("mongodb://localhost:27017/siz_inventory", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// Определение схемы и модели
const sizItemSchema = new mongoose.Schema({
  location: String,
  type: String,
  voltageClass: String,
  szType: String,
  number: Number,
  testDate: Date,
  nextTestDate: Date,
  lastInspectDate: Date,
  quantity: Number,
  quantityByClass: Number,
  note: String,
});

const sizItem = mongoose.model("sizItem", sizItemSchema);

// Routes

// Получить все СИЗ
app.get("/api/siz-items", async (req, res) => {
  try {
    const items = await sizItem.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Добавить новое СИЗ
app.post("/api/siz-items", async (req, res) => {
  const item = new sizItem(req.body);
  try {
    const newItem = await item.save();
    res.status(201).json(newItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Обновить существующее СИЗ
app.put("/api/siz-items/:id", async (req, res) => {
  try {
    const updatedItem = await sizItem.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedItem) {
      return res.status(404).json({ message: "СИЗ не найдено" });
    }
    res.json(updatedItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Удалить СИЗ
app.delete("/api/siz-items/:id", async (req, res) => {
  try {
    const deletedItem = await sizItem.findByIdAndDelete(req.params.id);
    if (!deletedItem) {
      return res.status(404).json({ message: "СИЗ не найдено" });
    }
    res.json({ message: "СИЗ удалено" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
