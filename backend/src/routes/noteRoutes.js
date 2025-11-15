const express = require("express");
const { createNote, getNotes } = require("../controllers/noteController");

const router = express.Router();

// run the createNote controller for POST methods from /api/notes
// '/' instead of '/api/notes' is because prefix is handled in app.js
router.post("/", createNote);

// run the getNotes controller for GET methods from /api/notes
router.get("/", getNotes);

module.exports = router;