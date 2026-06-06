import { GoogleGenerativeAI } from "@google/generative-ai";
import { env } from "../../config/env";
import { AppError } from "../../utils/app-error";
import { usersModel } from "../users/users.model";

const genAI = new GoogleGenerativeAI(
  env.GEMINI_API_KEY
);

const DEFAULT_GEMINI_MODEL = "gemini-2.0-flash";

const model = genAI.getGenerativeModel({
  model: DEFAULT_GEMINI_MODEL,
  generationConfig: {
    responseMimeType: "application/json"
  }
});

// Helper function to pause execution
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function generateContent(prompt: string, retries = 3, delayMs = 5000): Promise<string> {
  try {
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    if (!responseText) {
      throw new AppError("Gemini returned an empty response.", 502);
    }

    return responseText;
  } catch (error: any) {
    // Check if it's a 429 Rate Limit error
    if (error.status === 429 && retries > 0) {
      console.warn(`[Gemini API] Rate limit hit. Retrying in ${delayMs / 1000}s... (${retries} retries left)`);
      await delay(delayMs);
      return generateContent(prompt, retries - 1, delayMs * 2); // Exponential backoff
    }

    throw error; // If out of retries or different error, throw it
  }
}

// import type {
//   AiHistoryQuery,
//   CoverLetterGeneratorPayload,
//   CoverLetterResult,
//   GenerateAiContentPayload,
//   InterviewAssistantPayload,
//   InterviewAssistantResult,
//   ResumeAnalysisResult,
//   ResumeAnalyzerPayload,
//   IAiHistory,
// } from "./ai.interface";

import { aiHistoryModel } from "./ai.model";
import { jobsModel } from "../jobs/jobs.model";
import { applicationsModel } from "../applications/applications.model";

export async function parseGeminiJson(prompt: string) {
  const responseText = await generateContent(prompt);
  return JSON.parse(responseText);
}

export async function generateJob(
  user: any,
  payload: any) {
  const prompt = `
Generate a professional job post.

Title: ${payload.title}
Employment Type: ${payload.employmentType}
Workplace Type: ${payload.workplaceType}

Return ONLY valid JSON.

{
  "shortDescription": "",
  "description": "",
  "skillsRequired": [],
  "responsibilities": [],
  "requirements": [],
  "benefits": [],
  "tags": []
}
`;
  try {
    const data = await parseGeminiJson(prompt);

    await Promise.all([
      aiHistoryModel.create({
        userId: user._id,
        role: user.role,
        feature: "job-generator",
        model: DEFAULT_GEMINI_MODEL,
        prompt,
        responseText: JSON.stringify(data),
        status: "success",
        inputType: "",
        tokensUsed: 1,
        cost: 0
      }),
      usersModel.findByIdAndUpdate(user._id, { $inc: { aiUsageCount: 1 } }),
    ])

    return data;
  } catch (error: any) {
    console.error(error);
    await aiHistoryModel.create({
      userId: user._id,
      role: user.role,
      feature: "job-generator",
      model: "gemini-2.0-flash",
      prompt,
      responseText: "",
      status: "error",
      errorMessage: error.message,
      inputType: "",
      tokensUsed: 0,
      cost: 0
    });

    throw error;
  }
}

/* -------------------- JOB MATCH -------------------- */
export async function jobMatch(
  user: any,
  payload: any,) {
  const prompt = `
Match candidate with job.

Candidate Skills:
${payload.skills}

Job Description:
${payload.jobDescription}

Return ONLY JSON:

{
  "matchScore": 0,
  "matchedSkills": [],
  "missingSkills": [],
  "recommendation": ""
}
`;

  const data = await parseGeminiJson(prompt);

  await Promise.all([
    aiHistoryModel.create({
      userId: user._id,
      role: user.role,
      feature: "job-match",
      model: DEFAULT_GEMINI_MODEL,
      prompt,
      responseText: JSON.stringify(data),
      status: "success",
      inputType: "text",
      tokensUsed: 1,
      cost: 0,
    }),
    usersModel.findByIdAndUpdate(user._id, {
      $inc: { aiUsageCount: 1 },
    }),
  ]);

  return data;
}

