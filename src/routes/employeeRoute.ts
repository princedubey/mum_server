import express, { Request, Response, NextFunction } from "express";
import { authenticateToken } from "../middlewares/authHandler";
import { validateSchema } from "../middlewares/validationMiddleware";
import {
  getEmployeeProfile,
  loginEmployee,
  registerEmployee,
  getAllEmployees,
} from "../controllers/employeeController";
import {
  registerEmployeeSchema,
  loginEmployeeSchema,
} from "../validation/employeeSchemaValidation";

const router = express.Router();

// Employee Registration
router.post(
  "/register",
  [
    validateSchema(registerEmployeeSchema), // Validates the request body against the schema
  ],
  registerEmployee
);

// Employee Login
router.post(
  "/login",
  [
    validateSchema(loginEmployeeSchema), // Validates the login schema
  ],
  loginEmployee
);

// Get Employee Profile
router.get(
  "/profile/:id",
  [
    authenticateToken, // Middleware to authenticate the employee
  ],
  (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    console.log("Request received")

    getEmployeeProfile(req, res, next);
  }
);


router.get(
  "/",
  [
    authenticateToken,
  ],
  (req: Request, res: Response, next: NextFunction) => {
    getAllEmployees(req, res, next); //
  }
)

export default router;
