import express from "express";
import { doctorUniqueSchemaValueExist } from "../../middleware/unique_schema_value.js";
import {
  registerControllerValidator,
  loginControllerValidator,
  updateDoctorControllerValidator,
} from "./doctor.validators.js";

const router = express.Router();

import {
  register,
  login,
  getDoctors,
  updateDoctor,
  updatePassword,
  updateDoctorAdmin,
  getDoctorById,
  getLoggedInDoctor,
  deleteDoctor,
  getActiveDoctors,
} from "./doctor.controllers.js";
import validateSchema from "../../middleware/validate_schema.js";
import { getUserFromToken } from "../../utils/json_web_token.js";

router.post(
  "/register",
  [doctorUniqueSchemaValueExist],
  validateSchema(registerControllerValidator.body),
  register
);

router.post("/login", validateSchema(loginControllerValidator.body), login);

router.put(
  "/doctor/:doctorId",
  validateSchema(updateDoctorControllerValidator.body),
  updateDoctorAdmin
);

router.get("/doctor/:doctorId", getDoctorById);

router.put(
  "/update",
  validateSchema(updateDoctorControllerValidator.body),
  getUserFromToken,
  updateDoctor
);

router.put("/updatepassword", getUserFromToken, updatePassword);

router.get("/alldoctors", getDoctors);
router.get("/activedoctors", getActiveDoctors);

router.get("/loggedindoctor", getUserFromToken, getLoggedInDoctor);

router.delete("/delete", deleteDoctor);

export default router;
