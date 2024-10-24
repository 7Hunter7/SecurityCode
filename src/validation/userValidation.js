import Joi from "joi";

// Joi схема валидации
export const userValidationSchema = Joi.object({
  username: Joi.string().min(3).max(30).required(),
  password: Joi.string().min(6).max(100).required(),
  role: Joi.string().valid("user", "advanced_user", "admin").default("user"),
  firstName: Joi.string().min(1).max(100).required(),
  lastName: Joi.string().min(1).max(100).required(),
  middleName: Joi.string().min(0).max(100).optional(),

  // Поля филиала и подразделения обязательные
  branch: Joi.string().min(1).max(255).required(),
  subdivision: Joi.string().min(1).max(255).required(),

  // Поле РЭС/Бригада может быть опциональным
  districtOrBrigade: Joi.string().min(0).max(255).optional(),

  email: Joi.string().email().required(),
  phone: Joi.string()
    .pattern(/^[0-9]{10,15}$/)
    .required(),
  profilePhoto: Joi.string().optional(),
  emailVerified: Joi.boolean().default(false),
  phoneVerified: Joi.boolean().default(false),
  notifications: Joi.object({
    email: Joi.boolean().default(false),
    phone: Joi.boolean().default(false),
  }).default(),

  // Двухфакторная аутентификация
  twoFactorCode: Joi.string().optional(),
  twoFactorExpires: Joi.date().optional(),
});
