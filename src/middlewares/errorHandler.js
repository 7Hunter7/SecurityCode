const errorHandler = (err, req, res, next) => {
  console.error(err.stack); // Логирование ошибки

  let statusCode = err.statusCode || 500;
  let message = err.message || "Внутренняя ошибка сервера";

  // Обработка ошибок валидации Joi
  if (err.isJoi) {
    statusCode = 400;
    message = err.details[0].message;
  }

  // Обработка ошибок валидации Mongoose
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = "Ошибка валидации данных";
  }

  // Обработка ошибок дублирования ключей
  if (err.code && err.code === 11000) {
    statusCode = 400;
    message = "Дублирование уникального поля";
  }

  if (statusCode === 500) {
    message = "Внутренняя ошибка сервера";
  }

  res.status(statusCode).json({
    status: "error",
    message,
  });

  // Вызов next, если нужно продолжить обработку
  next();
};

module.exports = errorHandler;
