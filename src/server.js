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

const SIZItem = mongoose.model("SIZItem", SIZItemSchema);

// Routes
app.get("/api/siz-items", async (req, res) => {
  try {
    const items = await SIZItem.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post("/api/siz-items", async (req, res) => {
  const item = new SIZItem(req.body);
  try {
    const newItem = await item.save();
    res.status(201).json(newItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Дополнительные маршруты для обновления и удаления...

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
