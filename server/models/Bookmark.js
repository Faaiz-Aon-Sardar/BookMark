import mongoose from 'mongoose';

const bookmarkSchema = new mongoose.Schema({
  name: { type: String, required: true },
  url: { type: String, required: true },
  collections: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Collection' }],
  tags: [{ type: String }],
  lastUsed: { type: Number },
  favicon: { type: String },
  isFavorite: { type: Boolean, default: false },
  customIconBg: { type: String },
}, {
  timestamps: true, // creates createdAt and updatedAt
  toJSON: {
    virtuals: true,
    transform: function (doc, ret) {
      delete ret._id;
      delete ret.__v;
    }
  }
});

// Since the old TS model uses createdAt as a number timestamp:
bookmarkSchema.virtual('createdAtTs').get(function() {
  return this.createdAt ? this.createdAt.getTime() : Date.now();
});

const Bookmark = mongoose.model('Bookmark', bookmarkSchema);

export default Bookmark;
