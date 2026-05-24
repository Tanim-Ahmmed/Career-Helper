import type { Request, Response } from "express";

import { catchAsync } from "../../utils/catch-async";
import { aiService } from "./ai.service";
import { sendResponse } from "../../utils/send-response";

const getStatus = catchAsync(async (_req: Request, res: Response) => {
  sendResponse(res, 200, {
    success: true,
    message: "Gemini AI integration is active.",
    data: await aiService.getStatus(),
  });
});

const generateContent = catchAsync(async (req: Request, res: Response) => {
  const result = await aiService.generateContent(req.user!._id.toString(), req.body);

  sendResponse(res, 200, {
    success: true,
    message: "AI response generated successfully.",
    data: result,
  });
});

const getMyHistory = catchAsync(async (req: Request, res: Response) => {
  const result = await aiService.getUserHistory(
    req.user!._id.toString(),
    (res.locals.validated?.query ?? req.query) as { limit?: number },
  );

  sendResponse(res, 200, {
    success: true,
    message: "AI history retrieved successfully.",
    data: result,
  });
});

const analyzeResume = catchAsync(async (req: Request, res: Response) => {
  const result = await aiService.analyzeResume(req.user!._id.toString(), req.body);

  sendResponse(res, 200, {
    success: true,
    message: "Resume analyzed successfully.",
    data: result,
  });
});

const generateCoverLetter = catchAsync(async (req: Request, res: Response) => {
  const result = await aiService.generateCoverLetter(req.user!._id.toString(), req.body);

  sendResponse(res, 200, {
    success: true,
    message: "Cover letter generated successfully.",
    data: result,
  });
});

const generateInterviewAssistant = catchAsync(async (req: Request, res: Response) => {
  const result = await aiService.generateInterviewAssistant(req.user!._id.toString(), req.body);

  sendResponse(res, 200, {
    success: true,
    message: "Interview prep generated successfully.",
    data: result,
  });
});

export const aiController = {
  getStatus,
  generateContent,
  getMyHistory,
  analyzeResume,
  generateCoverLetter,
  generateInterviewAssistant,
};
