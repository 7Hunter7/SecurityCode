const { createLogger, format, transports } = require("winston");
const { combine, timestamp, printf, errors } = format;

// Формат логов
const logFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} ${level}: ${stack || message}`; // Добавляем "stack" для ошибок
});

// Конфигурация логера
const logger = createLogger({
  level: "info", // Уровень логирования, можно настроить для фильтрации
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

module.exports = logger;
