import Joi from "joi";
import { PZ_TYPES, voltageClasses } from "../constants/constants.js"; // Импортируем массив ПЗ

// Joi схема валидации
export const sizItemValidationSchema = Joi.object({
  location: Joi.string().min(3).max(255).required(),
  type: Joi.string().min(3).max(255).required(),
  voltageClass: Joi.string()
    .valid(...voltageClasses)
    .required(),
  szType: Joi.string().allow(""),
  number: Joi.number().integer().required(), // Отправляется число
  testDate: Joi.alternatives().conditional("type", {
    is: Joi.valid(...PZ_TYPES),
    then: Joi.string().allow("").optional(), // Необязательное поле
    otherwise: Joi.string()
      .regex(/^\d{4}-\d{2}-\d{2}$/)
      .required(), // Обязательное поле
  }),
  nextTestDate: Joi.alternatives().conditional("type", {
    is: Joi.valid(...PZ_TYPES),
    then: Joi.string().allow("").optional(), // Необязательное поле
    otherwise: Joi.string()
      .regex(/^\d{4}-\d{2}-\d{2}$/)
      .required(), // Обязательное поле
  }),
  lastInspectDate: Joi.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
  quantity: Joi.number().integer().min(1).required(),
  inspectionResult: Joi.string().max(255).allow(""),
});
