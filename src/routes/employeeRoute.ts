import express, { Request, Response, NextFunction } from "express";
import { authenticateToken } from "../middlewares/authHandler";
import { validateSchema } from "../middlewares/validationMiddleware";
import {
  getEmployeeProfile,
  loginEmployee,
  registerEmployee,
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
  "/profile/:employee_id",
  [
    authenticateToken, // Middleware to authenticate the employee
  ],
  (req: Request, res: Response, next: NextFunction) => {
    const { employee_id } = req.params;
    getEmployeeProfile(req, res, next);
  }
);

export default router;
