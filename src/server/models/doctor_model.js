import mongoose from "mongoose";
import mongooseTimestamp from "mongoose-timestamp";
import bcrypt from "bcryptjs";
import crypto from "crypto";

const Schema = mongoose.Schema;

var DoctorSchema = new Schema({
  avatar: {
    type: String,
  },
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    Enum: ["Male", "Female"],
    default: "Male",
    required: false,
  },
  license: {
    type: String,
    required: true,
  },
  id_card: {
    type: String,
    required: true,
  },
  mobile: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: false,
    lowercase: true,
  },
  date_of_birth: {
    type: Date,
    required: false,
  },
  email_update: {
    type: String,
  },
  email_update_token: {
    type: String,
  },
  email_update_expiration: {
    type: String,
  },
  password: {
    type: String,
    required: true,
    hide: true,
  },
  password_reset_token: {
    type: String,
    hide: true,
  },
  password_reset_expiration: {
    type: Date,
    hide: true,
  },
  account_verification_token: {
    type: String,
    hide: true,
  },
  account_verification_expiration: {
    type: Date,
    hide: true,
  },
  is_verified: {
    type: Boolean,
    default: false,
  },
  is_active: {
    type: Boolean,
    default: false,
  },
  is_otp: {
    type: Boolean,
    default: false,
  },
  otp_tmp_secret: {
    type: String,
    default: "",
    hide: true,
  },
  otp_secret: {
    type: String,
    default: "",
    hide: true,
  },
  address: {
    type: String,
    required: false,
  },
});

DoctorSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

DoctorSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

DoctorSchema.methods.getResetPasswordToken = function () {
  //Generate Token
  const resetToken = crypto.randomBytes(20).toString("hex");

  // Hash token and set to resetPassword field
  this.resetPasswordToken = crypto
    .createHmac("sha256", process.env.JWT_SECRET)
    .update(resetToken)
    .digest("hex");

  // set expire
  this.resetPasswordExpire = Date.now() + 60 * 60 * 10000;

  return resetToken;
};

// DoctorSchema.plugin(mongooseHidden());

DoctorSchema.plugin(mongooseTimestamp);

const Doctor = mongoose.model("Doctor", DoctorSchema);
export default Doctor;
