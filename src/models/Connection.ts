import mongoose, { model, Schema } from "mongoose";

export interface IConnection{
    userId: Schema.Types.ObjectId;
    connectionId: Schema.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
    
}

const connectionSchema = new Schema<IConnection>(
    {
        userId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
        connectionId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    },
    { timestamps: true, versionKey: false }
);

const ConnectionModel = mongoose.models?.Connection || model<IConnection>("Connection", connectionSchema);

export default ConnectionModel;