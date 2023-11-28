import Joi from "joi";

// POST /api/doctor/register
export const registerControllerValidator = {
  body: Joi.object({
    firstname: Joi.string().min(3).max(15).required(),
    lastname: Joi.string().min(3).max(15).required(),
    gender: Joi.string().valid("Male", "Female").required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(12).required(),
    password_confirmation: Joi.any().valid(Joi.ref("password")).required(),
    license: Joi.string(),
    id_card: Joi.string(),
  }),
};

// POST /api/doctor/doctor/:doctorId
export const updateDoctorControllerValidator = {
  body: Joi.object({
    firstname: Joi.string().min(3).max(15),
    lastname: Joi.string().min(3).max(15),
    mobile: Joi.string().min(10).max(14),
    is_active: Joi.boolean(),
  }),
};

// POST /api/doctor/login
export const loginControllerValidator = {
  body: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
};
