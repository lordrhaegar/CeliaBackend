import Joi from "joi";

// POST /api/auth/register
export const registerControllerValidator = {
  body: Joi.object({
    firstname: Joi.string().min(3).max(15).required(),
    lastname: Joi.string().min(3).max(15).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(12).required(),
    password_confirmation: Joi.any().valid(Joi.ref("password")).required(),
  }),
};

// POST /api/auth/user/:userId
export const updateUserControllerValidator = {
  body: Joi.object({
    avatar: Joi.string(),
    firstname: Joi.string().min(3).max(15),
    lastname: Joi.string().min(3).max(15),
    mobile: Joi.string().min(10).max(14),
    date_of_birth: Joi.date(),
    occupation: Joi.string(),
  }),
};

// POST /api/auth/login
export const loginControllerValidator = {
  body: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
};
