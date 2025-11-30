import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const FolderSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    userID: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

export default mongoose.model('Folder', FolderSchema);
