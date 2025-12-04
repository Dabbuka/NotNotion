import express from "express"
import { createNote, getNotes, updateNote } from "../controllers/noteController.js";

const router = express.Router();

router.post("/createNote", createNote);
router.get("/:id", getNotes);
router.patch("/:id", updateNote);

export default router;
