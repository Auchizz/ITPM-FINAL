const mongoose = require('mongoose');

const FeedbackSchema = new mongoose.Schema(
  {
    participation: { type: mongoose.Schema.Types.ObjectId, ref: 'Participation', default: null },
    targetName: { type: String, required: true, trim: true },
    targetType: { type: String, enum: ['sport', 'club'], required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    title: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['new', 'reviewed'], default: 'new' }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Feedback', FeedbackSchema);
