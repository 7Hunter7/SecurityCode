import Joi from "joi";

// Схема валидации Joi
export const sizItemValidationSchema = Joi.object({
  location: Joi.string().min(3).max(255).required(),
  type: Joi.string().min(3).max(255).required(),
  voltageClass: Joi.string()
    .valid("0,4", "1", "3", "6", "10", "15", "20", "35", "110", "220")
    .required(),
  szType: Joi.string().allow(""),
  number: Joi.string().required(),
  testDate: Joi.date().required(),
  nextTestDate: Joi.date().required(),
  lastInspectDate: Joi.date().optional(), // Поле не обязательное
  quantity: Joi.number().integer().min(1).required(),
  note: Joi.string().max(255).allow(""),
});
