import bcrypt from "bcrypt";

import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

export const registerUser = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      res.status(400);
      throw new Error("Username, email, and password are required");
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });

    if (existingUser) {
      res.status(400);
      throw new Error("An account with this email already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      username: username.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword
    });

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400);
      throw new Error("Email and password are required");
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() }).select(
      "+password"
    );

    if (!user) {
      res.status(401);
      throw new Error("Invalid email or password");
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      res.status(401);
      throw new Error("Invalid email or password");
    }

    res.json({
      token: generateToken(user._id),
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    next(error);
  }
};

