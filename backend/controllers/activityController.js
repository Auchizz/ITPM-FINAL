const Sport = require('../models/Sport');
const Club = require('../models/Club');
const Participation = require('../models/Participation');
const Feedback = require('../models/Feedback');
const Notification = require('../models/Notification');

const handleServerError = (res, err) => {
  if (err.name === 'ValidationError') {
    return res.status(400).json({ success: false, message: err.message });
  }

  return res.status(500).json({ success: false, message: 'Server error', error: err.message });
};

const createNotification = async ({
  user,
  type = 'system',
  title,
  message,
  actionUrl
}) => Notification.create({ user, type, title, message, actionUrl });

exports.getCatalog = async (req, res) => {
  try {
    const [sports, clubs] = await Promise.all([
      Sport.find().sort({ name: 1 }).select('name team icon'),
      Club.find().sort({ name: 1 }).select('name icon description')
    ]);

    res.json({
      success: true,
      message: 'Activity catalog fetched',
      data: {
        sports,
        clubs
      }
    });
  } catch (err) {
    handleServerError(res, err);
  }
};

exports.getOverview = async (req, res) => {
  try {
    const participationFilter = req.user.role === 'admin' ? {} : { createdBy: req.user._id };
    const feedbackFilter = req.user.role === 'admin' ? {} : { createdBy: req.user._id };
    const notificationFilter = { user: req.user._id };

    const [participations, feedback, unreadNotifications] = await Promise.all([
      Participation.countDocuments(participationFilter),
      Feedback.countDocuments(feedbackFilter),
      Notification.countDocuments({ ...notificationFilter, read: false })
    ]);

    res.json({
      success: true,
      message: 'Activity overview fetched',
      data: {
        participations,
        feedback,
        unreadNotifications
      }
    });
  } catch (err) {
    handleServerError(res, err);
  }
};

exports.createParticipation = async (req, res) => {
  try {
    const participation = await Participation.create({
      ...req.body,
      createdBy: req.user._id
    });

    await createNotification({
      user: req.user._id,
      type: 'participation',
      title: 'Participation request submitted',
      message: `Your request for ${participation.targetName} is pending review.`,
      actionUrl: '/participation'
    });

    res.status(201).json({
      success: true,
      message: 'Participation request submitted',
      data: participation
    });
  } catch (err) {
    handleServerError(res, err);
  }
};

exports.listParticipations = async (req, res) => {
  try {
    const filter = req.user.role === 'admin' ? {} : { createdBy: req.user._id };
    const participations = await Participation.find(filter)
      .sort({ createdAt: -1 })
      .populate('createdBy', 'name email role studentId faculty')
      .populate('reviewedBy', 'name email role');

    res.json({
      success: true,
      message: 'Participation records fetched',
      data: participations
    });
  } catch (err) {
    handleServerError(res, err);
  }
};

exports.updateParticipationStatus = async (req, res) => {
  try {
    const { status, adminNotes = '' } = req.body;
    const participation = await Participation.findByIdAndUpdate(
      req.params.id,
      {
        status,
        adminNotes: adminNotes.trim(),
        reviewedBy: req.user._id,
        reviewedAt: new Date()
      },
      {
        returnDocument: 'after',
        runValidators: true
      }
    );

    if (!participation) {
      return res.status(404).json({ success: false, message: 'Participation request not found' });
    }

    await createNotification({
      user: participation.createdBy,
      type: 'participation',
      title: `Participation ${status}`,
      message: adminNotes.trim()
        ? adminNotes.trim()
        : `Your request for ${participation.targetName} was marked as ${status}.`,
      actionUrl: '/participation'
    });

    res.json({
      success: true,
      message: 'Participation request updated',
      data: participation
    });
  } catch (err) {
    handleServerError(res, err);
  }
};

exports.createFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.create({
      ...req.body,
      createdBy: req.user._id
    });

    await createNotification({
      user: req.user._id,
      type: 'feedback',
      title: 'Feedback submitted',
      message: `Your feedback for ${feedback.targetName} has been saved.`,
      actionUrl: '/feedback'
    });

    res.status(201).json({
      success: true,
      message: 'Feedback submitted',
      data: feedback
    });
  } catch (err) {
    handleServerError(res, err);
  }
};

exports.listFeedback = async (req, res) => {
  try {
    const filter = req.user.role === 'admin' ? {} : { createdBy: req.user._id };
    const feedback = await Feedback.find(filter)
      .sort({ createdAt: -1 })
      .populate('createdBy', 'name email role')
      .populate('participation');

    res.json({
      success: true,
      message: 'Feedback fetched',
      data: feedback
    });
  } catch (err) {
    handleServerError(res, err);
  }
};

exports.listNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({
      success: true,
      message: 'Notifications fetched',
      data: notifications
    });
  } catch (err) {
    handleServerError(res, err);
  }
};

exports.markNotificationRead = async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { read: true },
      { returnDocument: 'after' }
    );

    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }

    res.json({
      success: true,
      message: 'Notification marked as read',
      data: notification
    });
  } catch (err) {
    handleServerError(res, err);
  }
};

exports.markAllNotificationsRead = async (req, res) => {
  try {
    await Notification.updateMany({ user: req.user._id, read: false }, { read: true });

    res.json({
      success: true,
      message: 'All notifications marked as read'
    });
  } catch (err) {
    handleServerError(res, err);
  }
};
