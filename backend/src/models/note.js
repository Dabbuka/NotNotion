import mongoose from 'mongoose';
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
  userID: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  folderID: {
    type: Schema.Types.ObjectId,
    ref: 'Folder',
  }
}, {
  timestamps: true
});

export default mongoose.model('Note', NoteSchema);
