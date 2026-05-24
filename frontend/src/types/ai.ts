export type AiFeature =
  | "general"
  | "resume-analyzer"
  | "cover-letter-generator"
  | "interview-assistant";

export type AiHistoryStatus = "success" | "error";

export interface AiStatusResponse {
  module: "ai";
  ready: boolean;
  provider: "gemini";
  sdk: string;
  defaultModel: string;
  historyCount: number;
  features: string[];
  nextStep: string;
}

export interface AiHistoryEntry {
  _id: string;
  userId: string;
  feature: AiFeature;
  model: string;
  prompt: string;
  responseText: string;
  status: AiHistoryStatus;
  errorMessage?: string;
  metadata?: Record<string, string | number | boolean | null>;
  createdAt: string;
  updatedAt: string;
}

export interface GenerateAiContentPayload {
  feature: AiFeature;
  prompt: string;
  context?: string[];
  systemInstruction?: string;
  metadata?: Record<string, string | number | boolean | null>;
}

export interface GenerateAiContentResponse {
  feature: AiFeature;
  model: string;
  responseText: string;
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

export type CoverLetterTone = "professional" | "confident" | "warm";

export interface CoverLetterGeneratorPayload {
  applicantName?: string;
  jobTitle: string;
  companyName: string;
  hiringManagerName?: string;
  tone?: CoverLetterTone;
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

export type InterviewType = "technical" | "behavioral" | "hr" | "mixed";

export interface InterviewAssistantPayload {
  jobTitle: string;
  companyName?: string;
  experienceLevel?: string;
  interviewType?: InterviewType;
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
