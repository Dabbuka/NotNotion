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
    },
    ownerID: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        //required: true <-- Add this back later, it is being commented out right now so we can work on user authentication
    },
    folderID: {
        type: Schema.Types.ObjectId,
        ref: 'Folder',
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Note', NoteSchema);