const mongoose = require('mongoose');
const ContactSchema = require('./contactSchema');

const ClubSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, unique: true },
    icon: { type: String, trim: true, default: '' },
    description: { type: String, trim: true, default: '' },
    president: { type: ContactSchema, required: true },
    secretary: { type: ContactSchema, required: true }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Club', ClubSchema);
