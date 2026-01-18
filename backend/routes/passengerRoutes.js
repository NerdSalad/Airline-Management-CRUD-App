import express from "express";
import { getPassengers, createPassenger, editPassenger, removePassenger } 
  from "../controllers/passengerController.js";


const router = express.Router();

router.get("/", getPassengers);
router.post("/", createPassenger);
router.put("/:aadhar", editPassenger);
router.delete("/:aadhar", removePassenger);

export default router;
