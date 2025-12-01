import Note from "../models/note.js";

// POST
export const createNote = async (req, res) => {
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

// GET
export const getNotes = async (req, res) => {
  try {
    const notes = await Note.findById(req.params.id);  // find note by id, from /:id
    res.json(notes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};
