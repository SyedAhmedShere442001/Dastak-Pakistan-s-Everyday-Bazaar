import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    tagline: { type: String, default: '' },
    icon: { type: String, default: 'basket' },
    order: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export default mongoose.model('Category', categorySchema);
