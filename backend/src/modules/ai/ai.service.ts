import { GoogleGenAI, HarmBlockThreshold, HarmCategory } from "@google/genai";

import { env } from "../../config/env";
import { AppError } from "../../utils/app-error";
import { usersModel } from "../users/users.model";
import type {
  AiHistoryQuery,
  CoverLetterGeneratorPayload,
  CoverLetterResult,
  GenerateAiContentPayload,
  InterviewAssistantPayload,
  InterviewAssistantResult,
  ResumeAnalysisResult,
  ResumeAnalyzerPayload,
  IAiHistory,
} from "./ai.interface";
import { aiHistoryModel } from "./ai.model";

const DEFAULT_GEMINI_MODEL = "gemini-2.0-flash";

const geminiClient = new GoogleGenAI({
  apiKey: env.GEMINI_API_KEY,
});

const featureInstructions: Record<GenerateAiContentPayload["feature"], string> = {
  general:
    "You are the AI assistant inside AI Career Helper. Give practical, concise, professional support for career growth.",
  "resume-analyzer":
    "You are the resume analysis engine for AI Career Helper. Focus on ATS fit, clarity, impact, keyword coverage, and formatting.",
  "cover-letter-generator":
    "You are the cover letter writing engine for AI Career Helper. Produce polished, job-targeted, truthful, professional writing.",
  "interview-assistant":
    "You are the interview coaching engine for AI Career Helper. Generate realistic, high-signal interview help tailored to the role and experience.",
};

function buildPrompt(payload: GenerateAiContentPayload) {
  const contextSection = payload.context?.length
    ? `\n\nContext:\n${payload.context.map((item, index) => `${index + 1}. ${item}`).join("\n")}`
    : "";

  return `${payload.prompt}${contextSection}`;
}

async function createHistoryEntry(payload: Omit<IAiHistory, "userId"> & { userId: string }) {
  await aiHistoryModel.create({
    ...payload,
    userId: payload.userId,
  });
}

async function generateContent(userId: string, payload: GenerateAiContentPayload) {
  const prompt = buildPrompt(payload);
  const systemInstruction = payload.systemInstruction?.trim() || featureInstructions[payload.feature];

  try {
    const response = await geminiClient.models.generateContent({
      model: DEFAULT_GEMINI_MODEL,
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.4,
        safetySettings: [
          {
            category: HarmCategory.HARM_CATEGORY_HARASSMENT,
            threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
          },
          {
            category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
          },
        ],
      },
    });

    const responseText = response.text?.trim();

    if (!responseText) {
      throw new AppError("Gemini returned an empty response.", 502);
    }

    await Promise.all([
      createHistoryEntry({
        userId,
        feature: payload.feature,
        model: DEFAULT_GEMINI_MODEL,
        prompt: payload.prompt,
        responseText,
        status: "success",
        metadata: payload.metadata ?? {},
      }),
      usersModel.findByIdAndUpdate(userId, { $inc: { aiUsageCount: 1 } }),
    ]);

    return {
      feature: payload.feature,
      model: DEFAULT_GEMINI_MODEL,
      responseText,
    };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "An unexpected Gemini integration error occurred.";

    await createHistoryEntry({
      userId,
      feature: payload.feature,
      model: DEFAULT_GEMINI_MODEL,
      prompt: payload.prompt,
      responseText: "",
      status: "error",
      errorMessage: message,
      metadata: payload.metadata ?? {},
    });

    throw new AppError(`Gemini request failed: ${message}`, 502);
  }
}

async function getUserHistory(userId: string, query: AiHistoryQuery) {
  const limit = query.limit ?? 20;
  const filter = query.feature ? { userId, feature: query.feature } : { userId };

  return aiHistoryModel.find(filter).sort({ createdAt: -1 }).limit(limit);
}

function buildResumeAnalyzerPrompt(payload: ResumeAnalyzerPayload) {
  const roleSection = payload.targetJobTitle
    ? `\nTarget job title:\n${payload.targetJobTitle}`
    : "";
  const jobDescriptionSection = payload.targetJobDescription
    ? `\nTarget job description:\n${payload.targetJobDescription}`
    : "";
  const targetSkillsSection = payload.targetSkills?.length
    ? `\nTarget skills:\n${payload.targetSkills.join(", ")}`
    : "";

  return `Analyze the following resume for ATS fit and hiring clarity.

Resume:
${payload.resumeText}${roleSection}${jobDescriptionSection}${targetSkillsSection}

Return only valid JSON that matches the requested schema.`;
}

