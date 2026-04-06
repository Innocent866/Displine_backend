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

// Regular protection for viewing
router.use(protect);

router.get("/", getAllMembers);
router.get("/:id", getMemberById);

// Admin-only protection for modifications
router.post("/", adminOnly, createMember);
router.put("/:id", adminOnly, updateMember);
router.delete("/:id", adminOnly, deleteMember);

export default router;
