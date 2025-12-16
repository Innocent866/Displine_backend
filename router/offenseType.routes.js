import { Router } from "express";
import {
  createOffenseType,
  listOffenseTypes,
  updateOffenseType,
  deleteOffenseType,
} from "../controller/offenseType.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { adminOnly } from "../middleware/adminRole.js";

const router = Router();

router.use(protect);

router.get("/", listOffenseTypes);
router.post("/", adminOnly, createOffenseType);
router.put("/:id", adminOnly, updateOffenseType);
router.delete("/:id", adminOnly, deleteOffenseType);

export default router;

