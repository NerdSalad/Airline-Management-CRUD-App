import db from "../config/db.js";

export const getAllPassengers = async () => {
  const [rows] = await db.query("SELECT * FROM passenger");
  return rows;
};

export const addPassenger = async (data) => {
  const { name, nationality, aadhar, phone, address, gender, email } = data;
  const [result] = await db.query(
    "INSERT INTO passenger (name, nationality, aadhar, phone, address, gender, email) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [name, nationality, aadhar, phone, address, gender, email]
  );
  return result;
};

export const updatePassenger = async (id, data) => {
  const { name, nationality, phone, address, gender, email } = data;
  const [result] = await db.query(
    "UPDATE passenger SET name=?, nationality=?, phone=?, address=?, gender=?, email=? WHERE aadhar=?",
    [name, nationality, phone, address, gender, email, id]
  );
  return result;
};

export const deletePassenger = async (id) => {
  const [result] = await db.query("DELETE FROM passenger WHERE aadhar=?", [id]);
  return result;
};
