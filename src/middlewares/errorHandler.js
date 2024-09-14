const errorHandler = (err, req, res, next) => {
  console.error(err.stack); // Логирование ошибки

  // Если ошибка имеет статус-код, то используем его, иначе ставим 500
  const statusCode = err.statusCode || 500;

  // Если статус-код 500, мы возвращаем сообщение "Internal Server Error" для скрытия деталей
  const message =
    statusCode === 500 ? "Внутренняя ошибка сервера" : err.message;

  res.status(statusCode).json({
    status: "error",
    message,
  });
};

module.exports = errorHandler;
