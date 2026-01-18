import express from "express";
import {
  getFlights,
  createFlight,
  editFlight,
  removeFlight,
} from "../controllers/flightController.js";

const router = express.Router();

router.get("/", getFlights);
router.post("/", createFlight);
router.put("/:f_code", editFlight);
router.delete("/:f_code", removeFlight);

export default router;