function buildCoverLetterPrompt(payload: CoverLetterGeneratorPayload) {
  const applicantName = payload.applicantName?.trim() || "The candidate";
  const hiringManagerLine = payload.hiringManagerName
    ? `Hiring manager: ${payload.hiringManagerName}`
    : "Hiring manager: not provided";
  const yearsLine =
    payload.yearsOfExperience !== undefined
      ? `Years of experience: ${payload.yearsOfExperience}`
      : "Years of experience: not provided";
  const skillsLine = payload.keySkills?.length
    ? `Key skills: ${payload.keySkills.join(", ")}`
    : "Key skills: not provided";
  const achievementsLine = payload.achievements?.length
    ? `Achievements:\n- ${payload.achievements.join("\n- ")}`
    : "Achievements: not provided";
  const jobDescriptionLine = payload.jobDescription
    ? `Job description:\n${payload.jobDescription}`
    : "Job description: not provided";
  const experienceLine = payload.relevantExperience
    ? `Relevant experience:\n${payload.relevantExperience}`
    : "Relevant experience: not provided";
  const additionalContextLine = payload.additionalContext
    ? `Additional context:\n${payload.additionalContext}`
    : "Additional context: not provided";

  return `Create a concise, truthful, role-specific cover letter.

Candidate name: ${applicantName}
Target role: ${payload.jobTitle}
Company: ${payload.companyName}
Preferred tone: ${payload.tone ?? "professional"}
${hiringManagerLine}
${yearsLine}
${skillsLine}
${achievementsLine}
${jobDescriptionLine}
${experienceLine}
${additionalContextLine}

Requirements:
- Keep the letter professional, specific, and believable.
- Avoid generic filler and exaggerated claims.
- Mention alignment with the company and role.
- Use 3 body paragraphs at most.
- Return only valid JSON that matches the requested schema.`;
}

function buildInterviewAssistantPrompt(payload: InterviewAssistantPayload) {
  const companyLine = payload.companyName ? `Company: ${payload.companyName}` : "Company: not provided";
  const experienceLine = payload.experienceLevel
    ? `Experience level: ${payload.experienceLevel}`
    : "Experience level: not provided";
  const focusLine = payload.focusAreas?.length
    ? `Focus areas: ${payload.focusAreas.join(", ")}`
    : "Focus areas: not provided";
  const highlightsLine = payload.resumeHighlights?.length
    ? `Resume highlights:\n- ${payload.resumeHighlights.join("\n- ")}`
    : "Resume highlights: not provided";
  const jobDescriptionLine = payload.jobDescription
    ? `Job description:\n${payload.jobDescription}`
    : "Job description: not provided";

  return `Prepare interview coaching for a job candidate.

Role: ${payload.jobTitle}
${companyLine}
${experienceLine}
Interview type: ${payload.interviewType ?? "mixed"}
${focusLine}
${highlightsLine}
${jobDescriptionLine}
Number of questions required: ${payload.numberOfQuestions ?? 5}

Requirements:
- Tailor the questions to the role and interview type.
- Provide the reason each question matters.
- Give practical talking points, not full scripts.
- Include preparation tips and likely red flags to avoid.
- Return only valid JSON that matches the requested schema.`;
}

