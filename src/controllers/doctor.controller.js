import Doctor from "../models/doctor.model.js";
import bcryptjs from "bcryptjs";
import { generateDoctorToken } from "../utils/generateDoctorToken.js";
import Patient from "../models/patient.model.js";

export const signup = async (req, res) => {
  try {
    const { email, fullName, password } = req.body;

    if (!fullName || !password || !email) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if Doctor already exists
    const doctor = await Doctor.findOne({ email });
    if (doctor) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password before saving
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    // Create new Doctor and save to database
    const newDoctor = await Doctor.create({
      fullName,
      password: hashedPassword,
      email,
    });

    // Generate a token for the Doctor
    generateDoctorToken(newDoctor._id, res);

    return res.status(201).json({
      _id: newDoctor._id,
      fullName: newDoctor.fullName,
      email: newDoctor.email,
    });
  } catch (error) {
    console.error("Error in Doctor signup controller:", error.message);

    if (error.code === "ECONNRESET") {
      return res.status(503).json({ message: "Connection was reset" });
    } else {
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
};


export const signin = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Email from req.body:", email);

    // Find doctor by email
    const doctor = await Doctor.findOne({ email });

    if (!doctor) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    // Check if the password matches
    const isPasswordCorrect = await bcryptjs.compare(password, doctor.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    // Generate JWT token for successful login
    const token = await generateDoctorToken(doctor._id, res);  // Ensure the token is generated with doctor._id

    return res.status(200).json({
      token: token, // Send the token in the response
      _id: doctor._id,
      fullName: doctor.fullName,
      email: doctor.email,
    });
  } catch (error) {
    console.error("Error in doctor login controller:", error.message);

    if (error.code === "ECONNRESET") {
      return res.status(503).json({ message: "Connection was reset. Please try again later." });
    }

    return res.status(500).json({ message: "Internal Server Error" });
  }
};


export const getPatients = async (req, res) => {
  try {
    // Get all patients, excluding email and password fields
    const patients = await Patient.find({}, { email: 0, password: 0 });

    res.status(200).json(patients);
  } catch (error) {
    console.error("Error in getPatients controller:", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deletePatient = async (req, res) => {
  try {
    const { patientId } = req.body;
    const patient = await Patient.deleteOne({ _id: patientId });

    if (patient.deletedCount === 0) {
      return res.status(404).json({ message: "Patient not found" });
    }

    res.status(200).json({ message: "Patient deleted successfully"});
  } catch (error) {
    console.error("Error in deletePatient controller (Doctor Controller):", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const addAppointment = async (req, res) => {
  try {
    const { date, month, year, patientId } = req.body;
    const doctorId = req.doctor._id;
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }
    const patient = await Patient.findById(patientId);
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }
    const appointmentDate = new Date(year, month - 1, date); // month is 0-indexed in JavaScript Date
    const newAppointment = {
      date: appointmentDate,
      doctorName: doctor.fullName,
    };
    patient.appointments.push(newAppointment);
    await patient.save();

    res.status(200).json({
      message: "Appointment added successfully",
      appointments: patient.appointments, 
    });
  } catch (error) {
    console.error("Error in addAppointment controller:", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};


export const addPrescription = async (req, res) => {
  try {
    const { patientId, prescription } = req.body;

    // Validate input
    if (!patientId || !prescription) {
      return res.status(400).json({ message: "Patient ID and prescription are required" });
    }

    // Find the patient and update their prescription array by adding the new prescription
    const patient = await Patient.findOneAndUpdate(
      { _id: patientId },  // Search by patient ID
      { $push: { prescription: prescription } },  // Push the new prescription into the prescription array
      { new: true }  
    );

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }
    res.status(200).json(patient);
  } catch (error) {
    console.error("Error in addPrescription controller:", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

