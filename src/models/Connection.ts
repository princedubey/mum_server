import mongoose, { Schema, Document } from "mongoose";

export interface IConnection extends Document {
  userId: Schema.Types.ObjectId;
  targetUserId: Schema.Types.ObjectId;
  status: "pending" | "accepted" | "rejected";
  createdAt?: Date;
  updatedAt?: Date;
}

const connectionSchema = new Schema<IConnection>(
  {
    userId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    targetUserId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    status: { type: String, enum: ["pending", "accepted", "rejected"], default: "pending" },
  },
  { timestamps: true, versionKey: false}
);

const ConnectionModel =
  mongoose.models.Connection || mongoose.model<IConnection>("Connection", connectionSchema);

export default ConnectionModel;
