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
  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn });
  return token;
};

// Middleware to authenticate JWT token
export const authenticateToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const cookies = req.headers.cookie
 
  let token: string | undefined;
  let role: string | undefined

  token = req.headers.authorization;
  // console.log("request received in token veri",req.headers)
  if(!token && cookies){
    const cookieArray = cookies.split(';')
    const authTokenCookies = cookieArray.find(cookie => cookie.trim().startsWith('access_token'));
    const roleCookies = cookieArray.find(cookie => cookie.trim().startsWith('role'));
    if(authTokenCookies){
      token = authTokenCookies.split('=')[1].trim();
    }
    if(roleCookies){
      role = roleCookies.split('=')[1].trim();
    }
  }

  console.log("token received",token)
  if(role !== "admin" && role !== "employee"){
    res.status(403).json({
      success: false,
      message: "Invaid Role ",
    });
    return;
  }
  

  if (!token) {
    res.status(403).json({
      success: false,
      message: "Access denied. No token provided.",
    });
    return;
  }

  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables.");
  }


  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      res.status(403).json({
        success: false,
        message: "Access denied. Invalid token.",
      });
      return;
    }

    req.user = decoded;
    next();
  });
};

// Middleware to handle expired JWT tokens
export const setTokensInCookies = (res: Response, accessToken: string, refreshToken: string): void => {
  const oneHour = 60 * 60 * 1000; // 1 hour in milliseconds
  const sevenDays = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
  res.cookie("access_token", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "PROD",
    maxAge: oneHour,
  });

  res.cookie("refresh_token", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "PROD",
    maxAge: sevenDays,
  });
};
