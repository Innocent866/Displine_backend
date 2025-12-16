import { Router } from "express";
import {
  createMember,
  getAllMembers,
  getMemberById,
  updateMember,
  deleteMember,
} from "../controller/member.js";
import { protect } from "../middleware/auth.middleware.js";
import { adminOnly } from "../middleware/adminRole.js";

const router = Router();

router.use(protect, adminOnly);

router.post("/", createMember);
router.get("/", getAllMembers);
router.get("/:id", getMemberById);
router.put("/:id", updateMember);
router.delete("/:id", deleteMember);

export default router;

