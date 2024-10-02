import Joi from "joi";

export const articleNameValidationSchema = Joi.string()
  .pattern(/^[a-zA-Z0-9_-]+$/)
  .required();

export const tokenValidationSchema = Joi.string().optional();

export const userValidationSchema = Joi.object({
  userName: Joi.string().required(),
  language: Joi.string().optional(),
});
