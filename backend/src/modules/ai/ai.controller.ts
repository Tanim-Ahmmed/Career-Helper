import type { Request, Response } from "express";
import { catchAsync } from "../../utils/catch-async";
import { aiService } from "./ai.service";
import { sendResponse } from "../../utils/send-response";

export const aiController = {
  generateJob: catchAsync(async (req: Request, res: Response) => {
    const result = await aiService.generateJob(req.user!, req.body);

    sendResponse(res, 200, {
      success: true,
      message: "Job generated successfully",
      data: result,
    });
  }),
  
  jobMatch: catchAsync(async (req: Request, res: Response) => {
    const result = await aiService.jobMatch(req.user!, req.body);
    
    sendResponse(res, 200, {
      success: true,
      message: "Job match completed",
      data: result,
    });
  }),

  generateCoverLetter: catchAsync(async (req: Request, res: Response) => {
    const result = await aiService.generateCoverLetter(req.user!, req.body);

    sendResponse(res, 200, {
      success: true,
      message: "Cover letter generated",
      data: result,
    });
  }),

  analyzeResume: catchAsync(async (req: Request, res: Response) => {
    const result = await aiService.analyzeResume(req.user!);

    sendResponse(res, 200, {
      success: true,
      message: "Resume analyzed successfully",
      data: result,
    });
  }),


  interviewAssistant: catchAsync(async (req: Request, res: Response) => {
    const result = await aiService.interviewAssistant(req.user!, req.body);

    sendResponse(res, 200, {
      success: true,
      message: "Interview questions generated",
      data: result,
    });
  }),

  getAiHistory :catchAsync(async (req: Request, res: Response) => {
    const result = await aiService.getAiHistory(req.user!, req.query);
  
    sendResponse(res, 200, {
      success: true,
      message: "AI history fetched successfully.",
      data: result,
    });
  })
};
