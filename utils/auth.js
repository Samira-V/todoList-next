import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


// ==============================
// Hash Password
// ==============================

export const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};


// ==============================
// Verify Password
// ==============================

export const verifyPassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};


// ==============================
// Generate JWT
// ==============================

export const generateToken = (data) => {

  const secret = process.env.privateKey;

  if (!secret) {
    throw new Error("privateKey is not defined");
  }

  return jwt.sign(
    { ...data },
    secret,
    {
      expiresIn: "24h",
    }
  );
};


// ==============================
// Verify JWT
// ==============================

export const verifyToken = (token) => {

  try {

    if (!token) {
      return null;
    }

    const secret = process.env.privateKey;

    if (!secret) {
      throw new Error("privateKey is not defined");
    }

    return jwt.verify(token, secret);

  } catch (error) {

    console.error("JWT verification error:", error.message);

    return null;
  }
};