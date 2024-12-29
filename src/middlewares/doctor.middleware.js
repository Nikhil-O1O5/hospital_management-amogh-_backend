import jwt from "jsonwebtoken";
import Doctor from "../models/doctor.model.js";  

export const doctorAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'Authentication token required' });
    }

    // Verify the token using the correct secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET_DOCTOR); 

    // Check if doctor exists in the database using the decoded userId
    const doctor = await Doctor.findById(decoded.userId);  // Ensure decoded.userId is used here
    if (!doctor) {
      return res.status(401).json({ message: 'Doctor not found' });
    }

    // Attach doctor to the request object for further use in the route
    req.doctor = doctor;
    next();
  } catch (error) {
    console.error("Error in doctorAuth middleware:", error.message);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};
