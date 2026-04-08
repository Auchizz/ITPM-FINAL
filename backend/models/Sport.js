const mongoose = require('mongoose');
const ContactSchema = require('./contactSchema');

const SportSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, unique: true },
    icon: { type: String, trim: true, default: '' },
    team: { type: String, required: true, trim: true },
    description: { type: String, trim: true, default: '' },
    captain: { type: ContactSchema, required: true },
    viceCaptain: { type: ContactSchema, required: true }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Sport', SportSchema);
