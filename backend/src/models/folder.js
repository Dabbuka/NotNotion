const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FolderSchema = new Schema({
    title: {
        type: String,
        required: true
    }
}, {
    timestamps: true
    //Todo: Add userID here later.
});

module.exports = mongoose.model('Folder', FolderSchema);