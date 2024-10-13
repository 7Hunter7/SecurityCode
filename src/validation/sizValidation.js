import Joi from "joi";

// Joi схема валидации
export const sizItemValidationSchema = Joi.object({
  location: Joi.string().min(3).max(255).required(),
  type: Joi.string().min(3).max(255).required(),
  voltageClass: Joi.string()
    .valid("0,4", "1", "3", "6", "10", "15", "20", "35", "110", "220")
    .required(),
  szType: Joi.string().allow(""),
  number: Joi.number().integer().required(), // Отправляется число
  testDate: Joi.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .required(), // Строгая проверка формата даты
  nextTestDate: Joi.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .required(),
  lastInspectDate: Joi.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
  quantity: Joi.number().integer().min(1).required(),
  inspectionResult: Joi.string().max(255).allow(""),
});
