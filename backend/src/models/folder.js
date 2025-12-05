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
  parentFolderID: {
    type: Schema.Types.ObjectId,
    ref: 'Folder',
    default: null
  },
  items: [{
    item: {
      type: Schema.Types.ObjectId,
      required: true,
      refPath: 'items.itemType'
    },
    itemType: {
      type: String,
      required: true,
      enum: ['Note', 'Folder']
    }
  }],
}, {
  timestamps: true
});

export default mongoose.model('Folder', FolderSchema);
