import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import UserModel, { IUser } from "../models/User";
import { generateToken, setTokensInCookies } from "../middlewares/authHandler";
import { AppError } from "../middlewares/errorHandler";
import { JwtPayload } from "jsonwebtoken";
import { CustomRequest } from "../middlewares/validationMiddleware";
import { SortOrder } from "mongoose";
import { s3StorageService } from '../services/s3-storage-service'

// Register or Update User
export const registerOrUpdateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const userData:IUser = req.body;

  try {
    console.log("========================================================")
    console.log('register',userData)
    // Check if user already exists
    const userExists = await UserModel.findOne({ "contactInfo.email": userData.contactInfo.email });
    if (userExists) {
      res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    userData.password = hashedPassword

    // Create the new user
    const newUser = new UserModel(userData);

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
  console.log(email, password);

  try {
    // Find user by email
    const user = await UserModel.findOne({ "contactInfo.email": email });
    if (!user) {
      throw new AppError("User not found",404)
    }

    // // Check password
    // const isMatch = await bcrypt.compare(password, user.contactInfo.password);
    // if (!isMatch) {
    //   throw new AppError("Invalid email or password",404)
    // }

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

export const getUserByEmail = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const email: string = req.params.email;
    let user = await UserModel.findOne({ "contactInfo.email": email }).select("-password");

    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    const images: string[] = user.personalInfo.profileImages || [];
    const urls = await Promise.all(
      images.map((image) => s3StorageService.getDownloadUrl(image))
    );

    user.personalInfo.profileImages = urls;

    res.status(200).json({
      success: true,
      message: "User fetched successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
}

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

export const downloadFiles = async (req: Request, res: Response): Promise<void> => {
  const fileName = req.query.fileName as string;

  if (!fileName) {
    res.status(400).json({ error: "Missing fileName" });
    return
  }

  try {
    const downloadUrl = await s3StorageService.getDownloadUrl(fileName);
    res.status(200).json({ downloadUrl });
  } catch (error) {
    console.error("Error generating download URL:", error);
    res.status(500).json({ error: "Failed to generate download URL" });
  }
}

// delete file from s3
export const deleteFile = async (req: Request, res: Response): Promise<void> => {
  const fileName = req.query.fileName as string;

  if (!fileName) {
    res.status(400).json({ error: "Missing fileName" });
    return;
  }

  try {
    await s3StorageService.deleteImage(fileName);
    res.status(200).json({ success: true, message: "File deleted successfully" });
  } catch (error) {
    console.error("Error deleting file:", error);
    res.status(500).json({ error: "Failed to delete file" });
  }
}

// find matching user for connection
export const findMatchingUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id: string = (req.user as JwtPayload)._id;
    const user = await UserModel.findById(id);
    console.log(id);

    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    const matchingUsers = await UserModel.aggregate([
      {
        $match: {
          tags: { $in: user.tags },
          _id: { $ne: user._id }, // Exclude the user itself
        },
      },
      {
        $addFields: {
          score: {
            $size: {
              $filter: {
                input: "$tags",
                as: "tag",
                cond: { $in: ["$$tag", user.tags] },
              },
            },
          },
        },
      },
      {
        $sort: { score: -1 },
      },
    ]);

    res.status(200).json({
      success: true,
      message: "Matching users fetched successfully",
      data: matchingUsers,
    });
  } catch (error) {
    next(error);
  }
};
