import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

/* =========================
   GENERATE TOKEN
========================= */
const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

/* =========================
   COOKIE OPTIONS
========================= */
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  path: "/",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

/* =========================
   SIGNUP
========================= */
export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;

  try {
    const hashedPassword = bcryptjs.hashSync(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({
      success: true,
      message: "User created successfully",
    });
  } catch (error) {
    next(error);
  }
};

/* =========================
   SIGNIN
========================= */
export const signin = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const validUser = await User.findOne({ email });

    if (!validUser) {
      return next(errorHandler(404, "User not found"));
    }

    const validPassword = bcryptjs.compareSync(
      password,
      validUser.password
    );

    if (!validPassword) {
      return next(errorHandler(401, "Invalid credentials"));
    }

    const token = generateToken(validUser._id);

    const { password: pass, ...userData } = validUser._doc;

    res
      .cookie("access_token", token, cookieOptions)
      .status(200)
      .json(userData);
  } catch (error) {
    next(error);
  }
};

/* =========================
   GOOGLE LOGIN
========================= */
export const google = async (req, res, next) => {
  try {
    let user = await User.findOne({
      email: req.body.email,
    });

    if (user) {
      const token = generateToken(user._id);

      const { password, ...rest } = user._doc;

      return res
        .cookie("access_token", token, cookieOptions)
        .status(200)
        .json(rest);
    }

    const generatedPassword =
      Math.random().toString(36).slice(-8) +
      Math.random().toString(36).slice(-8);

    const hashedPassword = bcryptjs.hashSync(
      generatedPassword,
      10
    );

    const newUser = new User({
      username:
        req.body.name
          .split(" ")
          .join("")
          .toLowerCase() +
        Math.random().toString(36).slice(-4),

      email: req.body.email,
      password: hashedPassword,
      avatar: req.body.photo,
    });

    await newUser.save();

    const token = generateToken(newUser._id);

    const { password, ...rest } = newUser._doc;

    res
      .cookie("access_token", token, cookieOptions)
      .status(200)
      .json(rest);
  } catch (error) {
    next(error);
  }
};

/* =========================
   SIGN OUT
========================= */
export const signOut = async (req, res, next) => {
  try {
    res.clearCookie("access_token", {
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite:
        process.env.NODE_ENV === "production"
          ? "none"
          : "lax",
    });

    res.status(200).json({
      success: true,
      message: "User logged out",
    });
  } catch (error) {
    next(error);
  }
};