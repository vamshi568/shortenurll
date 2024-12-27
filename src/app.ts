import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import urlRoutes from "./routes/url";
import cors from "cors";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000; // Default port or you can define your own in .env file

app.use(express.json());
app.use(cors());
// MongoDB connection
mongoose
.connect(process.env.MONGO_URI || "")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes
app.use("/", urlRoutes);

export default app;
