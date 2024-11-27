import express, { Request, Response, NextFunction } from "express";
import { authenticateToken } from "../middlewares/authHandler";
import { validateSchema } from "../middlewares/validationMiddleware";
import {
  deleteFile,
  downloadFiles,
  generatePUTPresignedUrl,
  getUserProfile,
  loginUser,
  registerOrUpdateUser,
} from "../controllers/userController";
import {
  userRegistrationSchema,
  loginUserSchema,
} from "../validation/userSchemaValidation";

const router = express.Router();

// User Registration
router.post(
  "/register",
  [
    validateSchema(userRegistrationSchema),
  ],
  registerOrUpdateUser
);

// User Login
router.post("/login",
  [
    validateSchema(loginUserSchema),
  ],
  loginUser
);

// Get User Profile
router.get("/profile/:user_id",
  [
    authenticateToken, // Middleware to authenticate the user
  ],
    getUserProfile
);

// generation put presigned url 
router.post("/presigned-url",
  [
    authenticateToken,
  ],
  generatePUTPresignedUrl
)

// get images from s3
router.get("/download-file",
  [
    authenticateToken,
  ],
  downloadFiles
)

// delete images from s3
router.delete("/delete-file", 
  [
    authenticateToken,
  ],
  deleteFile
)

export default router;
