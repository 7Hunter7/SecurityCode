import winston from "winston";
import { createLogger, format, transports } from "winston";
const { combine, timestamp, printf, errors } = format;

// Формат логов
const logFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} ${level}: ${stack || message}`; // Добавляем "stack" для ошибок
});

// Конфигурация логера
const logger = createLogger({
  level: process.env.LOG_LEVEL || "info", // Уровень логирования, по умолчанию info
  format: combine(
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), // Добавляем временную метку
    errors({ stack: true }), // Включаем вывод стека для ошибок
    logFormat // Используем кастомный формат
  ),
  transports: [
    new transports.File({ filename: "logs/error.log", level: "error" }), // Файл для ошибок
    new transports.File({ filename: "logs/combined.log" }), // Общий файл логов
  ],
});

// Если не в продакшене, используем упрощённый формат для консоли
if (process.env.NODE_ENV !== "production") {
  logger.add(
    new transports.Console({
      format: combine(
        format.colorize(), // Цветной вывод в режиме разработки
        format.simple() // Упрощённый вывод
      ),
    })
  );
} else {
  // В продакшене используем более подробный вывод
  logger.add(
    new transports.Console({
      format: combine(timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), logFormat),
    })
  );
}

export default logger;
