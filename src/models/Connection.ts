import mongoose, { model, Schema } from "mongoose";

export interface IConnection{
    userId: Schema.Types.ObjectId;
    
}