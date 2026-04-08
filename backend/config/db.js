const mongoose = require('mongoose');

// Simple DB connection helper
const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI || 'mongodb+srv://db:1234@cluster0.pzrgyrr.mongodb.net/auchithya?retryWrites=true&w=majority';
    // Modern Mongoose versions accept fewer legacy options; call connect with the URI only
    await mongoose.connect(uri);
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
