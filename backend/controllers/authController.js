import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { findUserByUsername, createUser } from "../models/userModel.js";

dotenv.config();

export const register = (req, res) => {
  const { username, password } = req.body;
  bcrypt.hash(password, 10, (err, hash) => {
    if (err) return res.status(500).json({ error: err });
    createUser(username, hash, (err, result) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ message: "User registered successfully" });
    });
  });
};

export const login = (req, res) => {
  const { username, password } = req.body;
  findUserByUsername(username, (err, results) => {
    if (err || results.length === 0) return res.status(401).json({ message: "Invalid credentials" });

    const user = results[0];
    bcrypt.compare(password, user.password, (err, match) => {
      if (!match) return res.status(401).json({ message: "Invalid credentials" });
      const token = jwt.sign({ username: user.username }, process.env.JWT_SECRET, { expiresIn: "1d" });
      res.json({ message: "Login successful", token });
    });
  });
};
