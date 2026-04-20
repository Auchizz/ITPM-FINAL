const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Event title is required'],
            trim: true,
        },
        description: {
            type: String,
            required: [true, 'Description is required'],
        },
        venue: {
            type: String,
            required: [true, 'Venue is required'],
        },
        date: {
            type: Date,
            required: [true, 'Event date is required'],
        },
        registrationDeadline: {
            type: Date,
            required: [true, 'Registration deadline is required'],
        },
        status: {
            type: String,
            enum: ['Upcoming', 'Open', 'Closed', 'Ongoing', 'Completed', 'Cancelled'],
            default: 'Upcoming',
        },
        capacity: {
            type: Number,
            required: [true, 'Capacity is required'],
            min: 1,
        },
        registeredCount: {
            type: Number,
            default: 0,
        },
        foodAndBeverage: {
            available: { type: Boolean, default: false },
            details: { type: String, default: '' },
        },
        image: {
            type: String, // Store the image file path/URL
            default: null,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Event', eventSchema);
