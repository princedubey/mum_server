import mongoose, { model, Schema } from "mongoose";

export interface Favourite {
  userId: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  likedBy: Schema.Types.ObjectId; // me | heOrShe
}

const favouriteSchema = new Schema<Favourite>(
  {
    userId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    likedBy: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  },
  { timestamps: true, versionKey: false }
);

const FavouriteModel =
  mongoose.models?.Favourite || model<Favourite>("Favourite", favouriteSchema);

export default FavouriteModel;
