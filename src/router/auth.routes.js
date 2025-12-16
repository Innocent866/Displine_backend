import { Router } from "express";
import { login, me, updateProfile } from "../controller/auth.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/login", login);
router.get("/me", protect, me);
router.put("/me", protect, updateProfile);

export default router;

