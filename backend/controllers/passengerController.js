import { getAllPassengers, addPassenger, updatePassenger, deletePassenger } from "../models/passengerModel.js";

export const getPassengers = async (req, res) => {
  try {
    const passengers = await getAllPassengers();
    res.json(passengers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createPassenger = async (req, res) => {
  try {
    console.log("📩 Passenger data received:", req.body);
    await addPassenger(req.body);
    res.status(201).json({ message: "Passenger added successfully" });
  } catch (err) {
    console.error("❌ Error adding passenger:", err);
    res.status(500).json({ error: err.message });
  }
};

export const editPassenger = async (req, res) => {
  try {
    await updatePassenger(req.params.aadhar, req.body);
    res.json({ message: "Passenger updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const removePassenger = async (req, res) => {
  try {
    await deletePassenger(req.params.aadhar);
    res.json({ message: "Passenger deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
