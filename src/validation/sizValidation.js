import Joi from "joi";
import { PZ_TYPES, VOLTAGE_CLASSES } from "../constants/constants.js";

// Joi схема валидации
export const sizItemValidationSchema = Joi.object({
  location: Joi.string().min(3).max(255).required(),
  type: Joi.string().min(3).max(255).required(),
  voltageClass: Joi.string()
    .valid(...VOLTAGE_CLASSES) // Используем константу для проверки классов напряжений
    .required(),
  szType: Joi.string().allow(""),
  number: Joi.number().integer().required(), // Номер СИЗ
  testDate: Joi.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/) // Строгая проверка даты
    .when("type", {
      not: Joi.valid(...PZ_TYPES), // Если тип не ПЗ, поле обязательно
      then: Joi.required(),
      otherwise: Joi.optional(),
    }),
  nextTestDate: Joi.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .when("type", {
      not: Joi.valid(...PZ_TYPES),
      then: Joi.required(),
      otherwise: Joi.optional(),
    }),
  lastInspectDate: Joi.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
  quantity: Joi.number().integer().min(1).required(),
  inspectionResult: Joi.string().max(255).allow(""),
});
