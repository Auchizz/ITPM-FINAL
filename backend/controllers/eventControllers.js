const Event = require('../models/Event');

// GET all events
exports.getAllEvents = async (req, res) => {
    try {
        const events = await Event.find().sort({ date: 1 });
        res.json({ success: true, count: events.length, data: events });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// GET single event by ID
exports.getEventById = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event)
            return res.status(404).json({ success: false, message: 'Event not found' });
        res.json({ success: true, data: event });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// POST create new event
exports.createEvent = async (req, res) => {
    try {
        // Parse foodAndBeverage if it's a string (from FormData)
        let eventData = { ...req.body };
        if (typeof eventData.foodAndBeverage === 'string') {
            eventData.foodAndBeverage = JSON.parse(eventData.foodAndBeverage);
        }
        
        // Add image path if file was uploaded
        if (req.file) {
            eventData.image = req.file.path;
        }
        
        const event = new Event(eventData);
        await event.save();
        res.status(201).json({ success: true, data: event });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// PUT update event
exports.updateEvent = async (req, res) => {
    try {
        // Parse foodAndBeverage if it's a string (from FormData)
        let eventData = { ...req.body };
        if (typeof eventData.foodAndBeverage === 'string') {
            eventData.foodAndBeverage = JSON.parse(eventData.foodAndBeverage);
        }

        // Add image path if file was uploaded
        if (req.file) {
            eventData.image = req.file.path;
        }

        const event = await Event.findByIdAndUpdate(req.params.id, eventData, {
            new: true,
            runValidators: true,
        });

        if (!event) {
            return res.status(404).json({ success: false, message: 'Event not found' });
        }

        res.json({ success: true, data: event });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// DELETE event
exports.deleteEvent = async (req, res) => {
    try {
        const event = await Event.findByIdAndDelete(req.params.id);
        if (!event)
            return res.status(404).json({ success: false, message: 'Event not found' });
        res.json({ success: true, message: 'Event deleted successfully' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// PATCH update status only
exports.updateEventStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const validStatuses = ['Upcoming', 'Open', 'Closed', 'Ongoing', 'Completed', 'Cancelled'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ success: false, message: 'Invalid status value' });
        }
        const event = await Event.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );
        if (!event)
            return res.status(404).json({ success: false, message: 'Event not found' });
        res.json({ success: true, data: event });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
