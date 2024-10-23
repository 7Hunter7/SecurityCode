export function authorize(roles = []) {
  // Если роли не указаны, то доступ открыт всем
  if (typeof roles === "string") {
    roles = [roles];
  }

  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Доступ запрещен" });
    }
    next();
  };
}
