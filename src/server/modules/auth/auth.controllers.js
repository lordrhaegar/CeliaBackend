import UserModel from "../../models/user_model.js";
import {
  BAD_REQUEST,
  NOT_FOUND,
  SERVER_ERROR,
  SUCCESS,
} from "../../types/status_code.js";
import {
  DELETED_SUCCESSFUL,
  FETCHED_SUCCESSFUL,
  ITEM_NOT_FOUND,
  UPDATE_SUCCESS,
} from "../../types/status_message.js";
import { generateToken, getUserFromToken } from "../../utils/json_web_token.js";

export async function register(req, res, next) {
  try {
    let { firstname, lastname, email, password } = req.body;

    email = email.charAt(0).toUpperCase() + email.slice(1);

    // Create user
    const user = await UserModel.create({
      firstname: firstname[0].toUpperCase() + firstname.slice(1),
      lastname: lastname[0].toUpperCase() + lastname.slice(1),
      email,
      password,
    });

    const token = generateToken(user);

    // sendWelcomeMail(user.email, user.userName, email, password);

    return res.status(SUCCESS).json({
      message: "Successfully registered",
      token,
      user,
    });
  } catch (error) {
    return res.status(SERVER_ERROR).json({ message: error.message });
  }
}

export async function login(req, res, next) {
  try {
    let { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(BAD_REQUEST)
        .json({ message: "Please provide an username or email and password" });
    }

    let user = await UserModel.findOne({ email });

    if (user) {
      const isPasswordValid = await user.matchPassword(password);

      if (!isPasswordValid) {
        return res
          .status(BAD_REQUEST)
          .json({ message: "email or password invalid" });
      }

      const token = generateToken(user);

      return res.status(SUCCESS).json({
        token,
        user,
        message: "Login successful",
      });
    }

    return res.status(NOT_FOUND).json({ message: "email or password invalid" });
  } catch (error) {
    return res.status(SERVER_ERROR).json({ message: error.message });
  }
}

export async function updateUserAdmin(req, res, next) {
  try {
    const { userId } = req.params;

    const { firstname, lastname, mobile, date_of_birth, gender } = req.body;

    let user = await UserModel.findByIdAndUpdate(userId, {
      firstname: firstname[0].toUpperCase() + firstname.slice(1),
      lastname: lastname[0].toUpperCase() + lastname.slice(1),
      mobile,
      date_of_birth,
      gender,
    });

    if (!user) return res.status(BAD_REQUEST).json({ message: ITEM_NOT_FOUND });

    return res.status(SUCCESS).json({ message: UPDATE_SUCCESS });
  } catch (error) {
    return res.status(SERVER_ERROR).json({ message: error.message });
  }
}

export async function getUserById(req, res, next) {
  try {
    const { userId } = req.params;

    let user = await UserModel.findById(userId);

    if (!user) return res.status(BAD_REQUEST).json({ message: ITEM_NOT_FOUND });

    return res.status(SUCCESS).json({ message: SUCCESS, user });
  } catch (error) {
    return res.status(SERVER_ERROR).json({ message: error.message });
  }
}

export async function updateUser(req, res, next) {
  try {
    const { firstname, lastname, mobile, date_of_birth, gender } = req.body;

    let user = await UserModel.findByIdAndUpdate(req.user._id, {
      firstname: firstname && firstname[0].toUpperCase() + firstname.slice(1),
      lastname: lastname && lastname[0].toUpperCase() + firstname.slice(1),
      mobile: mobile && mobile,
      gender: gender && gender,
      date_of_birth: date_of_birth && date_of_birth,
    });

    if (!user) return res.status(BAD_REQUEST).json({ message: ITEM_NOT_FOUND });

    return res.status(SUCCESS).json({ message: UPDATE_SUCCESS });
  } catch (error) {
    return res.status(SERVER_ERROR).json({ message: error.message });
  }
}

export async function getLoggedInUser(req, res, next) {
  try {
    let user = await UserModel.findById(req.user._id);

    if (!user) return res.status(BAD_REQUEST).json({ message: ITEM_NOT_FOUND });

    return res.status(SUCCESS).json({ message: FETCHED_SUCCESSFUL, user });
  } catch (error) {
    return res.status(SERVER_ERROR).json({ message: error.message });
  }
}

export async function updatePassword(req, res, next) {
  try {
    const { password, newPassword } = req.body;

    const user = await UserModel.findById(req.user._id);

    if (!user) {
      return res.status(BAD_REQUEST).json({ message: ITEM_NOT_FOUND });
    }

    const isPasswordValid = await user.matchPassword(password);

    if (isPasswordValid) {
      user.password = newPassword;
      await user.save();

      return res.status(SUCCESS).json({ message: UPDATE_SUCCESS });
    }

    return res.status(BAD_REQUEST).json({ message: "password invalid" });
  } catch (error) {
    return res.status(SERVER_ERROR).json({ message: error.message });
  }
}

export async function getUsers(req, res, next) {
  try {
    const users = await UserModel.find();

    if (!users)
      return res.status(BAD_REQUEST).json({ message: ITEM_NOT_FOUND });

    return res.status(SUCCESS).json({ message: FETCHED_SUCCESSFUL, users });
  } catch (error) {
    return res.status(SERVER_ERROR).json({ message: error.message });
  }
}

export async function deleteUser(req, res, next) {
  try {
    let { user_id } = req.body;

    let user = await UserModel.findById(user_id);

    if (!user) return res.status(BAD_REQUEST).json({ message: ITEM_NOT_FOUND });

    let response = await UserModel.findByIdAndDelete(user._id);

    if (!response)
      return res.status(BAD_REQUEST).json({ message: ITEM_NOT_FOUND });

    return res.status(SUCCESS).json({ message: DELETED_SUCCESSFUL });
  } catch (error) {
    return res.status(SERVER_ERROR).json({ message: error.message });
  }
}
