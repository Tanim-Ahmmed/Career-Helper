import { api } from "@/services/api";
import type {
  AiHistoryEntry,
  AiStatusResponse,
  CoverLetterGeneratorPayload,
  CoverLetterResult,
  GenerateAiContentPayload,
  GenerateAiContentResponse,
  InterviewAssistantPayload,
  InterviewAssistantResult,
  ResumeAnalysisResult,
  ResumeAnalyzerPayload,
} from "@/types/ai";

export async function fetchAiStatus() {
  const { data } = await api.get<{
    success: boolean;
    message: string;
    data: AiStatusResponse;
  }>("/ai/status");

  return data.data;
}

export async function fetchAiHistory(limit = 20, feature?: string) {
  const { data } = await api.get<{
    success: boolean;
    message: string;
    data: AiHistoryEntry[];
  }>("/ai/history", {
    params: { limit, feature },
  });

  return data.data;
}

export async function generateAiContent(payload: GenerateAiContentPayload) {
  const { data } = await api.post<{
    success: boolean;
    message: string;
    data: GenerateAiContentResponse;
  }>("/ai/generate", payload);

  return data.data;
}

export async function analyzeResume(payload: ResumeAnalyzerPayload) {
  const { data } = await api.post<{
    success: boolean;
    message: string;
    data: ResumeAnalysisResult;
  }>("/ai/resume-analyzer", payload);

  return data.data;
}

export async function generateCoverLetter(payload: CoverLetterGeneratorPayload) {
  const { data } = await api.post<{
    success: boolean;
    message: string;
    data: CoverLetterResult;
  }>("/ai/cover-letter-generator", payload);

  return data.data;
}

export async function generateInterviewAssistant(payload: InterviewAssistantPayload) {
  const { data } = await api.post<{
    success: boolean;
    message: string;
    data: InterviewAssistantResult;
  }>("/ai/interview-assistant", payload);

  return data.data;
}
