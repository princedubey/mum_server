import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";

dotenv.config();

// Define a custom type for user objects
interface User {
  _id: string;
  email:string;
  role:string;
}

// Add custom property to the Request interface for storing user info
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload | string;
    }
  }
}

// Function to generate JWT token
export const generateToken = (user: User, type: "access" | "refresh" = "access"): string => {
  const expiresIn = type === "access" ? "1h" : "3d";
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables.");
  }
  return jwt.sign({ _id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn });
};

// Middleware to authenticate JWT token
export const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
  let authorization = req.headers.authorization;

  if (req.headers.cookie) {
    authorization = req.headers.cookie.split("; ")[0].slice(13);
  }

  if (!authorization) {
    res.status(403).json({
      success: false,
      message: "Access denied. No token provided.",
    });
    return;
  }

  const token = extractBearerToken(authorization);

  if (!token) {
    res.status(403).json({
      success: false,
      message: "Access denied. Invalid token format.",
    });
    return;
  }

  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables.");
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      res.status(403).json({
        success: false,
        message: "Access denied. Invalid or expired token.",
      });
      return;
    }

    req.user = decoded;
    next();
  });
};

// Function to set JWT tokens in cookies
export const setTokensInCookies = (res: Response, accessToken: string, refreshToken: string): void => {
  const oneHour = 60 * 60 * 1000; // 1 hour in milliseconds
  const sevenDays = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

  res.cookie("access_token", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "PROD",
    maxAge: sevenDays,
  });

  res.cookie("refresh_token", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "PROD",
    maxAge: sevenDays,
  });
};

// Helper function to extract token from Authorization header
const extractBearerToken = (authorization: string): string | null => {
  if (authorization.startsWith("Bearer ")) {
    return authorization.slice(7);
  }
  return authorization;
};
