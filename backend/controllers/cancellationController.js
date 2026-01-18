import db from "../config/db.js";

export const getReservationByPNR = async (req, res) => {
  const { pnr } = req.params;
  try {
    const [rows] = await db.query(
      `SELECT PNR, TICKET, name, nationality, flightname, flightcode, src, des, ddate
       FROM reservation
       WHERE PNR = ?`,
      [pnr]
    );

    if (!rows.length)
      return res.status(404).json({ message: "No reservation found" });

    const processedRow = {
      ...rows[0],
      formatted_date: rows[0].ddate 
        ? new Date(rows[0].ddate).toLocaleDateString('en-GB', { 
            day: '2-digit', 
            month: 'short', 
            year: 'numeric' 
          })
        : null
    };
    
    res.json(processedRow);
  } catch (err) {
    console.error("❌ Error fetching reservation:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// 🔹 Cancel reservation (delete from table)
export const cancelReservation = async (req, res) => {
  const { pnr } = req.params;
  try {
    const [result] = await db.query("DELETE FROM reservation WHERE PNR = ?", [
      pnr,
    ]);
    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Reservation not found" });

    res.json({ message: `Ticket with PNR ${pnr} cancelled successfully.` });
  } catch (err) {
    console.error("❌ Error cancelling reservation:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
