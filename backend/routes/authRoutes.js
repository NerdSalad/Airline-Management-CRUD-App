import express from "express";
import db from "../config/db.js";

const router = express.Router();

router.post("/login", (req, res) => {
  const { username, password } = req.body;
  const sql = "SELECT * FROM login WHERE username = ? AND password = ?";

  db.query(sql, [username, password], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }
    if (results.length > 0) {
      return res.json({ success: true, message: "Login successful" });
    } else {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }
  });
});

export default router;
