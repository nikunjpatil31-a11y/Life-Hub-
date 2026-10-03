const mongoose = require('mongoose');

let isMongoConnected = false;

const connectDB = async () => {
  const connString = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/lifehub';
  try {
    // Attempt Mongoose connection with 3 sec timeout
    await mongoose.connect(connString, {
      serverSelectionTimeoutMS: 3000
    });
    isMongoConnected = true;
    console.log(`[LifeHub DB] Successfully connected to MongoDB at ${connString}`);
  } catch (error) {
    isMongoConnected = false;
    console.warn(`[LifeHub DB Notice] MongoDB unavailable (${error.message}). Switching to Fallback/Mock Storage.`);
  }
};

const getDBState = () => ({
  isMongoConnected,
  mode: isMongoConnected ? 'MongoDB' : 'Mock In-Memory Storage'
});

module.exports = { connectDB, getDBState, getIsMongoConnected: () => isMongoConnected };
