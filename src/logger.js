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
    new transports.Console(), // Вывод в консоль
    new transports.File({ filename: "logs/error.log", level: "error" }), // Файл для ошибок
    new transports.File({ filename: "logs/combined.log" }), // Общий файл логов
  ],
});

// В режиме разработки, добавляем логгирование в консоль
if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    })
  );
}

// Экспортируем логгер по умолчанию
export default logger;
