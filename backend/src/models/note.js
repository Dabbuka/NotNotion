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
        required: true
    },
    userID: {
        type: Schema.Types.ObjectId,
        ref: 'Folder',
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Note', NoteSchema);