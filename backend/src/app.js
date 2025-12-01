import express from "express";
import cors from "cors";
// import noteRoutes from "./routes/noteRoutes.js";
// import folderRoutes from "./routes/folderRoutes.js";

const app = express();



// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.send('hello world')
})
app.use("/api/notes", noteRoutes);
app.use("/api/folders", folderRoutes);


export default app;
