import { Router } from "express";

import { protect, restrictTo } from "../../middleware/auth";
// import { validateRequest } from "../../middleware/validate-request";
import { aiController } from "./ai.controller";
// import {
//   aiHistoryQuerySchema,
//   coverLetterGeneratorSchema,
//   generateAiContentSchema,
//   interviewAssistantSchema,
//   resumeAnalyzerSchema,
// } from "./ai.validation";

export const aiRoutes = Router();

/* -------------------- JOB GENERATOR -------------------- */
aiRoutes.post("/job-generator", protect, restrictTo("recruiter", "admin"), aiController.generateJob,);

/* -------------------- JOB MATCH -------------------- */
aiRoutes.post("/job-match", protect, restrictTo("user", "recruiter", "admin"), aiController.jobMatch,);

/* -------------------- COVER LETTER -------------------- */
aiRoutes.post("/generate-cover-letter", protect, restrictTo("user", "recruiter", "admin"), aiController.generateCoverLetter,);

/* -------------------- RESUME ANALYZER -------------------- */
aiRoutes.post("/resume-analyzer", protect, restrictTo("user", "recruiter", "admin"), aiController.analyzeResume,);

/* -------------------- INTERVIEW ASSISTANT -------------------- */
aiRoutes.post("/interview-assistant", protect, restrictTo("user", "recruiter", "admin"), aiController.interviewAssistant,);

/* -------------------- AI HISTORY -------------------- */
aiRoutes.get("/history", protect, aiController.getAiHistory,);
