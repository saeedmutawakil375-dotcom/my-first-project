import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

let memoryServer;

const connectDB = async () => {
  try {
    let mongoUri = process.env.MONGO_URI;

    if (process.env.USE_MEMORY_DB === "true") {
      memoryServer = await MongoMemoryServer.create();
      mongoUri = memoryServer.getUri("solvehub");
      console.log("Using in-memory MongoDB for local preview");
    }

    const connection = await mongoose.connect(mongoUri);
    console.log(`MongoDB connected: ${connection.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

const disconnectDB = async () => {
  await mongoose.disconnect();

  if (memoryServer) {
    await memoryServer.stop();
  }
};

export default connectDB;
export { disconnectDB };
