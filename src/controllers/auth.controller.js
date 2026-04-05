import { validationResult as validateResult } from "express-validator";
import { User } from "../models/user.model.js";
import crypto from "crypto";
import { sendVerificationEmail } from "../services/email.service.js";
import { Op } from "sequelize";

export const registerUser = async (req, res) => {
  const errors = validateResult(req);

  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map(err => ({
      value: err.value,
      msg: err.msg
    }));

    return res.status(400).json({ errors: formattedErrors });
  }

  const { username, email, password } = req.body;

  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    return res.status(409).json({ message: "User with this email already exists" });
  }

  const rawToken = crypto.randomBytes(32).toString("hex");

  const hashedToken = crypto
    .createHash("sha256")
    .update(rawToken)
    .digest("hex");

  await User.create({
    username,
    email,
    password,
    emailVerificationToken: hashedToken,
    emailVerificationTokenExpires: new Date(Date.now() + 1000 * 60 * 30)
  });

  await sendVerificationEmail(email, rawToken);

  res.status(201).json({ message: "Check your email to verify account" });
};

export const verifyEmail = async (req, res) => {
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    where: {
      emailVerificationToken: hashedToken,
      emailVerificationTokenExpires: { [Op.gt]: new Date() }
    }
  });

  if (!user) {
    return res.status(400).json({
      message: "Invalid or expired verification link. NOTE: If you already clicked the link in your email, your account is already verified and this link is no longer valid."
    });
  }

  user.isEmailVerified = true;
  user.emailVerificationToken = null;
  user.emailVerificationTokenExpires = null;

  await user.save();

  res.json({
    message: "Email verified successfully"
  });
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ where: { email } });
  if (!user)
     return res.status(400).json({ message: "Invalid credentials" });

  if (!user.isEmailVerified)
    return res.status(403).json({ message: "Please verify your email before logging in" });

  const isMatch = await user.comparePassword(password);
  if (!isMatch)
    return res.status(400).json({ message: "Invalid credentials" });

    req.session.regenerate(err => {
    if (err)
      return res.status(500).json({ message: "Login failed" });

    req.session.userId = user.id;
    req.session.role = user.role;

    res.json({ message: "Login successful" });
  });
};

export const logoutUser = (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Logout failed" });
    }

    res.clearCookie("sid", {
      httpOnly: true,
      sameSite: "strict",
    });

    res.json({ message: "Logged out successfully" });
  });
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ where: { email } });
  
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const rawToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");

  user.resetPasswordToken = hashedToken;
  user.resetPasswordExpires = new Date(Date.now() + 1000 * 60 * 15); // 15 mins
  await user.save();

  res.json({ message: "Password reset link sent to your email" });
};

export const resetPassword = async (req, res) => {
  const hashedToken = crypto.createHash("sha256").update(req.params.token).digest("hex");

  const user = await User.findOne({
    where: {
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { [Op.gt]: new Date() }
    }
  });

  if (!user) {
    return res.status(400).json({ message: "Invalid or expired reset token" });
  }

  user.password = req.body.password; // The beforeSave hook will hash it
  user.resetPasswordToken = null;
  user.resetPasswordExpires = null;
  await user.save();

  res.json({ message: "Password has been successfully reset" });
};