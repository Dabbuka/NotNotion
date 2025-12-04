import express from "express"
import { createNote, getNotes } from "../controllers/noteController.js";

const router = express.Router();

// POST/GET methods from /api/notes
// '/' is used instead of '/api/notes' is because prefix is handled in app.js
router.post("/createNote", createNote);
router.get("/:id", getNotes);
// router.post("/:id, updateNote") -- TODO

export default router;