/* -------------------- COVER LETTER -------------------- */
export async function generateCoverLetter(
  user: any,
  payload: any,
) {
  const jobId = payload.jobId;
  const job = await jobsModel.findById(jobId);

  if (!job) {
    throw new AppError("Requested job profile not found.", 404);
  }

  // জবের অ্যারে ডেটাগুলোকে কমা দিয়ে জয়েন করে প্রম্পটের উপযোগী টেক্সট করা
  const skillsText = job.skillsRequired?.join(", ") || "Not specified";
  const requirementsText = job.requirements?.join("\n- ") || "Not specified";
  const responsibilitiesText = job.responsibilities?.join("\n- ") || "Not specified";

  const prompt = `
You are an expert career coach writing a highly tailored, professional cover letter.

Applicant Information:
- Name: ${user.name || "A qualified professional"}
- Email: ${user.email || ""}
- Phone: ${user.name || ""}
- Skills: ${user.skills?.join(", ") || "Relevant industry skills"}

Target Job Details:
- Job Title: ${job.title}
- Company Name: ${job.company}
- Workplace Type: ${job.workplaceType} (e.g., remote, hybrid, on-site)
- Employment Type: ${job.employmentType}
- Job Description: ${job.shortDescription}

Key Skills Required:
${skillsText}

Core Job Requirements:
- ${requirementsText}

Core Responsibilities:
- ${responsibilitiesText}

Instructions:
1. Write a compelling, professional cover letter matching the applicant's profile to the job's requirements.
2. Highlight how the applicant's skills can solve the company's needs based on the responsibilities.
3. Keep the tone confident, clean, and engaging. Do not use placeholders like "[Insert Date]".

Return ONLY a valid JSON object following this schema:
{
  "coverLetter": "The complete cover letter text with proper spacing and newlines."
}
`;

  const data = await parseGeminiJson(prompt);

  await Promise.all([
    aiHistoryModel.create({
      userId: user._id,
      role: user.role,
      feature: "cover-letter-generator",
      model: DEFAULT_GEMINI_MODEL,
      prompt,
      responseText: JSON.stringify(data),
      status: "success",
      inputType: "text",
      tokensUsed: 1, // টোকেন কাউন্টার ইমপ্লিমেন্ট করলে এখানে ডাইনামিক ভ্যালু বসাতে পারেন
      cost: 0,
    }),
    usersModel.findByIdAndUpdate(user._id, {
      $inc: { aiUsageCount: 1 },
    }),
  ]);

  return data;
}

