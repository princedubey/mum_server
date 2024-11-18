import mongoose, { model, Schema } from "mongoose";


// Define Comment Interface
export interface IComment {
  userId: Schema.Types.ObjectId;
  connectionId: Schema.Types.ObjectId;
  comment: string;
  createdAt: Date;
  updatedAt: Date;
}

// Define Comment Schema
const commentSchema = new Schema<IComment>(
  {
    userId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    connectionId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    comment: { type: String, required: true },
  },
  { timestamps: true, versionKey: false }
);

// Create Comment Model
const CommentModel = mongoose.models?.Comment || model<IComment>("Comment", commentSchema);

export default CommentModel;