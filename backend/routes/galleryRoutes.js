const express  = require('express')
const router   = express.Router()
const multer   = require('multer')
const path     = require('path')
const fs       = require('fs')
const { Gallery } = require('../models')

// ── Upload directory ──────────────────────────────────────────────────────
const uploadDir = path.join(__dirname, '..', 'uploads', 'gallery')
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true })

// ── Multer config ─────────────────────────────────────────────────────────
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename:    (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e6)
    cb(null, unique + path.extname(file.originalname))
  },
})

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB max
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|webp/
    const ok = allowed.test(path.extname(file.originalname).toLowerCase())
              && allowed.test(file.mimetype)
    if (ok) cb(null, true)
    else cb(new Error('Only image files are allowed (jpg, png, gif, webp)'))
  },
})

// ── GET /api/gallery ──────────────────────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const data = await Gallery.find({ isActive: true })
      .sort({ isFeatured: -1, order: 1, createdAt: -1 })
    res.json({ success: true, count: data.length, data })
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching gallery.' })
  }
})

// ── POST /api/gallery ─────────────────────────────────────────────────────
router.post('/', upload.single('photo'), async (req, res) => {
  try {
    const { title, subtitle, tag, submittedBy } = req.body

    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload a photo.' })
    }
    if (!title || !title.trim()) {
      return res.status(400).json({ success: false, message: 'Title is required.' })
    }

    // Build a URL the frontend can use to display the image
    const imageUrl = `${req.protocol}://${req.get('host')}/uploads/gallery/${req.file.filename}`

    const item = await Gallery.create({
      title:       title.trim(),
      subtitle:    subtitle    ? subtitle.trim()    : '',
      tag:         tag         ? tag.trim()         : 'Campus Life',
      imageUrl,
      submittedBy: submittedBy ? submittedBy.trim() : '',
      isFeatured:  false,
      isActive:    false, // pending admin approval
      order:       0,
    })

    res.status(201).json({
      success: true,
      message: 'Photo submitted! It will appear in the gallery once approved by an admin.',
      data: item,
    })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message || 'Error submitting photo.' })
  }
})

module.exports = router