const mongoose = require('mongoose');

let mongod = null;

const connectDB = async () => {
  try {
    let mongoUri = process.env.MONGO_URI;

    if (mongoUri && mongoUri.trim() !== '') {
      try {
        console.log(`Connecting to configured MongoDB URI...`);
        const conn = await mongoose.connect(mongoUri, {
          serverSelectionTimeoutMS: 3000,
        });
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
        return conn;
      } catch (err) {
        console.warn(`⚠️ Could not connect to external MongoDB: ${err.message}`);
        console.log(`🔄 Falling back to embedded in-memory MongoDB engine...`);
      }
    }

    // Fallback to MongoMemoryServer for zero-config out-of-the-box local execution
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      mongod = await MongoMemoryServer.create();
      mongoUri = mongod.getUri();
      console.log(`🚀 Embedded MongoMemoryServer started successfully at ${mongoUri}`);
      const conn = await mongoose.connect(mongoUri);
      console.log(`✅ MongoDB Connected (Embedded In-Memory): ${conn.connection.host}`);
      return conn;
    } catch (memErr) {
      console.error(`❌ Failed to start embedded MongoMemoryServer: ${memErr.message}`);
      throw memErr;
    }
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    if (mongod) {
      await mongod.stop();
    }
    console.log('MongoDB connection closed.');
  } catch (err) {
    console.error('Error disconnecting MongoDB:', err);
  }
};

module.exports = { connectDB, disconnectDB };
