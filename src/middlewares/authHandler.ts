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
 


  const authorization = req.headers.authorization;
  if(!authorization){
    res.status(403).json({
      success: false,
      message: "Access denied. No token provided.",
    });
    return;
  }
  const parsedToken = parseTokenAndRole(authorization);


  console.log("token received",req.headers.authorization)
  if(parsedToken.role !== "admin" && parsedToken.role !== "employee"){
    res.status(403).json({
      success: false,
      message: "Invaid Role ",
    });
    return;
  }
  

  if (!parsedToken.token) {
    res.status(403).json({
      success: false,
      message: "Access denied. No token provided.",
    });
    return;
  }

  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables.");
  }


  jwt.verify(parsedToken.token, process.env.JWT_SECRET, async (err, decoded) => {
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
  // res.setHeader('Set-Cookie',`access_token=${accessToken}'; Path=/; Max-Age=${sevenDays}`)
  // res.setHeader('Set-Cookie',`refresh_token=${refreshToken}'; Path=/; Max-Age=${oneHour}`)
  res.cookie("access_token", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "PROD",
    maxAge: sevenDays,
  });

  res.cookie("refresh_token", refreshToken, {
    httpOnly: true, // httpOnly
    secure: process.env.NODE_ENV === "PROD",
    maxAge: sevenDays,
  });
};


function parseTokenAndRole(input: string): { token: string; role: string } {
  const [tokenPart, rolePart] = input.split(";").map(part => part.trim());
  
  if (!tokenPart.startsWith("Bearer ") || !rolePart.startsWith("role=")) {
      throw new Error("Invalid input format");
  }

  return {
      token: tokenPart.slice(7), // Remove "Bearer " (7 characters)
      role: rolePart.slice(5)    // Remove "role=" (5 characters)
  };
}