async function analyzeResume(userId: string, payload: ResumeAnalyzerPayload) {
  const prompt = buildResumeAnalyzerPrompt(payload);

  try {
    const response = await geminiClient.models.generateContent({
      model: DEFAULT_GEMINI_MODEL,
      contents: prompt,
      config: {
        systemInstruction:
          "You are the resume analysis engine for AI Career Helper. Evaluate ATS alignment, missing skills, formatting, grammar, and keyword optimization. Be candid, actionable, and concise. Return structured JSON only.",
        temperature: 0.25,
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            atsScore: { type: "number" },
            summary: { type: "string" },
            strengths: { type: "array", items: { type: "string" } },
            missingSkills: { type: "array", items: { type: "string" } },
            formattingIssues: { type: "array", items: { type: "string" } },
            grammarIssues: { type: "array", items: { type: "string" } },
            keywordOptimization: { type: "array", items: { type: "string" } },
            recommendedImprovements: { type: "array", items: { type: "string" } },
            suggestedKeywords: { type: "array", items: { type: "string" } },
          },
          required: [
            "atsScore",
            "summary",
            "strengths",
            "missingSkills",
            "formattingIssues",
            "grammarIssues",
            "keywordOptimization",
            "recommendedImprovements",
            "suggestedKeywords",
          ],
        },
        safetySettings: [
          {
            category: HarmCategory.HARM_CATEGORY_HARASSMENT,
            threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
          },
          {
            category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
          },
        ],
      },
    });

    const responseText = response.text?.trim();

    if (!responseText) {
      throw new AppError("Gemini returned an empty resume analysis.", 502);
    }

    const parsed = JSON.parse(responseText) as ResumeAnalysisResult;
    const result: ResumeAnalysisResult = {
      atsScore: Math.max(0, Math.min(100, Number(parsed.atsScore) || 0)),
      summary: parsed.summary || "No summary returned.",
      strengths: parsed.strengths ?? [],
      missingSkills: parsed.missingSkills ?? [],
      formattingIssues: parsed.formattingIssues ?? [],
      grammarIssues: parsed.grammarIssues ?? [],
      keywordOptimization: parsed.keywordOptimization ?? [],
      recommendedImprovements: parsed.recommendedImprovements ?? [],
      suggestedKeywords: parsed.suggestedKeywords ?? [],
    };

    await Promise.all([
      createHistoryEntry({
        userId,
        feature: "resume-analyzer",
        model: DEFAULT_GEMINI_MODEL,
        prompt: payload.resumeText,
        responseText: JSON.stringify(result),
        status: "success",
        metadata: {
          targetJobTitle: payload.targetJobTitle ?? "",
          targetSkillsCount: payload.targetSkills?.length ?? 0,
          hasJobDescription: Boolean(payload.targetJobDescription),
        },
      }),
      usersModel.findByIdAndUpdate(userId, { $inc: { aiUsageCount: 1 } }),
    ]);

    return result;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "An unexpected resume analysis error occurred.";

    await createHistoryEntry({
      userId,
      feature: "resume-analyzer",
      model: DEFAULT_GEMINI_MODEL,
      prompt: payload.resumeText,
      responseText: "",
      status: "error",
      errorMessage: message,
      metadata: {
        targetJobTitle: payload.targetJobTitle ?? "",
        targetSkillsCount: payload.targetSkills?.length ?? 0,
        hasJobDescription: Boolean(payload.targetJobDescription),
      },
    });

    throw new AppError(`Resume analysis failed: ${message}`, 502);
  }
}

async function generateCoverLetter(userId: string, payload: CoverLetterGeneratorPayload) {
  const prompt = buildCoverLetterPrompt(payload);

  try {
    const response = await geminiClient.models.generateContent({
      model: DEFAULT_GEMINI_MODEL,
      contents: prompt,
      config: {
        systemInstruction:
          "You are the cover letter writing engine for AI Career Helper. Write concise, job-targeted, truthful, professional cover letters. Return structured JSON only.",
        temperature: 0.5,
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            headline: { type: "string" },
            greeting: { type: "string" },
            opening: { type: "string" },
            bodyParagraphs: { type: "array", items: { type: "string" } },
            closing: { type: "string" },
            signature: { type: "string" },
            keyThemes: { type: "array", items: { type: "string" } },
            fullLetter: { type: "string" },
          },
          required: [
            "headline",
            "greeting",
            "opening",
            "bodyParagraphs",
            "closing",
            "signature",
            "keyThemes",
            "fullLetter",
          ],
        },
      },
    });

    const responseText = response.text?.trim();

    if (!responseText) {
      throw new AppError("Gemini returned an empty cover letter.", 502);
    }

    const parsed = JSON.parse(responseText) as CoverLetterResult;
    const result: CoverLetterResult = {
      headline: parsed.headline || `${payload.jobTitle} cover letter`,
      greeting: parsed.greeting || "Dear Hiring Team,",
      opening: parsed.opening || "",
      bodyParagraphs: parsed.bodyParagraphs?.filter(Boolean) ?? [],
      closing: parsed.closing || "",
      signature: parsed.signature || (payload.applicantName?.trim() || "Candidate"),
      keyThemes: parsed.keyThemes?.filter(Boolean) ?? [],
      fullLetter: parsed.fullLetter || "",
    };

    await Promise.all([
      createHistoryEntry({
        userId,
        feature: "cover-letter-generator",
        model: DEFAULT_GEMINI_MODEL,
        prompt,
        responseText: JSON.stringify(result),
        status: "success",
        metadata: {
          jobTitle: payload.jobTitle,
          companyName: payload.companyName,
          tone: payload.tone ?? "professional",
          hasJobDescription: Boolean(payload.jobDescription),
          keySkillsCount: payload.keySkills?.length ?? 0,
        },
      }),
      usersModel.findByIdAndUpdate(userId, { $inc: { aiUsageCount: 1 } }),
    ]);

    return result;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "An unexpected cover letter error occurred.";

    await createHistoryEntry({
      userId,
      feature: "cover-letter-generator",
      model: DEFAULT_GEMINI_MODEL,
      prompt,
      responseText: "",
      status: "error",
      errorMessage: message,
      metadata: {
        jobTitle: payload.jobTitle,
        companyName: payload.companyName,
        tone: payload.tone ?? "professional",
      },
    });

    throw new AppError(`Cover letter generation failed: ${message}`, 502);
  }
}

