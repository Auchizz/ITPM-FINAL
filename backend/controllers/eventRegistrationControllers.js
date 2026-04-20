const Registration = require('../models/Registration');
const Event = require('../models/Event');
const mongoose = require('mongoose');

// POST — Register a student for an event
exports.registerStudent = async (req, res) => {
    try {
        const { eventId, studentName, studentId, email, faculty, phone } = req.body;
        const requestUser = req.user || null;
        const finalEmail = (requestUser?.email || email || '').trim().toLowerCase();
        const finalStudentName = requestUser?.name || studentName;
        // Use logged-in user id as a stable unique student id for registration uniqueness.
        const finalStudentId = String(requestUser?._id || requestUser?.studentId || studentId || '');
        const finalFaculty = requestUser?.faculty || faculty || 'N/A';
        const finalPhone = phone || 'N/A';

        if (!finalEmail || !finalStudentName || !finalStudentId) {
            return res.status(400).json({ success: false, message: 'Missing required student information' });
        }

        const event = await Event.findById(eventId);
        if (!event)
            return res.status(404).json({ success: false, message: 'Event not found' });

        const existing = await Registration.findOne({
            event: eventId,
            studentId: finalStudentId,
            status: 'Confirmed',
        });
        if (existing) {
            return res.status(400).json({
                success: false,
                message: 'You have already registered for this event.',
            });
        }

        const allowedStatuses = ['Open', 'Upcoming'];
        if (!allowedStatuses.includes(event.status)) {
            return res.status(400).json({
                success: false,
                message: `Registration not allowed. Event status is currently "${event.status}".`,
            });
        }

        if (new Date() > new Date(event.registrationDeadline)) {
            return res.status(400).json({
                success: false,
                message: 'Registration deadline has passed.',
            });
        }

        if (event.registeredCount >= event.capacity) {
            return res.status(400).json({
                success: false,
                message: 'Event has reached full capacity.',
            });
        }

        const registration = new Registration({
            event: eventId,
            studentName: finalStudentName,
            studentId: finalStudentId,
            email: finalEmail,
            faculty: finalFaculty,
            phone: finalPhone,
        });
        await registration.save();

        await Event.findByIdAndUpdate(eventId, { $inc: { registeredCount: 1 } });

        res.status(201).json({
            success: true,
            message: 'Registration successful! You have been confirmed for this event.',
            data: registration,
        });
    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'You have already registered for this event.',
            });
        }
        res.status(500).json({ success: false, message: err.message });
    }
};

// GET all confirmed registrations for an event (Admin)
exports.getRegistrationsByEvent = async (req, res) => {
    try {
        const registrations = await Registration.find({
            event: req.params.eventId,
            status: 'Confirmed',
        }).sort({ createdAt: -1 });
        res.json({ success: true, count: registrations.length, data: registrations });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// GET registrations for a specific student (by email)
exports.getMyRegistrations = async (req, res) => {
    try {
        const email = (req.user?.email || req.query.email || '').trim().toLowerCase();
        if (!email) {
            return res.status(400).json({ success: false, message: 'User email not found' });
        }

        const registrations = await Registration.find({
            email,
            status: 'Confirmed',
        })
            .populate('event', 'title date venue status')
            .sort({ createdAt: -1 });

        res.json({ success: true, count: registrations.length, data: registrations });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// GET single registration by ID
exports.getRegistrationById = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ success: false, message: 'Invalid registration ID' });
        }
        const reg = await Registration.findById(req.params.id).populate('event', 'title date venue');
        if (!reg)
            return res.status(404).json({ success: false, message: 'Registration not found' });
        res.json({ success: true, data: reg });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// PATCH cancel a registration (Admin)
exports.cancelRegistration = async (req, res) => {
    try {
        const reg = await Registration.findById(req.params.id);
        if (!reg)
            return res.status(404).json({ success: false, message: 'Registration not found' });
        if (reg.status === 'Cancelled') {
            return res.status(400).json({ success: false, message: 'Registration is already cancelled' });
        }

        reg.status = 'Cancelled';
        await reg.save();

        await Event.findByIdAndUpdate(reg.event, { $inc: { registeredCount: -1 } });

        res.json({ success: true, message: 'Registration cancelled successfully' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
