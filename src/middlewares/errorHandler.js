import logger from "../logger.js";

const errorHandler = (err, req, res, next) => {
  // Логирование ошибки
  logger.error(`Error: ${err.message}, Stack: ${err.stack}`);

  let statusCode = err.statusCode || 500;
  let message = err.message || "Внутренняя ошибка сервера";

  // Обработка ошибок валидации Joi
  if (err.details && err.details[0]) {
    statusCode = 400;
    message = err.details[0].message;
    logger.warn(`Ошибка валидации Joi: ${message}`);
  }

  // Обработка ошибок валидации Mongoose
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = "Ошибка валидации данных";
    logger.warn("Ошибка валидации Mongoose");
  }

  // Обработка ошибок дублирования ключей (Mongoose)
  if (err.code && err.code === 11000) {
    statusCode = 400;
    message = "Дублирование уникального поля";
    logger.warn("Ошибка дублирования ключей Mongoose");
  }

  if (statusCode === 500) {
    message = "Внутренняя ошибка сервера";
    logger.error("Внутренняя ошибка сервера");
  }

  // Отправка ответа с ошибкой
  res.status(statusCode).json({
    status: "error",
    message,
  });
};

export default errorHandler;
