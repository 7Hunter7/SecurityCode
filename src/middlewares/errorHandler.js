const errorHandler = (err, req, res, next) => {
  // Логируем ошибку на сервере для отладки
  console.error(err.stack);

  // Проверка на валидационные ошибки Joi
  if (err.isJoi) {
    return res.status(400).json({
      status: "error",
      message: err.details[0].message,
    });
  }

  // Проверка на валидационные ошибки Mongoose
  if (err.name === "ValidationError") {
    return res.status(400).json({
      status: "error",
      message: "Ошибка валидации данных",
      details: Object.values(err.errors).map((e) => e.message),
    });
  }

  // Обработка ошибок базы данных (например, не найдено)
  if (err.name === "CastError" && err.kind === "ObjectId") {
    return res.status(404).json({
      status: "error",
      message: `Объект с id ${err.value} не найден`,
    });
  }

  // Обработка ошибок дублирования (например, уникальный индекс в Mongoose)
  if (err.code && err.code === 11000) {
    return res.status(400).json({
      status: "error",
      message: "Дубликат записи",
      details: err.keyValue,
    });
  }

  // Общая ошибка сервера
  return res.status(500).json({
    status: "error",
    message: "Внутренняя ошибка сервера",
  });
};

module.exports = errorHandler;
