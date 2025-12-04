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
  },
  notes: [{
    type: Schema.Types.ObjectId,
    ref: 'Notes',
  }],
}, {
  timestamps: true
});

export default mongoose.model('Folder', FolderSchema);
