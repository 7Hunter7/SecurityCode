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

  // Обработка ошибок дублирования уникальных полей в Sequelize
  if (err.name === "SequelizeUniqueConstraintError") {
    statusCode = 400;
    message = "Дублирование уникального поля";
    logger.warn("Ошибка дублирования ключей в Sequelize");
  }

  // Обработка ошибок JWT (истекший или невалидный токен)
  if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Токен истек. Пожалуйста, войдите заново.";
    logger.warn("Истекший токен JWT");
  }

  if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Неверный токен. Пожалуйста, авторизуйтесь заново.";
    logger.warn("Неверный токен JWT");
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
