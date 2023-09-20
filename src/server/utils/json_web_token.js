import jwt from "jsonwebtoken";
import { BAD_REQUEST } from "../types/status_code.js";

export const generateToken = (user) => {
  return jwt.sign({ user }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

export const getUserFromToken = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      res.status(BAD_REQUEST).send("A token is required for authentication");
    }
    jwt.verify(token, process.env.JWT_SECRET, function (err, data) {
      if (err) {
        return res.status(BAD_REQUEST).json({ message: "Token Expired" });
      }

      req.user = data.user;
      next();
    });
  } catch (error) {
    return res.status(BAD_REQUEST).json({ message: error.message });
  }
};
