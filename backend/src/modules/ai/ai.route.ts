import { Router } from "express";

import { protect } from "../../middleware/auth";
import { validateRequest } from "../../middleware/validate-request";
import { aiController } from "./ai.controller";
import {
  aiHistoryQuerySchema,
  coverLetterGeneratorSchema,
  generateAiContentSchema,
  interviewAssistantSchema,
  resumeAnalyzerSchema,
} from "./ai.validation";

export const aiRoutes = Router();

aiRoutes.get("/status", aiController.getStatus);
aiRoutes.post("/generate", protect, validateRequest(generateAiContentSchema), aiController.generateContent);
aiRoutes.get("/history", protect, validateRequest(aiHistoryQuerySchema), aiController.getMyHistory);
aiRoutes.post(
  "/resume-analyzer",
  protect,
  validateRequest(resumeAnalyzerSchema),
  aiController.analyzeResume,
);
aiRoutes.post(
  "/cover-letter-generator",
  protect,
  validateRequest(coverLetterGeneratorSchema),
  aiController.generateCoverLetter,
);
aiRoutes.post(
  "/interview-assistant",
  protect,
  validateRequest(interviewAssistantSchema),
  aiController.generateInterviewAssistant,
);
