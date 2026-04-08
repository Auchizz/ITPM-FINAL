const mongoose = require('mongoose');

const MatchSchema = new mongoose.Schema(
  {
    sport: { type: String, required: true, trim: true },
    homeTeam: { type: String, required: true, trim: true },
    awayTeam: { type: String, required: true, trim: true },
    score: { type: String, trim: true, default: '' },
    status: {
      type: String,
      enum: ['live', 'upcoming', 'result'],
      default: 'upcoming'
    },
    liveNote: { type: String, trim: true, default: '' },
    date: { type: String, required: true, trim: true },
    time: { type: String, required: true, trim: true },
    venue: { type: String, required: true, trim: true }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Match', MatchSchema);
