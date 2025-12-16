import { Router } from "express";
import {
  createPunishment,
  listPunishments,
  updatePunishment,
  deletePunishment,
} from "../controller/punishment.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { adminOnly } from "../middleware/adminRole.js";

const router = Router();

router.use(protect);

router.get("/", listPunishments);
router.post("/", adminOnly, createPunishment);
router.put("/:id", adminOnly, updatePunishment);
router.delete("/:id", adminOnly, deletePunishment);

export default router;

