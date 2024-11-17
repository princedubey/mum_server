import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import employeesModel from "../models/Employee";
import { generateToken, setTokensInCookies } from "../middlewares/authHandler";
import { JwtPayload } from "jsonwebtoken";
import { IEmployee } from "../models/Employee";
import { sendEmailWithCredentials } from "../config/mailer";

// Register Employee
export const registerEmployee = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { firstName, lastName, email, phoneNumber, post, designation, postingPlace, role, access, password }: IEmployee = req.body;

  try {
    // Check if employee already exists
    const employeeExists = await employeesModel.findOne({ email });
    if (employeeExists) {
      res.status(400).json({
        success: false,
        message: "Employee already exists",
      });
    }

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
    });
    await newEmployee.save();

    // Send email with password
    await sendEmailWithCredentials(email, email, password)

    res.status(201).json({
      success: true,
      employee: newEmployee,
    });
  } catch (error) {
    next(error);
  }
};

// Login Employee
export const loginEmployee = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { email, password }: { email: string; password: string } = req.body;

  try {
    // Find employee by email
    const employee = await employeesModel.findOne({ email });
    if (!employee) {
      res.status(400).json({
        success: false,
        message: "Employee not found",
      });
    }

    // Check if employee is active
    if (!employee.isActive) {
      res.status(400).json({
        success: false,
        message: "Employee not active",
      });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, employee.password);
    if (!isMatch) {
      res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
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
