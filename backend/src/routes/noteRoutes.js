import express from "express"
import { createNote, getNotes, getUserNotes, getAllNotes, updateNote, } from "../controllers/noteController.js";

const router = express.Router();

router.post("/createNote", createNote);
router.get("/all", getAllNotes);
router.get("/user/:userId", getUserNotes);
router.get("/user/:userId/:title", getUserNotes);
router.get("/:id", getNotes);
router.patch("/:id", updateNote);


export default router;
