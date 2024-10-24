import jwt from "jsonwebtoken";

// Middleware для проверки JWT токена
export const authenticateToken = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1]; // Получаем токен из заголовка

  if (!token) {
    return res
      .status(403)
      .json({ message: "Доступ запрещен, токен отсутствует" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({ message: "Токен истек" });
      } else {
        return res.status(403).json({ message: "Неверный токен" });
      }
    }

    req.user = user; // Сохраняем данные пользователя для использования в дальнейших запросах
    next();
  });
};

// Middleware для проверки ролей
export const authorizeRole = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ message: "У вас нет доступа к этому ресурсу" });
    }
    next();
  };
};
