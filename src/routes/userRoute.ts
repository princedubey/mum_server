import express, { Request, Response, NextFunction } from "express";
import { authenticateToken } from "../middlewares/authHandler";
import { validateSchema } from "../middlewares/validationMiddleware";
import {
  getUserProfile,
  loginUser,
  registerUser,
} from "../controllers/userController";
import {
  userRegistrationSchema,
  loginUserSchema,
} from "../validation/userSchemaValidation";

const router = express.Router();

// User Registration
router.post(
  "/signup",
  [
    validateSchema(userRegistrationSchema),
  ],
  registerUser
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

export default router;
