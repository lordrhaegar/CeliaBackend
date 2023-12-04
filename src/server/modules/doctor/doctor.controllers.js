import DoctorModel from "../../models/doctor_model.js";
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
import { generateToken } from "../../utils/json_web_token.js";

export async function register(req, res, next) {
  try {
    let { firstname, lastname, email, password, license, id_card } = req.body;

    email = email.charAt(0).toUpperCase() + email.slice(1);

    // Create doctor
    const doctor = await DoctorModel.create({
      firstname: firstname[0].toUpperCase() + firstname.slice(1),
      lastname: lastname[0].toUpperCase() + lastname.slice(1),
      email,
      password,
      license,
      id_card,
    });

    const token = generateToken(doctor);

    // sendWelcomeMail(doctor.email, doctor.doctorName, email, password);
    return res.status(SUCCESS).json({
      message: "Registration successful",
      token,
      doctor,
    });
  } catch (error) {
    return res.status(SERVER_ERROR).json({ message: error.message });
  }
}

export async function login(req, res, next) {
  try {
    let { email, password } = req.body;

    if (!email || !password) {
      return res.status(BAD_REQUEST).json({
        message: "Please provide your email and password",
      });
    }

    let doctor = await DoctorModel.findOne({ email });

    if (doctor) {
      const isPasswordValid = await doctor.matchPassword(password);

      if (!isPasswordValid) {
        return res
          .status(BAD_REQUEST)
          .json({ message: "email or password invalid" });
      }

      const token = generateToken(doctor);

      return res.status(SUCCESS).json({
        token,
        doctor,
        message: "Login successful",
      });
    }

    return res.status(NOT_FOUND).json({ message: "email or password invalid" });
  } catch (error) {
    return res.status(SERVER_ERROR).json({ message: error.message });
  }
}

export async function updateDoctorAdmin(req, res, next) {
  try {
    const { doctorId } = req.params;

    const {
      profile_img,
      firstname,
      lastname,
      gender,
      license,
      id_card,
      is_verified,
      booking_link,
      ...rest
    } = req.body;

    let doctor = await DoctorModel.findByIdAndUpdate(doctorId, {
      firstname: firstname[0].toUpperCase() + firstname.slice(1),
      lastname: lastname[0].toUpperCase() + lastname.slice(1),
      mobile,
      date_of_birth,
      gender,
      profile_img,
      license,
      id_card,
      is_verified,
      booking_link,
      ...rest,
    });

    if (!doctor)
      return res.status(BAD_REQUEST).json({ message: ITEM_NOT_FOUND });

    return res.status(SUCCESS).json({ message: UPDATE_SUCCESS });
  } catch (error) {
    return res.status(SERVER_ERROR).json({ message: error.message });
  }
}

export async function getDoctorById(req, res, next) {
  try {
    const { doctorId } = req.params;

    let doctor = await DoctorModel.findById(doctorId);

    if (!doctor)
      return res.status(BAD_REQUEST).json({ message: ITEM_NOT_FOUND });

    return res.status(SUCCESS).json({ message: SUCCESS, doctor });
  } catch (error) {
    return res.status(SERVER_ERROR).json({ message: error.message });
  }
}

export async function updateDoctor(req, res, next) {
  try {
    const {
      firstname,
      lastname,
      mobile,
      is_active,
      profile_img,
      booking_link,
      speciality,
      gender,
    } = req.body;

    let doctor = await DoctorModel.findByIdAndUpdate(req.user._id, {
      firstname: firstname && firstname[0].toUpperCase() + firstname.slice(1),
      lastname: lastname && lastname[0].toUpperCase() + firstname.slice(1),
      is_active: is_active && is_active,
      mobile: mobile && mobile,
      profile_img: profile_img && profile_img,
      booking_link: booking_link && booking_link,
      speciality: speciality && speciality,
      gender: gender && gender,
    });

    if (!doctor)
      return res.status(BAD_REQUEST).json({ message: ITEM_NOT_FOUND });

    return res.status(SUCCESS).json({ message: UPDATE_SUCCESS });
  } catch (error) {
    return res.status(SERVER_ERROR).json({ message: error.message });
  }
}

export async function getLoggedInDoctor(req, res, next) {
  try {
    let doctor = await DoctorModel.findById(req.doctor._id);

    if (!doctor)
      return res.status(BAD_REQUEST).json({ message: ITEM_NOT_FOUND });

    return res.status(SUCCESS).json({ message: FETCHED_SUCCESSFUL, doctor });
  } catch (error) {
    return res.status(SERVER_ERROR).json({ message: error.message });
  }
}

export async function updatePassword(req, res, next) {
  try {
    const { password, newPassword } = req.body;

    const doctor = await DoctorModel.findById(req.doctor._id);

    if (!doctor) {
      return res.status(BAD_REQUEST).json({ message: ITEM_NOT_FOUND });
    }

    const isPasswordValid = await doctor.matchPassword(password);

    if (isPasswordValid) {
      doctor.password = newPassword;
      await doctor.save();

      return res.status(SUCCESS).json({ message: UPDATE_SUCCESS });
    }

    return res.status(BAD_REQUEST).json({ message: "password invalid" });
  } catch (error) {
    return res.status(SERVER_ERROR).json({ message: error.message });
  }
}

export async function getDoctors(req, res, next) {
  try {
    const doctors = await DoctorModel.find();

    if (!doctors)
      return res.status(BAD_REQUEST).json({ message: ITEM_NOT_FOUND });

    return res.status(SUCCESS).json({ message: FETCHED_SUCCESSFUL, doctors });
  } catch (error) {
    return res.status(SERVER_ERROR).json({ message: error.message });
  }
}

export async function getActiveDoctors(req, res, next) {
  try {
    const doctors = await DoctorModel.find({ is_active: true });

    if (!doctors)
      return res.status(BAD_REQUEST).json({ message: ITEM_NOT_FOUND });

    return res.status(SUCCESS).json({ message: FETCHED_SUCCESSFUL, doctors });
  } catch (error) {
    return res.status(SERVER_ERROR).json({ message: error.message });
  }
}

export async function deleteDoctor(req, res, next) {
  try {
    let { doctor_id } = req.body;

    let doctor = await DoctorModel.findById(doctor_id);

    if (!doctor)
      return res.status(BAD_REQUEST).json({ message: ITEM_NOT_FOUND });

    let response = await DoctorModel.findByIdAndDelete(doctor._id);

    if (!response)
      return res.status(BAD_REQUEST).json({ message: ITEM_NOT_FOUND });

    return res.status(SUCCESS).json({ message: DELETED_SUCCESSFUL });
  } catch (error) {
    return res.status(SERVER_ERROR).json({ message: error.message });
  }
}
