import mongoose from 'mongoose';

const collectionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  color: { type: String, required: true },
  icon: { type: String, required: true },
  description: { type: String },
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: function (doc, ret) {
      delete ret._id;
      delete ret.__v;
    }
  }
});

collectionSchema.virtual('createdAtTs').get(function() {
  return this.createdAt ? this.createdAt.getTime() : Date.now();
});

const Collection = mongoose.model('Collection', collectionSchema);

export default Collection;
