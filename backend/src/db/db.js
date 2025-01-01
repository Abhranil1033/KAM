import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(`${process.env.DB_URL}?retryWrites=true&w=majority`, {
      dbName: process.env.DB_NAME,
    });
    console.log('Database connection successful');
  } catch (error) {
    console.error('Database connection error:', error.message);
  }
};

export default connectDB;
