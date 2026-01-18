import db from "../config/db.js";

export const getAllFlights = async () => {
  const [rows] = await db.execute("SELECT * FROM flight");
  return rows;
};

export const addFlight = async (flight) => {
  const { f_code, f_name, source, destination } = flight;
  await db.execute(
    "INSERT INTO flight (f_code, f_name, source, destination) VALUES (?, ?, ?, ?)",
    [f_code, f_name, source, destination]
  );
};

export const updateFlight = async (originalCode, flight) => {
  const { f_code, f_name, source, destination } = flight;
  await db.execute(
    "UPDATE flight SET f_code = ?, f_name = ?, source = ?, destination = ? WHERE f_code = ?",
    [f_code, f_name, source, destination, originalCode]
  );
};

export const deleteFlight = async (f_code) => {
  await db.execute("DELETE FROM flight WHERE f_code = ?", [f_code]);
};
