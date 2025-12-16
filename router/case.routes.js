import { Router } from "express";
import {
  createCase,
  listCases,
  getCase,
  updateCase,
  resolveCase,
  approveCase,
  deleteCase,
} from "../controller/case.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = Router();

router.use(protect);

router.get("/", listCases);
router.post("/", createCase);
router.get("/:id", getCase);
router.put("/:id", updateCase);
router.post("/:id/resolve", resolveCase);
router.post("/:id/approve", approveCase);
router.delete("/:id", deleteCase);

export default router;

