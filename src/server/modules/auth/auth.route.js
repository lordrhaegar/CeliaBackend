import express from "express";
import { userUniqueSchemaValueExist } from "../../middleware/unique_schema_value.js";
import {
  registerControllerValidator,
  loginControllerValidator,
  updateUserControllerValidator,
} from "./auth.validators.js";

const router = express.Router();

import {
  register,
  login,
  getUsers,
  updateUser,
  updatePassword,
  updateUserAdmin,
  getUserById,
  getLoggedInUser,
  deleteUser,
} from "./auth.controllers.js";
import validateSchema from "../../middleware/validate_schema.js";
import { getUserFromToken } from "../../utils/json_web_token.js";

router.post(
  "/register",
  [userUniqueSchemaValueExist],
  validateSchema(registerControllerValidator.body),
  register
);

router.post("/login", validateSchema(loginControllerValidator.body), login);

router.put(
  "/user/:userId",
  validateSchema(updateUserControllerValidator.body),
  updateUserAdmin
);

router.get("/user/:userId", getUserById);

router.put(
  "/update",
  validateSchema(updateUserControllerValidator.body),
  getUserFromToken,
  updateUser
);

router.put("/updatepassword", getUserFromToken, updatePassword);

router.get("/users", getUsers);

router.get("/loggedinuser", getUserFromToken, getLoggedInUser);

router.delete("/delete", deleteUser);

export default router;
