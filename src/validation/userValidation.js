import Joi from "joi";

// Joi схема валидации
export const userValidationSchema = Joi.object({
  firstName: Joi.string().min(2).max(50).required(),
  lastName: Joi.string().min(2).max(50).required(),
  middleName: Joi.string().allow(null, ""),
  department: Joi.string().max(100).allow(null, ""),
  email: Joi.string().email().required(),
  phone: Joi.string()
    .regex(/^\+\d{10,15}$/)
    .required(), // Номер телефона в формате +123456789
  profilePhoto: Joi.string().allow(null, ""),
  emailVerified: Joi.boolean(),
  phoneVerified: Joi.boolean(),
  notifications: Joi.object({
    email: Joi.boolean().default(false),
    phone: Joi.boolean().default(false),
  }),
});
