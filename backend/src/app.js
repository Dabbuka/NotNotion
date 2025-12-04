import express from "express";
import cors from "cors";
import { createFolder, getFolder, renameFolder, addFolder } from "./controllers/folderController.js";
import noteRoutes from "./routes/noteRoutes.js";
import folderRoutes from "./routes/folderRoutes.js";
import userRoutes from "./routes/userRoutes.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.send('hello')
});
app.use("/api/notes", noteRoutes);
app.use("/api/folders", folderRoutes);
app.use("/api/users", userRoutes);

//TODO: rename the routes to be more appropriate once connected to frontend and backend
app.post("/createFolder", createFolder);
app.get("/renameFolder", renameFolder);
app.get("/:id", getFolder);
app.patch("/renameFolder", addFolder);

export default app;
