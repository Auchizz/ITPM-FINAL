const mongoose = require('mongoose');

const GallerySchema = new mongoose.Schema({
  title:      { type: String, required: true, trim: true },
  subtitle:   { type: String, trim: true, default: '' },
  emoji:      { type: String, default: '🖼️' },
  bgClass:    { type: String, default: 'from-slate-700 to-slate-500' },
  imageUrl:   { type: String, trim: true, default: '' },
  tag:        { type: String, trim: true, default: 'Campus Life' },
  isFeatured: { type: Boolean, default: false },
  isActive:   { type: Boolean, default: false }, // false = pending review
  order:      { type: Number, default: 0 },
  submittedBy: { type: String, trim: true, default: '' },
}, { timestamps: true });

GallerySchema.index({ isActive: 1, isFeatured: -1, order: 1 });

module.exports = mongoose.model('Gallery', GallerySchema);