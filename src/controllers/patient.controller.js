import Patient from "../models/patient.model.js";
import bcryptjs from "bcryptjs";
import { generatePatientToken } from "../utils/generatePatientToken.js";

export const signup = async (req, res) => {
  try {
    const { email, fullName, password, healthStatus } = req.body;

    if (!fullName || !password || !email) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if patient already exists
    const patient = await Patient.findOne({ email });
    if (patient) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password before saving
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    // Create new patient and save to database
    const newPatient = await Patient.create({
      fullName,
      password: hashedPassword,
      email,
      healthStatus
    });

    // Generate a token for the patient
    generatePatientToken(newPatient._id, res);

    return res.status(201).json({
      _id: newPatient._id,
      fullName: newPatient.fullName,
      email: newPatient.email,
    });
  } catch (error) {
    console.error("Error in patient signup controller:", error.message);

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

    // Find patient by email
    const patient = await Patient.findOne({ email });

    if (!patient) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    // Check if the password matches
    const isPasswordCorrect = await bcryptjs.compare(password, patient.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    // Generate JWT token for successful login
    const token = await generatePatientToken(patient._id, res);  // Ensure the token is generated with patient._id

    return res.status(201).json({
      token: token
    });
  } catch (error) {
    console.error("Error in patient login controller:", error.message);

    if (error.code === "ECONNRESET") {
      return res.status(503).json({ message: "Connection was reset. Please try again later." });
    }

    return res.status(500).json({ message: "Internal Server Error" });
  }
};


export const getDetails = async (req, res) => {
  try {
    const patientId = req.patient._id; // Assuming req.patient is set by a middleware

    // Find the patient by their ID
    const patient = await Patient.findById(patientId);

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    res.status(200).json(patient);
  } catch (error) {
    console.log("Error in patient getDetails controller:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
