import express from "express";
import {
  getReservationByPNR,
  cancelReservation,
} from "../controllers/cancellationController.js";

const router = express.Router();

router.get("/:pnr", getReservationByPNR);
router.delete("/:pnr", cancelReservation);

export default router;
