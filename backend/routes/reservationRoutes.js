import express from "express";
import {
  getPassengerByAadhar,
  getFlightByRoute,
  bookFlight,
  getReservations,
  getBoardingPassDetails,
} from "../controllers/reservationController.js";

const router = express.Router();

router.get("/passenger/:aadhar", getPassengerByAadhar);
router.get("/flight", getFlightByRoute);
router.post("/book", bookFlight);
router.get("/all", getReservations);
router.get("/boarding-pass/:pnr", getBoardingPassDetails);

export default router;
