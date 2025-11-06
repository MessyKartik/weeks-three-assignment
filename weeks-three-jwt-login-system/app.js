import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRouter from "./router/authRoute.js";
import databaseConnect from "./config/databaseConfig.js";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
const app = express();

databaseConnect();

// CORS Configuration - Add this BEFORE other middleware
app.use(
  cors({
    origin: ["http://localhost:3000", "http://127.0.0.1:5500"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(cookieParser());

// Serve static files from public folder
app.use(express.static(path.join(__dirname, "public")));

app.use("/api/auth/", authRouter);

app.use("/", (req, res) => {
  res.status(200).json({ data: "This is Home Page" });
});

export default app;
