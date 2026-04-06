import { Router } from "express";
import { protect } from "../middleware/auth.middleware.js";
import { getNotifications, markAsRead } from "../controller/notification.controller.js";

const router = Router();
router.use(protect);
router.get("/", getNotifications);
router.patch("/read", markAsRead);

export default router;
