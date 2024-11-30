import mongoose, { Schema, Document } from "mongoose";

export interface INotification extends Document {
  userId: Schema.Types.ObjectId; // The user who receives the notification
  type: "like" | "connection"; // The type of notification
  targetUserId: Schema.Types.ObjectId; // The user who triggered the notification
  message: string; // Notification message
  read: boolean; // Whether the notification is read
  createdAt?: Date;
}

const notificationSchema = new Schema<INotification>(
  {
    userId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    type: { type: String, enum: ["like", "connection"], required: true },
    targetUserId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    message: { type: String, required: true },
    read: { type: Boolean, default: false },
  },
  { timestamps: true, versionKey: false }
);

const NotificationModel =
  mongoose.models.Notification || mongoose.model<INotification>("Notification", notificationSchema);

export default NotificationModel;
