import Joi from "joi";

// Схема валидации Joi
export const sizItemValidationSchema = Joi.object({
  location: Joi.string().min(3).max(255).required(),
  type: Joi.string().min(3).max(255).required(),
  voltageClass: Joi.string()
    .valid("0,4", "1", "3", "6", "10", "15", "20", "35", "110", "220")
    .required(),
  szType: Joi.string().allow(""),
  number: Joi.number().integer().required(),
  testDate: Joi.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/) // Проверка формата даты (yyyy-MM-dd)
    .required(),
  nextTestDate: Joi.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/) // Проверка формата даты (yyyy-MM-dd)
    .required(),
  lastInspectDate: Joi.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/) // Проверка формата даты (yyyy-MM-dd)
    .optional(),
  quantity: Joi.number().integer().min(1).required(),
  inspectionResult: Joi.string().max(255).allow(""),
});
