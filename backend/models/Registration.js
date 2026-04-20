const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema(
    {
        event: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Event',
            required: [true, 'Event is required'],
        },
        studentName: {
            type: String,
            required: [true, 'Student name is required'],
            trim: true,
        },
        studentId: {
            type: String,
            required: [true, 'Student ID is required'],
            trim: true,
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            trim: true,
            lowercase: true,
        },
        faculty: {
            type: String,
            required: [true, 'Faculty is required'],
            trim: true,
        },
        phone: {
            type: String,
            required: [true, 'Phone number is required'],
            trim: true,
        },
        status: {
            type: String,
            enum: ['Confirmed', 'Cancelled'],
            default: 'Confirmed',
        },
    },
    { timestamps: true }
);

registrationSchema.index({ event: 1, studentId: 1 }, { unique: true });

module.exports = mongoose.model('Registration', registrationSchema);
