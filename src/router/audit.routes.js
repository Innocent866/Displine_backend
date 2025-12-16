import { Router } from "express";
import { listAuditLogs } from "../controller/audit.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { adminOnly } from "../middleware/adminRole.js";

const router = Router();

router.use(protect, adminOnly);
router.get("/", listAuditLogs);

export default router;

