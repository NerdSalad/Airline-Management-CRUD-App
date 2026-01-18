// server/routes/boarding.js
import express from "express";
import db from "../config/db.js";

const router = express.Router();

router.get("/:pnr", async (req, res) => {
  let { pnr } = req.params;
  
  // Ensure PNR has the correct format
  if (!pnr.startsWith("PNR-")) {
    pnr = `PNR-${pnr}`;
  }
  
  console.log("🔍 Searching for PNR:", pnr);

  try {
    const query = `
      SELECT 
        r.PNR,
        r.TICKET,
        r.name AS passenger_name,
        r.nationality,
        r.flightname AS flight_name,
        r.flightcode AS flight_code,
        r.src AS source,
        r.des AS destination,
        r.ddate AS formatted_date
      FROM reservation r
      WHERE r.PNR = ?
    `;

    const [rows] = await db.query(query, [pnr]);

    if (rows.length === 0) {
      console.log("❌ No record found for PNR:", pnr);
      return res.status(404).json({ message: "PNR not found" });
    }

    console.log("✅ Boarding pass data found:", rows[0]);
    res.json(rows[0]);
  } catch (err) {
    console.error("⚠️ Database error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

export default router;