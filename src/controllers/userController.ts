import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import UserModel, { IUser } from "../models/User";
import { generateToken, setTokensInCookies } from "../middlewares/authHandler";
import { AppError } from "../middlewares/errorHandler";
import { JwtPayload } from "jsonwebtoken";
import { CustomRequest } from "../middlewares/validationMiddleware";
import { SortOrder } from "mongoose";
import { s3StorageService } from '../services/s3-storage-service'

// Register User
export const registerUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

  const {
    firstName, middleName, lastName, gender, dob, bloodGroup, height, weight,
    complexion, hobbies, aboutMe, profileImages,
    phoneNumber, email, highestEducation, otherEductionDetail, jobType,
    designation, workDetail, income, religion, caste, subCaste, gotra,
    raasi, fatherName, fatherOccupation, motherName, motherOccupation,
    noOfSiblings, noOfBrothers, noOfSisters, familyType, spouseExpctation,
    residentialAddr, permanentAddr, createdBy, tags, password
  } = req.body;

 res.json({message:`${req.headers} + $`});
 return

  try {
    // Check if user already exists
    const userExists = await UserModel.findOne({ "contactInfo.email": email });
    if (userExists) {
      res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new user
    const newUser = new UserModel({
      createdBy,
      personalInfo: { firstName, middleName, lastName, gender, dob, bloodGroup, height, weight, complexion, hobbies, aboutMe, profileImages },
      contactInfo: { phoneNumber, email, password: hashedPassword },
      residentialAddr,
      permanentAddr,
      eduAndProfInfo: { highestEducation, otherEductionDetail, jobType, designation, workDetail, income },
      cultureAndReligiousInfo: { religion, caste, subCaste, gotra, raasi },
      familyInfo: { fatherName, fatherOccupation, motherName, motherOccupation, noOfSiblings, noOfBrothers, noOfSisters, familyType },
      spouseExpctation,
      tags,
    });

    await newUser.save();

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        firstName: newUser.personalInfo.firstName,
        lastName: newUser.personalInfo.lastName,
        email: newUser.contactInfo.email,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Login User
export const loginUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { email, password }: { email: string; password: string } = req.body;

  try {
    // Find user by email
    const user = await UserModel.findOne({ "contactInfo.email": email });
    if (!user) {
      throw new AppError("User not found",404)
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.contactInfo.password);
    if (!isMatch) {
      throw new AppError("Invalid email or password",404)
    }

    // Generate JWT tokens
    const accessToken = generateToken(user);
    const refreshToken = generateToken(user, 'refresh');

    // Set tokens in cookies
    setTokensInCookies(res, accessToken, refreshToken);

    res.status(200).json({
      success: true,
      message: "User logged in successfully",
      data: {
        userId: user._id,
        name: `${user.personalInfo.firstName} ${user.personalInfo.lastName}`,
        email: user.contactInfo.email,
        access_token: accessToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get User Profile
export const getUserProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id: string = (req.user as JwtPayload)._id;
    const user = await UserModel.findById(id);
    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "User profile fetched successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// update user by id from admin
export const updateUserByAdmin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId: string = req.params.id;
    const user = await UserModel.findByIdAndUpdate(userId, req.body, { new: true });
    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
}

// delete user by id from admin

export const deleteUserByAdmin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId: string = req.params.id;
    const user = await UserModel.findByIdAndDelete(userId);
    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    next(error);
  }
}


export const generatePUTPresignedUrl = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const imagesData = req.body;
  
    const signedUrls =  await s3StorageService.generateMultiplePUTPresignedUrls(imagesData);
    res.status(200).json({
      success: true,
      message: "Presigned URLs generated successfully",
      data: signedUrls,
    });
  } catch (error) {
    next(error);
  }
}

export const getAllUsers = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      query = {},
      skip = 0,
      limit = 0,
      sort = null,
      projection = {},
    } = req.parsedFilterParams || {};

    const employees = await UserModel
      .find(query)
      .skip(skip)
      .limit(limit || 0)
      .sort(sort as string | { [key: string]: SortOrder | { $meta: any; }; } | [string, SortOrder][] | null | undefined)
      .select(projection as string | string[] | Record<string, string | number | boolean | object>);

    res.status(200).json({
      success: true,
      message: "All Users fetched successfully",
      data: employees,
    });
  } catch (error) {
    next(error);
  }
};