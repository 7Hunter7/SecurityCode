import { sizItemValidationSchema } from "../validation/sizValidation.js";
import logger from "../logger.js"; // Подключение Winston

// Middleware для валидации СЗ
export const validateSIZ = (req, res, next) => {
  const { error } = sizItemValidationSchema.validate(req.body);
  if (error) {
    const err = new Error(error.details[0].message);
    err.statusCode = 400;
    logger.warn(`Ошибка валидации СЗ: ${err.message}`);
    return next(err);
  }
  next();
};
