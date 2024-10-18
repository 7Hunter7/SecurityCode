import Joi from "joi";
import { PZ_TYPES, VOLTAGE_CLASSES } from "../constants/constants.js";

// Joi схема валидации
export const sizItemValidationSchema = Joi.object({
  location: Joi.string().min(3).max(255).required(),
  type: Joi.string()
    .min(3)
    .max(255)
    .required()
    .custom((value, helpers) => {
      if (PZ_TYPES.includes(value)) {
        // Если тип устройства относится к PZ_TYPES, делаем поля необязательными
        helpers.state.ancestors[0].testDate = null;
        helpers.state.ancestors[0].nextTestDate = null;
      }
      return value;
    }),
  voltage: Joi.string()
    .valid(...VOLTAGE_CLASSES)
    .required(),
  szType: Joi.string().allow(""),
  number: Joi.number().integer().required(),
  testDate: Joi.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .allow(null, "")
    .when("type", {
      is: Joi.valid(...PZ_TYPES),
      then: Joi.optional(),
      otherwise: Joi.required(),
    }), // Не обязательное, если тип из PZ_TYPES
  nextTestDate: Joi.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .allow(null, "")
    .when("type", {
      is: Joi.valid(...PZ_TYPES),
      then: Joi.optional(),
      otherwise: Joi.required(),
    }), // Не обязательное, если тип из PZ_TYPES
  lastInspectDate: Joi.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
  quantity: Joi.number().integer().min(1).required(),
  inspectionResult: Joi.string().max(255).allow(""),
});
