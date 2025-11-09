//Imports
const express = require('express');
const cors = require('cors');
const connectDB = require('./db');
const note = require('./note');

//Establish access to database
connectDB();

//Middleware
const app = express();
app.use(cors());
app.use(express.json());

/**
 * @route POST /note
 * @desc Create a new note
 */

app.post('/api/notes', async (req, res) => {
    try {
        const {title, content} = req.body;

        if (!title) {
            return res.status(400).json ({message: 'Please include a title'});
        }

        const newNote = new note({
            title: title,
            content: content
        });

        const savedNote = await newNote.save();
        res.status(201).json ({savedNote});
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});



/**
 * @route GET /note
 * @desc Request for notes
 */

app.get('/api/notes', async (req, res) => {
    try {
        const notes = await note.find().sort({updatedAt: -1});
        res.json(notes);
    } catch (err) {
        console.err(err.message);
        res.status(500).send('Server error');
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend server initialized and running on port ${PORT}`));