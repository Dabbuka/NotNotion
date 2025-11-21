const Note = require("../models/note");

/**
 * @route POST /note
 * @desc Create a new note
 */
exports.createNote = async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Please include a title" });
    }

    const newNote = new Note({
      title: title,
      content: content,
    });

    const savedNote = await newNote.save();
    res.status(201).json(savedNote);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

/**
 * @route GET /note
 * @desc Request for notes
 */
exports.getNotes = async (req, res) => {
  try {
    const notes = await Note.findById(req.params.id);  // find note by id, from /:id
    res.json(notes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};
