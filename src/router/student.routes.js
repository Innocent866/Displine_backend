import { Router } from "express";
import {
  createStudent,
  getStudents,
  getStudent,
  updateStudent,
  deleteStudent,
} from "../controller/student.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { adminOnly } from "../middleware/adminRole.js";

const router = Router();

router.use(protect);

router.get("/", getStudents);
router.get("/:id", getStudent);

router.post("/", adminOnly, createStudent);
router.put("/:id", adminOnly, updateStudent);
router.delete("/:id", adminOnly, deleteStudent);

export default router;

