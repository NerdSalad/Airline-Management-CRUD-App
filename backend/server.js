import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/authRoutes.js";
import passengerRoutes from "./routes/passengerRoutes.js";
import flightRoutes from "./routes/flightRoutes.js";
import reservationRoutes from "./routes/reservationRoutes.js";
import cancellationRoutes from "./routes/cancellationRoutes.js";
import boardingRoutes from "./routes/boardingRoutes.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/passengers", passengerRoutes);
app.use("/api/flights", flightRoutes);
app.use("/api/reservations", reservationRoutes);
app.use("/api/cancellations", cancellationRoutes);
app.use("/api/boarding-pass", boardingRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));