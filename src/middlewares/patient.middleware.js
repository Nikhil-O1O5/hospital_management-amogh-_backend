import jwt from "jsonwebtoken";
import Patient from "../models/patient.model.js";

export const patientMiddleware = async (req, res, next) => {
  try {
    // Extract token from Authorization header
    const token = req.headers.authorization?.split(" ")[1];

    // Check if token exists
    if (!token) {
      return res.status(401).json({ message: "Authorization token required" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET_PATIENT);

    // Check if the patient exists in the database
    const patient = await Patient.findById(decoded.userId);  // Ensure userId is used here, not patientId
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    // Attach patient data to the request object for further use in the route
    req.patient = patient;

    next();
  } catch (error) {
    console.error("Error in patient middleware:", error);

    // Handle specific JWT errors
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token" });
    }

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired" });
    }

    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
