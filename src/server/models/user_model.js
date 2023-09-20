import mongoose from "mongoose";
import mongooseHidden from "mongoose-hidden";
import mongooseTimestamp from "mongoose-timestamp";
import pick from "lodash/pick.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";

const Schema = mongoose.Schema;

var UserSchema = new Schema({
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
    required: false,
  },
  occupation: {
    type: String,
    required: false,
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
  is_admin: {
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
  referral_count: {
    type: Number,
    default: 0,
  },
  referral_user: {
    type: String,
    require: false,
  },
  referral_link: {
    type: String,
    required: false,
  },
  referral_bonus: {
    type: String,
    required: false,
  },
  balance: {
    type: Number,
    required: false,
  },
  occupation: {
    type: String,
    required: false,
  },
  address: {
    type: String,
    required: false,
  },
});

UserSchema.pre(/^(save)/, function () {
  let self = this;
  self.referralLink = `?refId=${self._id}`;
});

UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.getResetPasswordToken = function () {
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

const PUBLIC_FIELDS = [
  "_id",
  "user_id",
  "firstname",
  "lastname",
  "email",
  "is_admin",
  "is_otp",
  "is_verified",
  "mobile",
  "date_of_birth",
  "reason",
  "occupation",
];

UserSchema.methods.getPublicFields = function () {
  return pick(this, PUBLIC_FIELDS);
};

// UserSchema.plugin(mongooseHidden());

UserSchema.plugin(mongooseTimestamp);

const User = mongoose.model("User", UserSchema);
export default User;
