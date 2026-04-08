const mongoose = require('mongoose');

const ParticipationSchema = new mongoose.Schema(
  {
    targetName: { type: String, required: true, trim: true },
    targetType: { type: String, enum: ['sport', 'club'], required: true },
    preferredRole: { type: String, trim: true, default: 'Member' },
    message: { type: String, trim: true, default: '' },
    fullName: { type: String, required: true, trim: true },
    studentId: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ['pending', 'approved', 'declined', 'completed'],
      default: 'pending'
    },
    adminNotes: { type: String, trim: true, default: '' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    reviewedAt: { type: Date, default: null }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Participation', ParticipationSchema);
