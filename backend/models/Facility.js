const mongoose = require('mongoose');

const FacilitySlotSchema = new mongoose.Schema(
  {
    time: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ['Open', 'Limited', 'Booked'],
      default: 'Open'
    }
  },
  {
    _id: false
  }
);

const FacilitySchema = new mongoose.Schema(
  {
    facility: { type: String, required: true, trim: true, unique: true },
    description: { type: String, trim: true, default: '' },
    slots: {
      type: [FacilitySlotSchema],
      default: []
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Facility', FacilitySchema);
