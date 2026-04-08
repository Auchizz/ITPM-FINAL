// models/index.js — All Mongoose models
const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

// ── User ──────────────────────────────────────────────
const UserSchema = new mongoose.Schema({
  studentId:  { type:String, required:true, unique:true, trim:true, uppercase:true,
                match:[/^[A-Z0-9]{6,12}$/,'Student ID must be 6–12 alphanumeric characters'] },
  firstName:  { type:String, required:true, trim:true, minlength:2 },
  lastName:   { type:String, required:true, trim:true, minlength:2 },
  email:      { type:String, required:true, unique:true, lowercase:true, trim:true,
                match:[/^[^\s@]+@[^\s@]+\.[^\s@]+$/,'Please enter a valid email'] },
  password:   { type:String, required:true, minlength:8, select:false },
  phone:      { type:String, match:[/^[0-9]{10}$/,'Phone must be 10 digits'] },
  department: { type:String, enum:['Faculty of Engineering','Faculty of Science','Faculty of Arts','Faculty of Business','Faculty of Medicine','Other'] },
  role:       { type:String, enum:['student','admin','staff'], default:'student' },
  isActive:   { type:Boolean, default:true },
  lastLogin:  { type:Date }
}, { timestamps:true });
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10); next();
});
UserSchema.methods.matchPassword = function(p) { return bcrypt.compare(p, this.password); };
const User = mongoose.model('User', UserSchema);

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
  title:      { type:String, required:true, trim:true },
  subtitle:   { type:String, trim:true },
  emoji:      { type:String, default:'🏛️' },
  bgClass:    { type:String, default:'gi-1' },
  category:   { type:String, enum:['Campus','Events','Sports','Academic','Facilities'], default:'Campus' },
  isFeatured: { type:Boolean, default:false },
  isActive:   { type:Boolean, default:true },
  order:      { type:Number,  default:0 }
}, { timestamps:true });
const Gallery = mongoose.model('Gallery', GallerySchema);

// ── Feedback ──────────────────────────────────────────
const FeedbackSchema = new mongoose.Schema({
  fullName:   { type:String, required:true, trim:true, minlength:2 },
  email:      { type:String, required:true, lowercase:true, trim:true,
                match:[/^[^\s@]+@[^\s@]+\.[^\s@]+$/,'Please enter a valid email'] },
  department: { type:String, required:true },
  category:   { type:String, enum:['General Inquiry','Academic Issue','Facilities','Financial','Technical Support','Complaint','Suggestion'], default:'General Inquiry' },
  message:    { type:String, required:true, trim:true, minlength:20, maxlength:500 },
  status:     { type:String, enum:['pending','in-review','resolved'], default:'pending' },
  response:   { type:String },
  respondedAt:{ type:Date }
}, { timestamps:true });
const Feedback = mongoose.model('Feedback', FeedbackSchema);

// ── Registration ──────────────────────────────────────
const RegSchema = new mongoose.Schema({
  firstName:          { type:String, required:true, trim:true, minlength:2 },
  lastName:           { type:String, required:true, trim:true, minlength:2 },
  studentId:          { type:String, required:true, trim:true, uppercase:true,
                        match:[/^[A-Z0-9]{6,12}$/,'Invalid Student ID format'] },
  phone:              { type:String, required:true, match:[/^[0-9]{10}$/,'Must be 10 digits'] },
  event:              { type:String, required:true },
  dietaryRequirements:{ type:String, enum:['None','Vegetarian','Vegan','Halal','Gluten-free'], default:'None' },
  specialNotes:       { type:String, trim:true, maxlength:200 },
  confirmationNo:     { type:String, unique:true },
  status:             { type:String, enum:['confirmed','cancelled','attended'], default:'confirmed' }
}, { timestamps:true });
RegSchema.pre('save', function(next) {
  if (!this.confirmationNo)
    this.confirmationNo = 'REG-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).substr(2,4).toUpperCase();
  next();
});
const Registration = mongoose.model('Registration', RegSchema);

module.exports = { User, Announcement, News, Event, Gallery, Feedback, Registration };