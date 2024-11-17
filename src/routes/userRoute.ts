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
    validateSchema(userRegistrationSchema), // Validates the request body against the schema
  ],
  registerUser
);

// User Login
router.post(
  "/login",
  [
    validateSchema(loginUserSchema), // Validates the login schema
  ],
  loginUser
);

// Get User Profile
router.get(
  "/profile/:user_id",
  [
    authenticateToken, // Middleware to authenticate the user
  ],
  (req: Request, res: Response, next: NextFunction) => {
    // const { user_id } = req.params;
    getUserProfile(req, res, next);
  }
);

export default router;
