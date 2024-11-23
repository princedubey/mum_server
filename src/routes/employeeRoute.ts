import express, { Request, Response, NextFunction } from "express";
import { authenticateToken } from "../middlewares/authHandler";
import { adminValidation, parseFilterParams, validateSchema } from "../middlewares/validationMiddleware";
import {
  getEmployeeProfile,
  registerEmployee,
  getAllEmployees,
} from "../controllers/employeeController";
import {
  registerEmployeeSchema,
  loginEmployeeSchema,
} from "../validation/employeeSchemaValidation";

const router = express.Router();

// Employee Registration
router.post("/register",
  [
    validateSchema(registerEmployeeSchema), // Validates the request body against the schema
  ],
  registerEmployee
);

// Get Employee Profile
router.get("/profile/:id",
  [
    authenticateToken,
  ],
  getEmployeeProfile
);

router.get("/all-employee",
  [
    authenticateToken,
    adminValidation,
    parseFilterParams,
  ],
  getAllEmployees
)

export default router;
