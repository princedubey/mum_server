import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const URL = process.env.DB_URL
export async function connectDb(){
    try{
        if(!URL){
            throw new Error("No database URL provided")
        }
        await mongoose.connect(URL);
        console.log("Database connected successfully")
    }catch(e){
        console.error("Error connecting to database", e)
        process.exit(1)
    }
}