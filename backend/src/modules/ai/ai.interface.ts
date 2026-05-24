import type { HydratedDocument, Types } from "mongoose";

export type AiFeature =
  | "general"
  | "resume-analyzer"
  | "cover-letter-generator"
  | "interview-assistant";

export type AiHistoryStatus = "success" | "error";

export interface IAiHistory {
  userId: Types.ObjectId;
  feature: AiFeature;
  model: string;
  prompt: string;
  responseText: string;
  status: AiHistoryStatus;
  errorMessage?: string;
  metadata?: Record<string, string | number | boolean | null>;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface GenerateAiContentPayload {
  feature: AiFeature;
  prompt: string;
  context?: string[];
  systemInstruction?: string;
  metadata?: Record<string, string | number | boolean | null>;
}

export interface ResumeAnalyzerPayload {
  resumeText: string;
  targetJobTitle?: string;
  targetJobDescription?: string;
  targetSkills?: string[];
}

export interface ResumeAnalysisResult {
  atsScore: number;
  summary: string;
  strengths: string[];
  missingSkills: string[];
  formattingIssues: string[];
  grammarIssues: string[];
  keywordOptimization: string[];
  recommendedImprovements: string[];
  suggestedKeywords: string[];
}

export interface CoverLetterGeneratorPayload {
  applicantName?: string;
  jobTitle: string;
  companyName: string;
  hiringManagerName?: string;
  tone?: "professional" | "confident" | "warm";
  yearsOfExperience?: number;
  jobDescription?: string;
  keySkills?: string[];
  achievements?: string[];
  relevantExperience?: string;
  additionalContext?: string;
}

export interface CoverLetterResult {
  headline: string;
  greeting: string;
  opening: string;
  bodyParagraphs: string[];
  closing: string;
  signature: string;
  keyThemes: string[];
  fullLetter: string;
}

export interface InterviewAssistantPayload {
  jobTitle: string;
  companyName?: string;
  experienceLevel?: string;
  interviewType?: "technical" | "behavioral" | "hr" | "mixed";
  jobDescription?: string;
  focusAreas?: string[];
  resumeHighlights?: string[];
  numberOfQuestions?: number;
}

export interface InterviewQuestion {
  question: string;
  intent: string;
  sampleTalkingPoints: string[];
}

export interface InterviewAssistantResult {
  summary: string;
  questions: InterviewQuestion[];
  preparationTips: string[];
  redFlags: string[];
  finalAdvice: string;
}

export interface AiHistoryQuery {
  limit?: number;
  feature?: AiFeature;
}

export type AiHistoryDocument = HydratedDocument<IAiHistory>;
