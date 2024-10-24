// Универсальная функция для формирования ответа

export const apiResponse = (res, status, message, data = null) => {
  res.status(status).json({
    status: status >= 400 ? "error" : "success", // Если код >= 400, считаем ошибкой
    data,
    message,
  });
};
