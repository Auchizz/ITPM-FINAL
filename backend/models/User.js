const mongoose = require('mongoose');
<<<<<<< HEAD
const bcrypt   = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name:      { type: String, required: true },
  email:     { type: String, required: true, unique: true },
  password:  { type: String, required: true, select: false },
  role:      { type: String, enum: ['student', 'admin'], default: 'student' },
  studentId: { type: String, unique: true, sparse: true },
  faculty:   { type: String },
  isActive:  { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

=======

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'admin'], default: 'student' },
  studentId: { type: String },
  faculty: { type: String },
  createdAt: { type: Date, default: Date.now },
});

// Hide password when converting to JSON
>>>>>>> origin/main
UserSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

<<<<<<< HEAD
module.exports = mongoose.model('User', UserSchema);
=======
module.exports = mongoose.model('User', UserSchema);
>>>>>>> origin/main
