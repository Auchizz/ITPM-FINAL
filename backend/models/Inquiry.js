const mongoose = require('mongoose');

const InquirySchema = new mongoose.Schema(
  {
    recipientName: { type: String, required: true, trim: true },
    recipientRole: { type: String, required: true, trim: true },
    sportOrClubName: { type: String, required: true, trim: true },
    entityType: { type: String, enum: ['team', 'club'], default: 'team' },
    fullName: { type: String, required: true, trim: true },
    studentId: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Inquiry', InquirySchema);
