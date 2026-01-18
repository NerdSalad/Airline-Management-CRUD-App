import {
  getAllFlights,
  addFlight,
  updateFlight,
  deleteFlight,
} from "../models/flightModel.js";

export const getFlights = async (req, res) => {
  try {
    const flights = await getAllFlights();
    res.json(flights);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createFlight = async (req, res) => {
  try {
    await addFlight(req.body);
    res.status(201).json({ message: "Flight added successfully" });
  } catch (err) {
    console.error("❌ Error adding flight:", err);
    res.status(500).json({ error: err.message });
  }
};

export const editFlight = async (req, res) => {
  try {
    const originalCode = req.params.f_code;
    const updatedData = req.body;
    await updateFlight(originalCode, updatedData);
    res.json({ message: "Flight updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const removeFlight = async (req, res) => {
  try {
    await deleteFlight(req.params.f_code);
    res.json({ message: "Flight deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
