import "dotenv/config";
import express from "express";
import cors from "cors";
import connectDB from "./db/db_connection.js";
import authRoutes from "./router/auth.routes.js";
import memberRoutes from "./router/member.routes.js";
import studentRoutes from "./router/student.routes.js";
import offenseTypeRoutes from "./router/offenseType.routes.js";
import punishmentRoutes from "./router/punishment.routes.js";
import caseRoutes from "./router/case.routes.js";
import auditRoutes from "./router/audit.routes.js";

const PORT = process.env.PORT || 5000;
const app = express();

app.use(express.json());
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
    credentials: true,
  })
);

app.get("/", (_req, res) => {
  res.send("Disciplinary System API running...");
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/members", memberRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/offense-types", offenseTypeRoutes);
app.use("/api/punishments", punishmentRoutes);
app.use("/api/cases", caseRoutes);
app.use("/api/audit-logs", auditRoutes);

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(`Error: ${error}`);
  });