/* -------------------- RESUME ANALYZER -------------------- */
export async function analyzeResume(user: any) {
  // ১. এমপ্লয়ারের সব ওপেন জব খুঁজে বের করা
  const employerJobs = await jobsModel.find({ createdBy: user._id, status: "published" });

  if (employerJobs.length === 0) {
    throw new Error("No active job listings found for your account.");
  }

  let totalScanned = 0;
  let totalShortlisted = 0;
  let totalRejected = 0;
  const detailedReport = [];

  // ২. প্রথম লুপ: প্রতিটা জব স্ক্যান
  for (const job of employerJobs) {
    const pendingApplications = await applicationsModel
      .find({ jobId: job._id, status: "pending" })
      .populate("userId", "name email skills"); // এখানে শুধু ইউজারের বেসিক ডেটা পপুলেট হবে

    if (pendingApplications.length === 0) continue;

    const currentJobReport = {
      jobTitle: job.title,
      candidatesEvaluated: [] as any[]
    };

    // ৩. দ্বিতীয় লুপ: প্রতিটা জবের ভেতরের ক্যান্ডিডেটদের রেজুমি টেক্সট স্ক্যান
    for (const app of pendingApplications) {
      try {
        // 🎯 ফিক্স ১: যদি রেজুমি টেক্সট না থাকে, তবে লুপ ব্রেক না করে পরের ক্যান্ডিডেটে যাবে (continue)
        // নোট: যদি resumeText ইউজার মডেলে থাকে তবে (app.userId as any)?.resumeText লিখবেন
        if (!app.resumeText || app.resumeText.trim().length === 0) {
          console.warn(`Application ${app._id} skipped due to missing resume text.`);
          continue; 
        }

        totalScanned++;

        // 🎯 ফিক্স ২: user.resumeText এর জায়গায় app.resumeText হবে
        const prompt = `
You are an advanced ATS (Applicant Tracking System) parser. Your task is to evaluate the candidate's core Resume Text against the defined Job Profile. Ignore generic motivational sentences. Focus strictly on listed experiences, hard skills, project tech-stacks, and certifications.

[JOB POSITION]
Title: ${job.title}
Core Requirements: ${job.requirements?.join(" ") || "Not specified"}
Key Skills Needed: ${job.skillsRequired?.join(", ") || "Not specified"}

[CANDIDATE RESUME TEXT EXTRACT]
${app.resumeText.substring(0, 8000)}

Evaluation Criteria:
1. Calculate a dynamic compatibility score (0 to 100) based strictly on tech-stack overlap and experience match.
2. Provide a 2-sentence formal HR reason. If score >= 85, justify the shortlisting. If score < 85, point out the exact missing skill gaps or experience shortages.

Return ONLY a valid JSON object format:
{
  "score": 91,
  "feedback": "The candidate's resume shows strong professional experience in Next.js and Prisma matching our exact stack. Highly suitable for shortlisting."
}
`;
        
        // জেমিনি কল
        const aiResult = await parseGeminiJson(prompt);

        if (!aiResult || typeof aiResult.score !== "number") continue;

        const finalScore = aiResult.score;
        const feedbackMessage = aiResult.feedback || "Processed by AI Screening.";

        // ৪. মেকানিজম সিদ্ধান্ত: ৮৫% ম্যাচ ফিল্টারিং
        if (finalScore >= 85) {
          await applicationsModel.findByIdAndUpdate(app._id, {
            status: "shortlisted",
            aiScore: finalScore,
            aiFeedback: feedbackMessage
          });
          totalShortlisted++;
        } else {
          await applicationsModel.findByIdAndUpdate(app._id, {
            status: "rejected",
            aiScore: finalScore,
            aiFeedback: feedbackMessage
          });
          totalRejected++;
        }

        currentJobReport.candidatesEvaluated.push({
          name: (app.userId as any)?.name || "Applicant",
          score: finalScore,
          actionTaken: finalScore >= 85 ? "SHORTLISTED" : "REJECTED"
        });

        // হিস্টোরি এবং ইউসেজ কাউন্ট আপডেট
        await Promise.all([
          aiHistoryModel.create({
            userId: user._id, // এমপ্লয়ারের আইডি (যে এআই ফিচারটি ইউজ করছে)
            role: user.role,
            feature: "resume-analyzer",
            model: DEFAULT_GEMINI_MODEL,
            prompt,
            responseText: JSON.stringify(aiResult),
            status: "success",
            inputType: "text",
            tokensUsed: 1, // আপনি চাইলে ডাইনামিক টোকেন কাউন্ট বসাতে পারেন
            cost: 0,
          }),
          usersModel.findByIdAndUpdate(user._id, {
            $inc: { aiUsageCount: 1 },
          }),
        ]);

      } catch (loopError) {
        console.error(`Error processing application ID ${app._id}:`, loopError);
        continue;
      }
    }

    if (currentJobReport.candidatesEvaluated.length > 0) {
      detailedReport.push(currentJobReport);
    }
  }

  return {
    metrics: {
      activeJobsProcessed: detailedReport.length,
      totalResumesParsed: totalScanned,
      shortlistedCount: totalShortlisted,
      rejectedCount: totalRejected
    },
    logs: detailedReport
  };
}

/* -------------------- INTERVIEW ASSISTANT -------------------- */
export async function interviewAssistant(
  user: any,
  payload: any,
) {
  const prompt = `
Generate interview questions and answers.

Job Title:
${payload.jobTitle}

Return ONLY JSON:

{
  "questions": [
    {
      "q": "",
      "a": ""
    }
  ]
}
`;

  const data = await parseGeminiJson(prompt);

  await Promise.all([
    aiHistoryModel.create({
      userId: user._id,
      role: user.role,
      feature: "interview-assistant",
      model: DEFAULT_GEMINI_MODEL,
      prompt,
      responseText: JSON.stringify(data),
      status: "success",
      inputType: "text",
      tokensUsed: 1,
      cost: 0,
    }),
    usersModel.findByIdAndUpdate(user._id, {
      $inc: { aiUsageCount: 1 },
    }),
  ]);

  return data;
}

async function getAiHistory(
  user: any,
  query: any) {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  const feature = query.feature;

  const filter: any = {
    userId: user._id,
  };

  if (feature) {
    filter.feature = feature;
  }

  const [records, total] = await Promise.all([
    aiHistoryModel
      .find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),

    aiHistoryModel.countDocuments(filter),
  ]);

  return {
    records,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1,
    },
  };
}

export const aiService = {
  generateJob,
  jobMatch,
  generateCoverLetter,
  analyzeResume,
  interviewAssistant,
  getAiHistory
};
