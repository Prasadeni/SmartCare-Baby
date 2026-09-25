import mongoose from 'mongoose';

const schema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    contentType: {
      type: String,
      enum: ['Article', 'Video', 'Infographic', 'Guide'],
      default: 'Article',
    },
    body: { type: String, required: true },
    category: { type: String, required: true, index: true },
    author: { type: String, default: null },
    imageUrl: { type: String, default: null },
    videoUrl: { type: String, default: null },
    isActive: { type: Boolean, default: true },
    publishedDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

schema.index({ category: 1, isActive: 1 });

export default mongoose.model('EducationArticle', schema);