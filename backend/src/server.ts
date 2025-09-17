import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { PrismaClient } from "@prisma/client";
import authRoutes from "./routes/auth";

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.port || 3001;

// middleware
app.use(helmet());
app.use(cors());
app.use(morgan("combined"));
app.use(express.json());

// routes
app.use("/api/auth", authRoutes);

// health check
app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
