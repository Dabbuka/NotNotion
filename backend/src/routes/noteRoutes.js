import express from "express"
import { createNote, getNotes, getAllNotes, updateNote } from "../controllers/noteController.js";

const router = express.Router();

router.post("/createNote", createNote);
router.get("/:id", getNotes);
router.patch("/:id", updateNote);
router.get("/all", getAllNotes);

export default router;