async function generateInterviewAssistant(userId: string, payload: InterviewAssistantPayload) {
  const prompt = buildInterviewAssistantPrompt(payload);

  try {
    const response = await geminiClient.models.generateContent({
      model: DEFAULT_GEMINI_MODEL,
      contents: prompt,
      config: {
        systemInstruction:
          "You are the interview coaching engine for AI Career Helper. Generate practical, high-signal interview preparation in structured JSON only.",
        temperature: 0.45,
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            summary: { type: "string" },
            questions: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  question: { type: "string" },
                  intent: { type: "string" },
                  sampleTalkingPoints: { type: "array", items: { type: "string" } },
                },
                required: ["question", "intent", "sampleTalkingPoints"],
              },
            },
            preparationTips: { type: "array", items: { type: "string" } },
            redFlags: { type: "array", items: { type: "string" } },
            finalAdvice: { type: "string" },
          },
          required: ["summary", "questions", "preparationTips", "redFlags", "finalAdvice"],
        },
      },
    });

    const responseText = response.text?.trim();

    if (!responseText) {
      throw new AppError("Gemini returned an empty interview prep response.", 502);
    }

    const parsed = JSON.parse(responseText) as InterviewAssistantResult;
    const result: InterviewAssistantResult = {
      summary: parsed.summary || "No summary returned.",
      questions:
        parsed.questions?.map((item) => ({
          question: item.question || "Question unavailable",
          intent: item.intent || "Intent unavailable",
          sampleTalkingPoints: item.sampleTalkingPoints?.filter(Boolean) ?? [],
        })) ?? [],
      preparationTips: parsed.preparationTips?.filter(Boolean) ?? [],
      redFlags: parsed.redFlags?.filter(Boolean) ?? [],
      finalAdvice: parsed.finalAdvice || "",
    };

    await Promise.all([
      createHistoryEntry({
        userId,
        feature: "interview-assistant",
        model: DEFAULT_GEMINI_MODEL,
        prompt,
        responseText: JSON.stringify(result),
        status: "success",
        metadata: {
          jobTitle: payload.jobTitle,
          companyName: payload.companyName ?? "",
          interviewType: payload.interviewType ?? "mixed",
          numberOfQuestions: payload.numberOfQuestions ?? 5,
        },
      }),
      usersModel.findByIdAndUpdate(userId, { $inc: { aiUsageCount: 1 } }),
    ]);

    return result;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "An unexpected interview assistant error occurred.";

    await createHistoryEntry({
      userId,
      feature: "interview-assistant",
      model: DEFAULT_GEMINI_MODEL,
      prompt,
      responseText: "",
      status: "error",
      errorMessage: message,
      metadata: {
        jobTitle: payload.jobTitle,
        companyName: payload.companyName ?? "",
        interviewType: payload.interviewType ?? "mixed",
      },
    });

    throw new AppError(`Interview assistant generation failed: ${message}`, 502);
  }
}

async function getStatus() {
  const historyCount = await aiHistoryModel.countDocuments();

  return {
    module: "ai",
    ready: true,
    provider: "gemini",
    sdk: "@google/genai",
    defaultModel: DEFAULT_GEMINI_MODEL,
    historyCount,
    features: [
      "provider-integration",
      "protected-generation-endpoint",
      "ai-history-persistence",
      "usage-tracking",
      "resume-analyzer",
      "cover-letter-generator",
      "interview-assistant",
    ],
    nextStep:
      "Gemini-backed resume analysis, cover letters, and interview coaching are now available through protected feature-specific endpoints.",
  };
}

export const aiService = {
  getStatus,
  generateContent,
  getUserHistory,
  analyzeResume,
  generateCoverLetter,
  generateInterviewAssistant,
};
