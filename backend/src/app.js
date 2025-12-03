import express from "express";
import cors from "cors";
import { createFolder, getFolder, renameFolder, addFolder } from "./controllers/folderController.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.send('hello')
});
//TODO: rename the routes to be more appropriate once connected to frontend and backend
app.post("/createFolder", createFolder);
app.get("/renameFolder", renameFolder);
app.get("/:id", getFolder);
app.patch("/renameFolder", addFolder);

export default app;
