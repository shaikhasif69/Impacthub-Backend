import mongoose from "mongoose";
const dbURI =
  "mongodb+srv://oscar:I6TUsF3dLRLBkZ8P@oscar.rvxt1.mongodb.net/?retryWrites=true&w=majority&appName=Oscar";

export const connectDB = async () => {
  try {
    await mongoose.connect(dbURI);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("Failed to connect to MongoDB", err);
    process.exit(1);
  }
};
