const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

// ── Announcement ─────────────────────────────────────
const AnnSchema = new mongoose.Schema({
  title:       { type:String, required:true, trim:true, maxlength:200 },
  description: { type:String, required:true, trim:true, maxlength:1000 },
  priority:    { type:String, enum:['urgent','info','success','warning'], default:'info' },
  badge:       { type:String, enum:['Urgent','New','Reminder','Info'],   default:'Info' },
  department:  { type:String, required:true, trim:true },
  isActive:    { type:Boolean, default:true },
  isPinned:    { type:Boolean, default:false },
  expiresAt:   { type:Date },
  createdBy:   { type:mongoose.Schema.Types.ObjectId, ref:'User' }
}, { timestamps:true });
AnnSchema.index({ isActive:1, createdAt:-1 });
const Announcement = mongoose.model('Announcement', AnnSchema);

// ── News ──────────────────────────────────────────────
const NewsSchema = new mongoose.Schema({
  title:       { type:String, required:true, trim:true, maxlength:300 },
  content:     { type:String, trim:true },
  summary:     { type:String, trim:true, maxlength:500 },
  category:    { type:String, enum:['Academic','Research','Sports','Event','Administrative'], default:'Academic' },
  imageEmoji:  { type:String, default:'📰' },
  author:      { type:String, default:'University Communications' },
  isPublished: { type:Boolean, default:true },
  views:       { type:Number, default:0 },
  createdBy:   { type:mongoose.Schema.Types.ObjectId, ref:'User' }
}, { timestamps:true });
NewsSchema.index({ isPublished:1, createdAt:-1 });
const News = mongoose.model('News', NewsSchema);

// ── Event ─────────────────────────────────────────────
const EventSchema = new mongoose.Schema({
  title:       { type:String, required:true, trim:true, maxlength:200 },
  description: { type:String, trim:true },
  eventDate:   { type:Date,   required:true },
  startTime:   { type:String, required:true },
  endTime:     { type:String },
  venue:       { type:String, required:true, trim:true },
  capacity:    { type:Number, default:0 },
  registered:  { type:Number, default:0 },
  theme:       { type:String, enum:['navy','green','blue'], default:'navy' },
  isFeatured:  { type:Boolean, default:false },
  isActive:    { type:Boolean, default:true },
  audience:    { type:String, default:'Open to all students & staff' },
  createdBy:   { type:mongoose.Schema.Types.ObjectId, ref:'User' }
}, { timestamps:true });
EventSchema.index({ eventDate:1, isActive:1 });
const Event = mongoose.model('Event', EventSchema);

// ── Gallery ───────────────────────────────────────────
const GallerySchema = new mongoose.Schema({
  title:       { type: String, required: true, trim: true },
  subtitle:    { type: String, trim: true, default: '' },
  emoji:       { type: String, default: '🖼️' },
  bgClass:     { type: String, default: 'from-slate-700 to-slate-500' },
  imageUrl:    { type: String, trim: true, default: '' },
  tag:         { type: String, trim: true, default: 'Campus Life' },
  isFeatured:  { type: Boolean, default: false },
  isActive:    { type: Boolean, default: false },
  order:       { type: Number, default: 0 },
  submittedBy: { type: String, trim: true, default: '' },
}, { timestamps: true });
GallerySchema.index({ isActive: 1, isFeatured: -1, order: 1 });
const Gallery = mongoose.model('Gallery', GallerySchema);

// ── Registration ──────────────────────────────────────
const RegSchema = new mongoose.Schema({
  firstName:           { type:String, required:true, trim:true, minlength:2 },
  lastName:            { type:String, required:true, trim:true, minlength:2 },
  studentId:           { type:String, required:true, trim:true, uppercase:true,
                         match:[/^[A-Z0-9]{6,12}$/,'Invalid Student ID format'] },
  phone:               { type:String, required:true, match:[/^[0-9]{10}$/,'Must be 10 digits'] },
  event:               { type:String, required:true },
  dietaryRequirements: { type:String, enum:['None','Vegetarian','Vegan','Halal','Gluten-free'], default:'None' },
  specialNotes:        { type:String, trim:true, maxlength:200 },
  confirmationNo:      { type:String, unique:true },
  status:              { type:String, enum:['confirmed','cancelled','attended'], default:'confirmed' }
}, { timestamps:true });
RegSchema.pre('save', function(next) {
  if (!this.confirmationNo)
    this.confirmationNo = 'REG-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).substr(2,4).toUpperCase();
  next();
});
const Registration = mongoose.model('Registration', RegSchema);

// ── Import separately defined models ─────────────────
const User = require('./User');

module.exports = { User, Announcement, News, Event, Gallery, Registration };