import { Request,Response,NextFunction } from "express";
import { loginUser } from "./userController";
import { loginEmployee } from "./employeeController";
import { AppError } from "../middlewares/errorHandler"; // Adjust the path as necessary

interface LoginProps{
    email: string;
    password: string;
    accessType: string; // "user" or "employee"
}

export const login = async(req:Request,res:Response,next:NextFunction):Promise<void>=>{
    try{
        const {email, password, accessType}: LoginProps = req.body;
        // validate inputs
        if(!email ||!password || !accessType){
            throw new AppError("Invalid Credentials",400)
        }
        if(accessType === "user"){
            await loginUser(req,res,next);
            return;
        }
        if(accessType === "employee" || accessType === "admin"){
            await loginEmployee(req,res,next)
            return;
        }

        res.status(400).json({success: false, message: "Invalid access type"});
        // implement authentication logic based on type


    }catch(err){
        console.error(err);
        next(err);
    }
}