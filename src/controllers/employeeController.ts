import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import employeesModel from "../models/Employee";
import { generateToken, setTokensInCookies } from "../middlewares/authHandler";
import { SortOrder } from "mongoose";
import { JwtPayload } from "jsonwebtoken";
import { IEmployee } from "../models/Employee";
import { sendEmailWithCredentials } from "../config/mailer";
import { AppError } from "../middlewares/errorHandler";
import { CustomRequest } from "../middlewares/validationMiddleware";

// Register or Update Employee
export const registerOrUpdateEmployee = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const {
    firstName,
    lastName,
    email,
    phoneNumber,
    post,
    designation,
    postingPlace,
    role,
    access,
    password,
    employeeId,
    companyName,
  }: IEmployee = req.body;

  try {
    console.log("Register or Update Employee");

    const employeeExists = await employeesModel.findOne({ email });

    if (employeeExists) {
      employeeExists.firstName = firstName;
      employeeExists.lastName = lastName;
      employeeExists.phoneNumber = phoneNumber;
      employeeExists.post = post;
      employeeExists.designation = designation;
      employeeExists.postingPlace = postingPlace;
      employeeExists.role = role;
      employeeExists.access = access;
      employeeExists.employeeId = employeeId;
      employeeExists.companyName = companyName;

      // Update password only if a new one is provided
      if (password) {
        employeeExists.password = await bcrypt.hash(password, 10);
      }

      await employeeExists.save();

      res.status(200).json({
        success: true,
        message: "Employee data updated successfully",
        employee: employeeExists,
      });
    } else {
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create the new employee
      const newEmployee = new employeesModel({
        firstName,
        lastName,
        email,
        phoneNumber,
        post,
        designation,
        postingPlace,
        role,
        access,
        password: hashedPassword,
        isActive: true,
        employeeId,
        companyName,
      });

      await newEmployee.save();

      // Send email with credentials
      await sendEmailWithCredentials(email, email, password);

      res.status(201).json({
        success: true,
        message: "Employee created successfully",
        employee: newEmployee,
      });
    }
  } catch (error) {
    next(error);
  }
};

// Login Employee
export const loginEmployee = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { email, password }: { email: string; password: string } = req.body;
  try {
    console.log("login ",email)
    // Find employee by email
    const employee = await employeesModel.findOne({ email });
    if (!employee) {
      throw new AppError("Couldn't find employee",404)
    }

    // Check if employee is active
    if (!employee.isActive) {
      throw new AppError("Employee is not active",400)
    }

    // Check password
    const isMatch = await bcrypt.compare(password, employee.password);
    if (!isMatch) {
      throw new AppError("Email or Password not matched",400)
    }

    // Generate JWT tokens
    const accessToken = generateToken(employee);
    const refreshToken = generateToken(employee, 'refresh');

    // Set tokens in cookies
    setTokensInCookies(res, accessToken, refreshToken);


    res.status(200).json({
      success: true,
      message: "Employee Login Successfully",
      data: {
        _id: employee._id,
        name: employee.firstName + ' ' + employee.lastName,
        email: employee.email,
        role: employee.role,
        access_token: accessToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get Employee Profile
export const getEmployeeProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Unauthorized access",
      });
      return;
    }

    const id: string = (req.user as JwtPayload)._id;
    const employee = await employeesModel.findById(id);
    if (!employee) {
      res.status(404).json({
        success: false,
        message: "Employee not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Employee Profile fetched Successfully",
      data: employee,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllEmployees = async (
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

    const employees = await employeesModel
      .find(query)
      .skip(skip)
      .limit(limit || 0)
      .sort(sort as string | { [key: string]: SortOrder | { $meta: any; }; } | [string, SortOrder][] | null | undefined)
      .select(projection as string | string[] | Record<string, string | number | boolean | object>);

    res.status(200).json({
      success: true,
      message: "All Employees fetched successfully",
      data: employees,
    });
  } catch (error) {
    next(error); // Pass errors to the error-handling middleware
  }
};


// Update Employee Profile from Employee Profile Model
export const updateEmployeeProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const employeeId: string = (req.user as JwtPayload)._id;
    const employee = await employeesModel.findByIdAndUpdate(employeeId, req.body, { new: true });

    if (!employee) {
      res.status(404).json({
        success: false,
        message: "Employee not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Employee profile updated successfully",
      data: employee,
    });
  } catch (error) {
    next(error);
  }
};

// update employee by employee id
export const updateEmployeeById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const employeeId: string = req.params.id;
    const employee = await employeesModel.findByIdAndUpdate(employeeId, req.body, { new: true });

    if (!employee) {
      res.status(404).json({
        success: false,
        message: "Employee not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Employee updated successfully",
      data: employee,
    });
  } catch (error) {
    next(error);
  }
};

// Delete Employee by id from admin
export const deleteEmployee = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const employeeId: string = req.params.id;
    const employee = await employeesModel.findByIdAndDelete(employeeId);

    if (!employee) {
      res.status(404).json({
        success: false,
        message: "Employee not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Employee deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
