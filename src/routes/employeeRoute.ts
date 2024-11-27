import express, { Request, Response, NextFunction } from "express";
import { authenticateToken } from "../middlewares/authHandler";
import { adminOrEmployeeValidation, adminValidation, parseFilterParams, validateSchema } from "../middlewares/validationMiddleware";
import {
  getEmployeeProfile,
  registerOrUpdateEmployee,
  getAllEmployees,
  getDashboardInsight,
} from "../controllers/employeeController";
import {
  registerEmployeeSchema,
  loginEmployeeSchema,
} from "../validation/employeeSchemaValidation";
import { getAllUsers } from "../controllers/userController";

const router = express.Router();

// Employee Registration
router.post("/register",
  [
    validateSchema(registerEmployeeSchema), // Validates the request body against the schema
  ],
  registerOrUpdateEmployee
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

router.get("/all-users",
  [
    authenticateToken,
    adminOrEmployeeValidation,
    parseFilterParams,
  ],
  getAllUsers
)

router.get("/dashboard-insights",
  [
    authenticateToken,
    adminOrEmployeeValidation,
    parseFilterParams,
  ],
  getDashboardInsight
)

export default router;
