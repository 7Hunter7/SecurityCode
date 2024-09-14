const Joi = require("joi");

// Схема валидации Joi
const sizItemValidationSchema = Joi.object({
  location: Joi.string().min(3).max(100).required(),
  type: Joi.string().min(3).max(100).required(),
  voltageClass: Joi.string()
    .valid(
      "0,4",
      "1",
      "3",
      "6",
      "10",
      "15",
      "20",
      "35",
      "110",
      "150",
      "220",
      "330",
      "500",
      "750",
      "1150"
    )
    .required(),
  szType: Joi.string().required(),
  number: Joi.number().integer().required(),
  testDate: Joi.date().required(),
  nextTestDate: Joi.date().required(),
  lastInspectDate: Joi.date(),
  quantity: Joi.number().integer().min(1).required(),
  note: Joi.string().max(255),
});

module.exports = { sizItemValidationSchema };
