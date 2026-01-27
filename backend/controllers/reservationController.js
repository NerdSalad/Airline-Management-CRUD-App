import db from "../config/db.js";

export const getPassengerByAadhar = async (req, res) => {
  const { aadhar } = req.params;
  try {
    const [rows] = await db.query("SELECT * FROM passenger WHERE aadhar = ?", [aadhar]);
    if (!rows.length) return res.status(404).json({ message: "Passenger not found" });
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: "Error fetching passenger", error });
  }
};

export const getFlightByRoute = async (req, res) => {
  const { src, des } = req.query;
  try {
    if (!src || !des) {
      return res.status(400).json({ message: "Source and destination required" });
    }
    const [rows] = await db.query(
      "SELECT * FROM flight WHERE LOWER(source)=LOWER(?) AND LOWER(destination)=LOWER(?)",
      [src, des]
    );
    if (!rows.length) return res.status(404).json({ message: "No flights found" });
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: "Error fetching flights", error });
  }
};

export const bookFlight = async (req, res) => {
  const { aadhar, flightcode, ddate } = req.body;
  try {
    const [check] = await db.query(
      `SELECT 
         p.name, p.nationality, 
         f.f_name AS flightname, f.source AS src, f.destination AS des
       FROM passenger p
       JOIN flight f ON f.f_code = ?
       WHERE p.aadhar = ?`,
      [flightcode, aadhar]
    );

    if (!check.length) return res.status(404).json({ message: "Passenger or flight not found" });

    const { name, nationality, flightname, src, des } = check[0];
    const pnr = "PNR-" + Math.floor(10000 + Math.random() * 90000);
    const ticket = "TIC-" + Math.floor(1000 + Math.random() * 9000);

    await db.query(
      "INSERT INTO reservation (PNR, TICKET, aadhar, name, nationality, flightname, flightcode, src, des, ddate) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [pnr, ticket, aadhar, name, nationality, flightname, flightcode, src, des, ddate]
    );

    res.json({ message: "Flight booked successfully", pnr, ticket });
  } catch (error) {
    res.status(500).json({ message: "Error booking flight", error });
  }
};

export const getReservations = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        r.PNR,
        r.TICKET,
        r.name,
        r.nationality,
        r.flightname,
        r.flightcode,
        r.src,
        r.des,
        r.ddate,
        DATE_FORMAT(r.ddate, '%d %b %Y') AS formatted_date
      FROM reservation r
      ORDER BY r.ddate DESC
    `);
    
    const processedRows = rows.map(row => ({
      ...row,
      formatted_date: row.ddate 
        ? new Date(row.ddate).toLocaleDateString('en-GB', { 
            day: '2-digit', 
            month: 'short', 
            year: 'numeric' 
          })
        : null
    }));
    
    res.json(processedRows);
  } catch (err) {
    console.error("❌ Error fetching reservations:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getBoardingPassDetails = async (req, res) => {
  const { pnr } = req.params;
  try {
    const [rows] = await db.query(`
      SELECT 
        r.PNR,
        r.TICKET,
        p.name AS passenger_name,
        p.nationality,
        f.f_name AS flight_name,
        f.f_code AS flight_code,
        f.source AS source,
        f.destination AS destination,
        r.ddate AS raw_date
      FROM reservation r
      JOIN passenger p ON r.aadhar = p.aadhar
      JOIN flight f ON r.flightcode = f.f_code
      WHERE r.PNR = ?
    `, [pnr]);

    if (!rows.length) {
      return res.status(404).json({ message: "PNR not found" });
    }

    const result = rows[0];
    const formattedDate = result.raw_date
      ? new Date(result.raw_date).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : "N/A";

    res.json({
      PNR: result.PNR,
      TICKET: result.TICKET,
      passenger_name: result.passenger_name,
      nationality: result.nationality,
      flight_name: result.flight_name,
      flight_code: result.flight_code,
      source: result.source,
      destination: result.destination,
      formatted_date: formattedDate,
    });
  } catch (err) {
    console.error("❌ Error fetching boarding pass:", err);
    res.status(500).json({ message: "Internal server error", error: err });
  }
};
