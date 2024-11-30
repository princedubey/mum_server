import express from "express";
import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "../controllers/notificationController";
import { authenticateToken } from "../middlewares/authHandler";

const router = express.Router();

router.get("/notifications", 
    [
        authenticateToken,
    ], 
    getNotifications
);

router.put("/notifications/:notificationId/read", 
    [
        authenticateToken,
    ], 
    markNotificationAsRead
);

router.put("/notifications/read-all", 
    [
        authenticateToken,
    ], 
    markAllNotificationsAsRead
);

export default router;
