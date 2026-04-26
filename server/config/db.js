const mongoose = require('mongoose');

const connectDB = async () => {
  const retryInterval = 2000;

  const connectWithRetry = async () => {
    try {
      const conn = await mongoose.connect(process.env.MONGO_URI, {
        serverSelectionTimeoutMS: 5000
      });
      console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
      console.error(`MongoDB Connection Error: ${error.message}`);
      console.log(`Retrying MongoDB connection in ${retryInterval / 1000} seconds...`);
      setTimeout(connectWithRetry, retryInterval);
    }
  };

  connectWithRetry();
};

module.exports = connectDB;
