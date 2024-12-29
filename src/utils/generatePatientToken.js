import jwt from "jsonwebtoken";

export const generatePatientToken = async (userId, res) => {
  try {
    // Generate token with userId in payload
    const token = jwt.sign({ userId }, process.env.JWT_SECRET_PATIENT, {
      expiresIn: "7d",  // Token expiration time (7 days)
    });

    // Send token in cookie
    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
      httpOnly: true, // Prevents access via JavaScript
      sameSite: "strict", // Prevents CSRF attacks
      // secure: true, // Uncomment if using HTTPS in production
    });

    return token;
  } catch (error) {
    console.error("Error generating token:", error);
    throw new Error("Failed to generate token");
  }
};
