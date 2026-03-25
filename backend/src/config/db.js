import mongoose from 'mongoose';
import logger from '../utils/logger.js';

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
       family: 4
    });
    logger.info(`MongoDB Connected`);
  } catch (error) {
    logger.error(`Error: ${error}`);
    process.exit(1);
  }
};

export default connectDB;