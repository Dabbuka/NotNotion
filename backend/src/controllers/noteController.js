import mongoose from "mongoose";
import Note from "../models/note.js";

// POST
export const createNote = async (req, res) => {
  try {
    const { title, content, userID, folderID } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Please include a title" });
    }

    if (!userID) {
      return res.status(400).json({ message: "userID is required to create a note" });
    }

    const newNote = new Note({
      title: title,
      content: content,
      userID: userID,
      folderID: folderID || null,
    });

    const savedNote = await newNote.save();
    res.status(201).json(savedNote);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

export const getAllNotes = async (req, res) => {
  try {
    const { userID } = req.query;
    if (!userID) {
      return res.status(400).json({ message: "userID is required" });
    }
    const notes = await Note.find({ userID }).sort({ updatedAt: -1 });
    res.status(200).json(notes);
  } catch (err) {
    console.error("Error fetching notes:", err.message);
    res.status(500).send("Server error");
  }
};

// GET (single note by id)
export const getNotes = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);  // find note by id, from /:id

    if (!note) {
      return res.status(404).json({ error: "Note not found" });
    }

    res.json(note);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// GET (note by userID and optionally title; defaults to most recent if only userID provided)
export const getUserNotes = async (req, res) => {
  try {
    const { userId, title } = req.params;

    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }

    let query = { userID: new mongoose.Types.ObjectId(userId) };
    
    // If title is provided, search by both userID and title
    if (title) {
      query.title = title;
      const note = await Note.findOne(query);
      
      if (!note) {
        return res.status(404).json({ error: "Note not found" });
      }
      
      return res.json(note);
    }
    
    // If only userID is provided, return the most recent note
    const note = await Note.findOne(query).sort({ updatedAt: -1 });

    if (!note) {
      return res.status(404).json({ error: "No notes found for this user" });
    }

    return res.json(note);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};


// PATCH (update note by id)
export const updateNote = async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;

  // Build an updates object only with fields that were actually sent
  const updates = {};
  if (title !== undefined) updates.title = title;
  if (content !== undefined) updates.content = content;

  if (Object.keys(updates).length === 0) {
    return res.status(400).json({ error: "No fields provided to update" });
  }

  try {
    const updatedNote = await Note.findByIdAndUpdate(id, updates, { new: true });

    if (!updatedNote) {
      return res.status(404).json({ error: "Note not found" });
    }

    return res.status(200).json(updatedNote);
  } catch (err) {
    console.error("Error updating note:", err.message);
    return res.status(500).json({ error: "Server error" });
  }
};
