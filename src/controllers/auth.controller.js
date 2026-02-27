import { validationResult } from "express-validator";
import { User } from "../models/user.model.js";
import crypto from "crypto";
import { sendVerificationEmail } from "../services/email.service.js";

export const registerUser = async (req, res) => {
     const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map(err => ({
      value: err.value,
      msg: err.msg
    }));

    return res.status(400).json({ errors: formattedErrors });
  }
  const { username, email, password } = req.body;

  const token = crypto.randomBytes(32).toString("hex");

  await User.create({
    username,
    email,
    password,
    emailVerificationToken: token
  });

  await sendVerificationEmail(email, token);

  res.status(201).json({ message: "Check your email to verify account" });
};

export const verifyEmail = async (req, res) => {
  const user = await User.findOne({
    emailVerificationToken: req.params.token
  });

  if (!user)
    return res.status(400).json({ message: "Invalid link" });

  user.isEmailVerified = true;
  user.emailVerificationToken = undefined;
  await user.save();

  res.json({ message: "Email verified successfully" });
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "Invalid credentials" });

  if (!user.isEmailVerified)
    return res.status(403).json({ message: "Verify email first" });

  const isMatch = await user.comparePassword(password);
  if (!isMatch)
    return res.status(400).json({ message: "Invalid credentials" });

  req.session.userId = user._id;
  req.session.role = user.role;

  res.json({ message: "Login successful" });
};

export const logoutUser = (req, res) => {
  req.session.destroy(() => {
    res.clearCookie("sid");
    res.json({ message: "Logged out" });
  });
};