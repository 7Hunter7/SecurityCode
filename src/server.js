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
const SIZItemSchema = new mongoose.Schema({
  location: { type: String, required: true },
  type: { type: String, required: true },
  voltageClass: { type: String, required: true },
  szType: { type: String, required: true },
  number: { type: Number, required: true },
  testDate: { type: Date, required: true },
  nextTestDate: { type: Date, required: true },
  lastInspectDate: { type: Date },
  quantity: { type: Number, required: true },
  quantityByClass: { type: Number, required: true },
  note: { type: String },
});

const SIZItem = mongoose.model("SIZItem", SIZItemSchema);

// Routes

// Получить все СИЗ
app.get("/api/siz-items", async (req, res) => {
  try {
    const items = await SIZItem.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Добавить новое СИЗ
app.post("/api/siz-items", async (req, res) => {
  const item = new SIZItem(req.body);
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
    const updatedItem = await SIZItem.findByIdAndUpdate(
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
    const deletedItem = await SIZItem.findByIdAndDelete(req.params.id);
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
