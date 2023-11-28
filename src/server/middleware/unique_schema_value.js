import User from "../models/user_model.js";
import { BAD_REQUEST, SERVER_ERROR } from "../types/status_code.js";

export const userUniqueSchemaValueExist = async (req, res, next) => {
  try {
    const { email } = req.body;

    const emailExist = await User.findOne({ email });

    if (emailExist) {
      return res.status(BAD_REQUEST).json({ message: "Email already in use" });
    }

    next();
  } catch (error) {
    return res.status(SERVER_ERROR).json({ message: error.message });
  }
};

export const doctorUniqueSchemaValueExist = async (req, res, next) => {
  try {
    const { email } = req.body;

    const emailExist = await User.findOne({ email });

    if (emailExist) {
      return res.status(BAD_REQUEST).json({ message: "Email already in use" });
    }

    next();
  } catch (error) {
    return res.status(SERVER_ERROR).json({ message: error.message });
  }
};
