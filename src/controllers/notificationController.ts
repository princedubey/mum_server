import { NextFunction, Request, Response } from "express";
import NotificationModel from "../models/Notification";

export const getNotifications = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = (req.user as { _id: string })._id;

        // Retrieve all notifications for the user
        const notifications = await NotificationModel.find({ userId })
            .sort({ createdAt: -1 })
            .populate("senderId", "name email");

        res.status(200).json({ notifications });
    } catch (error) {
        console.error("Error in getNotifications:", error);
        next(error);
    }
};

export const markNotificationAsRead = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { notificationId } = req.params;

        const notification = await NotificationModel.findByIdAndUpdate(
            notificationId,
            { read: true },
            { new: true }
        );

        if (!notification) {
            res.status(404).json({ message: "Notification not found." });
        }

        res.status(200).json({ message: "Notification marked as read." });
    } catch (error) {
        console.error("Error in markNotificationAsRead:", error);
        next(error);
    }
};

export const markAllNotificationsAsRead = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = (req.user as { _id: string })._id;

        await NotificationModel.updateMany({ userId, read: false }, { read: true });

        res.status(200).json({ message: "All notifications marked as read." });
    } catch (error) {
        console.error("Error in markAllNotificationsAsRead:", error);
        next(error);
    }
};
