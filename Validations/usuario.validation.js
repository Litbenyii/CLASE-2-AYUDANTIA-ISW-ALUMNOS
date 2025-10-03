import Joi from "joi";

const emailRule = Joi.string().trim().email().max(120).messages({
  "string.email": "El correo no tiene un formato válido.",
  "string.max": "El correo no puede superar los {#limit} caracteres.",
  "string.empty": "El correo es obligatorio.",
});

const passwordRule = Joi.string()
  .min(8)
  .max(64)
  .pattern(/^(?=.*[A-Za-z])(?=.*\d).+$/)
  .messages({
    "string.min": "La contraseña debe tener al menos {#limit} caracteres.",
    "string.max": "La contraseña no puede superar los {#limit} caracteres.",
    "string.pattern.base":
      "La contraseña debe incluir al menos una letra y un número.",
    "string.empty": "La contraseña es obligatoria.",
  });

export const registerUserValidation = Joi.object({
  email: emailRule.required(),
  password: passwordRule.required(),
})
  .required()
  .options({
    allowUnknown: false, 
    abortEarly: false,   
    stripUnknown: true,  
  });

export const loginValidation = Joi.object({
  email: emailRule.required(),
  password: Joi.string().min(1).required().messages({
    "string.empty": "La contraseña es obligatoria.",
  }),
})
  .required()
  .options({
    allowUnknown: false,
    abortEarly: false,
    stripUnknown: true,
  });

export const updateUserValidation = Joi.object({
  email: emailRule.optional(),
  password: passwordRule.optional(),
})
  .or("email", "password")
  .messages({
    "object.missing": "Debe enviar al menos 'email' o 'password'.",
  })
  .options({
    allowUnknown: false,
    abortEarly: false,
    stripUnknown: true,
  });