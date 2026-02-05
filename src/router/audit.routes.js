import { Router } from "express";
import { listAuditLogs, deleteAuditLog } from "../controller/audit.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { adminOnly } from "../middleware/adminRole.js";

const router = Router();

router.use(protect, adminOnly);
router.get("/", listAuditLogs);
router.delete("/:id", deleteAuditLog);

export default router;

