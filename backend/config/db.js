const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/smartCare_baby');
    
    // HARDCODED to skip .env errors
    const conn = await mongoose.connect('mongodb://127.0.0.1:27017/smartCare_baby');

    console.log(`[SmartCare Baby] MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`[SmartCare Baby] MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;