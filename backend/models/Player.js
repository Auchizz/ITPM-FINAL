const mongoose = require('mongoose');

const PlayerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    sport: { type: String, required: true, trim: true },
    role: {
      type: String,
      enum: ['Captain', 'Vice Captain', 'Member'],
      default: 'Member'
    },
    email: { type: String, trim: true, default: '' },
    phone: { type: String, trim: true, default: '' },
    batch: { type: String, trim: true, default: '' }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Player', PlayerSchema);
