import { Request, Response, NextFunction } from "express";
import ConnectionModel from "../models/Connection";
import NotificationModel from "../models/Notification";

export const sendConnectionRequest = async (req: Request,res: Response,next: NextFunction): Promise<void>  => {
  try {
    const { targetUserId } = req.params;
    const userId = (req.user as { _id: string })._id;

    // Check if request already exists
    const existingConnection = await ConnectionModel.findOne({
      userId,
      targetUserId,
    });
    if (existingConnection) {
      res
        .status(400)
        .json({ message: "Connection request already sent." });
    }

    // Create a new connection request
    const connection = new ConnectionModel({ userId, targetUserId });
    await connection.save();

    // Create a notification for the target user
    const notification = new NotificationModel({
      userId: targetUserId,
      targetUserId: userId,
      type: "connection",
      message: `User ${userId} sent you a connection request.`,
    });
    await notification.save();

    res.status(201).json({ message: "Connection request sent successfully." });
  } catch (error) {
    console.error("Error in sendConnectionRequest:", error);
    next(error);
  }
};

export const acceptConnectionRequest = async (req: Request, res: Response, next: NextFunction): Promise<void>  => {
  try {
    const { targetUserId } = req.params;
    const userId = (req.user as { _id: string })._id;

    // Update the connection status to "accepted"
    const connection = await ConnectionModel.findOneAndUpdate(
      { userId: targetUserId, targetUserId: userId, status: "pending" },
      { status: "accepted" },
      { new: true }
    );

    if (!connection) {
      res
        .status(404)
        .json({ message: "No pending connection request found." });
    }

    // Create a notification for the target user
    const notification = new NotificationModel({
      userId: userId,
      targetUserId: targetUserId,
      type: "connection",
      message: `User ${userId} accepted your connection request.`,
    });
    await notification.save();

    res.status(200).json({ message: "Connection request accepted." });
  } catch (error) {
    console.error("Error in acceptConnectionRequest:", error);
    next(error);
  }
};

export const rejectConnectionRequest = async (req: Request, res: Response, next: NextFunction): Promise<void>  => {
  try {
    const { targetUserId } = req.params;
    const userId = (req.user as { _id: string })._id;

    // Update the connection status to "rejected"
    const connection = await ConnectionModel.findOneAndUpdate(
      { userId: targetUserId, targetUserId: userId, status: "pending" },
      { status: "rejected" },
      { new: true }
    );

    if (!connection) {
      res
        .status(404)
        .json({ message: "No pending connection request found." });
    }

    res.status(200).json({ message: "Connection request rejected." });
  } catch (error) {
    console.error("Error in rejectConnectionRequest:", error);
    next(error);
  }
};

export const getConnections = async (req: Request, res: Response, next: NextFunction): Promise<void>  => {
  try {
    const userId = (req.user as { _id: string })._id;

    // Fetch all connections where the status is "accepted"
    const connections = await ConnectionModel.find({
      $or: [{ userId }, { targetUserId: userId }],
      status: "accepted",
    }).populate("userId targetUserId", "name email");

    res.status(200).json({ connections });
  } catch (error) {
    console.error("Error in getConnections:", error);
    next(error);
  }
};

//get all request that user have get
export const getAllProposals = async (req: Request, res: Response, next: NextFunction): Promise<void>  => {
  try {
    const userId = (req.user as { _id: string })._id;

    // Fetch all connections where the status is "pending"
    const connectionRequests = await ConnectionModel.find({
      targetUserId: userId,
      status: "pending",
    }).populate("userId targetUserId", "contactInfo.email");

    res.status(200).json({ connectionRequests });
  } catch (error) {
    console.error("Error in getConnectionRequests:", error);
    next(error);
  }
};

// get all requests that user have sent
export const getAllSentProposals = async (req: Request, res: Response, next: NextFunction): Promise<void>  => {
  try {
    const userId = (req.user as { _id: string })._id;

    // Fetch all connections where the status is "pending"
    const sentConnectionRequests = await ConnectionModel.find({
      userId: userId,
      status: "pending",
    }).populate("userId targetUserId", "name email");

    res.status(200).json({ sentConnectionRequests });
  } catch (error) {
    console.error("Error in getSentConnectionRequests:", error);
    next(error);
  }
};

