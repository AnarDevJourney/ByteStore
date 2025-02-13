import jwt from "jsonwebtoken";

const generateToken = (res, userId) => {
  // Crating token
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "90d",
  });

  // Setting jwt as HTTP-Only cookie
  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development",
    sameSite: "strict",
    maxAge: 90 * 24 * 60 * 60 * 1000, // 90 days
  });
};

export default generateToken;
