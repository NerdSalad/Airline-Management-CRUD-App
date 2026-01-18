import db from "../config/db.js";

export const getAllReservations = (callback) => {
  db.query("SELECT * FROM reservation", callback);
};

export const addReservation = (data, callback) => {
  const { PNR, TICKET, aadhar, name, nationality, flightname, flightcode, src, des, ddate } = data;
  db.query(
    "INSERT INTO reservation (PNR, TICKET, aadhar, name, nationality, flightname, flightcode, src, des, ddate) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
    [PNR, TICKET, aadhar, name, nationality, flightname, flightcode, src, des, ddate],
    callback
  );
};
