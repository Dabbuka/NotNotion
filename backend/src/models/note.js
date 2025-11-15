const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const NoteSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        default: ""
    }
    //Todo: Add folderID and userID here later when those additions become relevant
}, {
    timestamps: true
});

module.exports = mongoose.model('Note', NoteSchema);