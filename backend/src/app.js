import express from "express";
import cors from "cors";
import noteRoutes from "./routes/noteRoutes.js";
import folderRoutes from "./routes/folderRoutes.js";
import userRoutes from "./routes/userRoutes.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/notes", noteRoutes);
app.use("/api/folders", folderRoutes);
app.use("/api/users", userRoutes);

export default app;
