const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FolderSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    ownerID: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Folder', FolderSchema);