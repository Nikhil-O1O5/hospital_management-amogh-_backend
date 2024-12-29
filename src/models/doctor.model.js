import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: [true, "Email is required"],
    trim: true,
    lowercase: true,
  },
  fullName: {
    type: String,
    required: [true, "Full name is required"],
    trim: true,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  }
});

const Doctor = mongoose.model("doctors",doctorSchema);

export default Doctor