const mongoose = require("mongoose");

// Определение схемы и модели с валидацией
const SIZItemSchema = new mongoose.Schema({
  location: { type: String, required: true, minlength: 3, maxlength: 100 },
  type: { type: String, required: true, minlength: 3, maxlength: 100 },
  voltageClass: {
    type: String,
    required: true,
    enum: [
      "0,4",
      "1",
      "3",
      "6",
      "10",
      "15",
      "20",
      "35",
      "110",
      "150",
      "220",
      "330",
      "500",
      "750",
      "1150",
    ],
  },
  szType: { type: String, required: true },
  number: { type: Number, required: true, unique: true }, // Уникальный номер
  testDate: { type: Date, required: true },
  nextTestDate: { type: Date, required: true },
  lastInspectDate: { type: Date, default: Date.now },
  quantity: { type: Number, required: true, min: 1 },
  note: { type: String, maxlength: 255 },
});
// SIZItemSchema.index({ number: 1 }, { unique: true }); // Создание уникального индекса
// Команда для применения индексов:
// SIZItem.syncIndexes();

module.exports = mongoose.model("SIZItem", SIZItemSchema);
