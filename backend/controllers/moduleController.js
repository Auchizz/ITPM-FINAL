const Sport = require('../models/Sport');
const Club = require('../models/Club');
const Match = require('../models/Match');
const Player = require('../models/Player');
const Facility = require('../models/Facility');
const Inquiry = require('../models/Inquiry');

const handleServerError = (res, err) => {
  if (err.name === 'ValidationError') {
    return res.status(400).json({ success: false, message: err.message });
  }

  if (err.code === 11000) {
    const duplicateField = Object.keys(err.keyPattern || {})[0] || 'record';
    return res.status(400).json({
      success: false,
      message: `${duplicateField} must be unique`
    });
  }

  return res.status(500).json({ success: false, message: 'Server error', error: err.message });
};

const buildCrudHandlers = ({ Model, label, sort }) => ({
  async list(req, res) {
    try {
      const items = await Model.find().sort(sort);
      res.json({ success: true, message: `${label} fetched`, data: items });
    } catch (err) {
      handleServerError(res, err);
    }
  },

  async create(req, res) {
    try {
      const item = await Model.create(req.body);
      res.status(201).json({ success: true, message: `${label} created`, data: item });
    } catch (err) {
      handleServerError(res, err);
    }
  },

  async update(req, res) {
    try {
      const item = await Model.findByIdAndUpdate(req.params.id, req.body, {
        returnDocument: 'after',
        runValidators: true
      });

      if (!item) {
        return res.status(404).json({ success: false, message: `${label} not found` });
      }

      res.json({ success: true, message: `${label} updated`, data: item });
    } catch (err) {
      handleServerError(res, err);
    }
  },

  async remove(req, res) {
    try {
      const item = await Model.findByIdAndDelete(req.params.id);
      if (!item) {
        return res.status(404).json({ success: false, message: `${label} not found` });
      }

      res.json({ success: true, message: `${label} deleted` });
    } catch (err) {
      handleServerError(res, err);
    }
  }
});

const normalizeContact = (contact = {}) => ({
  name: (contact.name || '').trim(),
  email: (contact.email || '').trim(),
  phone: (contact.phone || '').trim()
});

const buildSportPayload = (body = {}) => {
  const captain = normalizeContact(body.captain);
  const viceCaptain = normalizeContact(body.viceCaptain);

  return {
    name: (body.name || '').trim(),
    icon: (body.icon || '').trim(),
    team: (body.team || '').trim(),
    description: (body.description || '').trim(),
    captain,
    viceCaptain,
    president: normalizeContact(body.president || captain),
    secretary: normalizeContact(body.secretary || viceCaptain)
  };
};

const sportHandlers = buildCrudHandlers({
  Model: Sport,
  label: 'Sport',
  sort: { name: 1 }
});

const clubHandlers = buildCrudHandlers({
  Model: Club,
  label: 'Club',
  sort: { name: 1 }
});

const matchHandlers = buildCrudHandlers({
  Model: Match,
  label: 'Match',
  sort: { updatedAt: -1 }
});

const playerHandlers = buildCrudHandlers({
  Model: Player,
  label: 'Player',
  sort: { name: 1 }
});

const facilityHandlers = buildCrudHandlers({
  Model: Facility,
  label: 'Facility',
  sort: { facility: 1 }
});

exports.getOverview = async (req, res) => {
  try {
    const [sports, clubs, matches, players, facilities, inquiries] = await Promise.all([
      Sport.countDocuments(),
      Club.countDocuments(),
      Match.countDocuments(),
      Player.countDocuments(),
      Facility.countDocuments(),
      Inquiry.countDocuments()
    ]);

    res.json({
      success: true,
      message: 'Module overview fetched',
      data: {
        sports,
        clubs,
        matches,
        players,
        facilities,
        inquiries
      }
    });
  } catch (err) {
    handleServerError(res, err);
  }
};

exports.listSports = sportHandlers.list;
exports.createSport = async (req, res) => {
  try {
    const item = await Sport.create(buildSportPayload(req.body));
    res.status(201).json({ success: true, message: 'Sport created', data: item });
  } catch (err) {
    handleServerError(res, err);
  }
};

exports.updateSport = async (req, res) => {
  try {
    const item = await Sport.findByIdAndUpdate(req.params.id, buildSportPayload(req.body), {
      returnDocument: 'after',
      runValidators: true
    });

    if (!item) {
      return res.status(404).json({ success: false, message: 'Sport not found' });
    }

    res.json({ success: true, message: 'Sport updated', data: item });
  } catch (err) {
    handleServerError(res, err);
  }
};
exports.deleteSport = sportHandlers.remove;

exports.listClubs = clubHandlers.list;
exports.createClub = clubHandlers.create;
exports.updateClub = clubHandlers.update;
exports.deleteClub = clubHandlers.remove;

exports.listMatches = matchHandlers.list;
exports.createMatch = matchHandlers.create;
exports.updateMatch = matchHandlers.update;
exports.deleteMatch = matchHandlers.remove;

exports.listPlayers = playerHandlers.list;
exports.createPlayer = playerHandlers.create;
exports.updatePlayer = playerHandlers.update;
exports.deletePlayer = playerHandlers.remove;

exports.listFacilities = facilityHandlers.list;
exports.createFacility = facilityHandlers.create;
exports.updateFacility = facilityHandlers.update;
exports.deleteFacility = facilityHandlers.remove;

exports.createInquiry = async (req, res) => {
  try {
    const inquiry = await Inquiry.create({
      ...req.body,
      createdBy: req.user._id
    });

    res.status(201).json({
      success: true,
      message: 'Inquiry submitted',
      data: inquiry
    });
  } catch (err) {
    handleServerError(res, err);
  }
};

exports.listInquiries = async (req, res) => {
  try {
    const inquiries = await Inquiry.find().sort({ createdAt: -1 }).populate('createdBy', 'name email role');
    res.json({
      success: true,
      message: 'Inquiries fetched',
      data: inquiries
    });
  } catch (err) {
    handleServerError(res, err);
  }
};
