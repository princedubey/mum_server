import express, { Request, Response, NextFunction } from "express";
import { authenticateToken } from "../middlewares/authHandler";
import { validateSchema } from "../middlewares/validationMiddleware";
import {
  deleteFile,
  downloadFiles,
  findMatchingUser,
  generatePUTPresignedUrl,
  getUserProfile,
  loginUser,
  registerOrUpdateUser,
} from "../controllers/userController";
import {
  userRegistrationSchema,
  loginUserSchema,
} from "../validation/userSchemaValidation";
import { acceptConnectionRequest, getAllProposals, getAllSentProposals, getConnections, rejectConnectionRequest, sendConnectionRequest } from "../controllers/connectionController";

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

router.get("/find-new-connections",
  [
    authenticateToken,
  ],
  findMatchingUser
)

router.get("/connections",
  [
    authenticateToken,
  ],
  getConnections
)

router.patch("/send-proposal/:targetUserId",
  [
    authenticateToken,
  ],
  sendConnectionRequest
)

router.patch("/accept-proposal/:targetUserId",
  [
    authenticateToken,
  ],
  acceptConnectionRequest
)

router.patch("/reject-proposal/:targetUserId",
  [
    authenticateToken,
  ],
  rejectConnectionRequest
)

router.get("/proposals",
  [
    authenticateToken,
  ],
  getAllProposals
)

router.get("/sent-proposals",
  [
    authenticateToken,
  ],
  getAllSentProposals
)

export default router;
