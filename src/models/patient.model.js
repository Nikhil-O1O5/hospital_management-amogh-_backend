import mongoose from "mongoose";

const patientSchema = new mongoose.Schema({
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
  },
  healthStatus: {
    type: String,
    trim: true,
  },
  appointments: [
    {
      date: {
        type: Date,
        required: true,
      },
      doctorName: {
        type: String,
        required: true,
        trim: true,
      },
    },
  ],
  prescription: {
    type: [String],  // This is an array of strings for prescriptions
    default: [],     // Set the default value as an empty array
  },
});

// Set default empty array for appointments
patientSchema.pre('save', function(next) {
  if (!this.appointments) {
    this.appointments = [];
  }
  next();
});

const Patient = mongoose.model("patients", patientSchema);

export default Patient;
