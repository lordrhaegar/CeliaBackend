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
    gender: Joi.string().valid("Male", "Female").required(),
    speciality: Joi.string()
      .valid(
        "Allergy and immunology",
        "Anesthesiology",
        "Dermatology",
        "Diagnostic radiology",
        "Emergency medicine",
        "Family medicine",
        "Internal medicine",
        "Medical genetics",
        "Neurology",
        "Nuclear medicine",
        "Obstetrics and gynecology",
        "Ophthalmology",
        "Pathology",
        "Pediatrics",
        "Physical medicine and rehabilitation",
        "Preventive medicine",
        "Psychiatry",
        "Radiation oncology",
        "Surgery",
        "Urology"
      )
      .required(),
    is_active: Joi.boolean(),
    booking_link: Joi.string(),
    profile_img: Joi.string(),
  }),
};

// POST /api/doctor/login
export const loginControllerValidator = {
  body: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
};
