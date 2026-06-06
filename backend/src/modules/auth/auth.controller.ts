import type { Request, Response } from "express";
import pdfParse from "pdf-parse";
import { sendResponse } from "../../utils/send-response";
import { catchAsync } from "../../utils/catch-async";
import { authService } from "./auth.service";

const register = catchAsync(async (req: Request, res: Response) => {
  const result = await authService.register(req.body);

  sendResponse(res, 201, {
    success: true,
    message: "User registered successfully.",
    data: result,
  });
});

const login = catchAsync(async (req: Request, res: Response) => {
  const result = await authService.login(req.body);

  sendResponse(res, 200, {
    success: true,
    message: "Login successful.",
    data: result,
  });
});

const googleLogin = catchAsync(async (req: Request, res: Response) => {
  const result = await authService.googleLogin(req.body);

  sendResponse(res, 200, {
    success: true,
    message: "Google login successful.",
    data: result,
  });
});

const logout = (req: Request, res: Response) => {
  void req;

  sendResponse(res, 200, authService.logout());
};

const getCurrentUser = (req: Request, res: Response) => {
  sendResponse(res, 200, {
    success: true,
    message: "Authenticated user retrieved successfully.",
    data: authService.getCurrentUser(req.user!),
  });
};

const updateCurrentUser = catchAsync(async (req: Request, res: Response) => {
  let finalPayload: any = {};
  
  // ১. চেক করা—রিকোয়েস্টে ফাইল (FormData) এসেছে নাকি নরমাল JSON এসেছে
  if (req.file) {
    if (!req.body.profileData) {
      return res.status(400).json({ success: false, message: "Missing profile data in form submission." });
    }

    finalPayload = JSON.parse(req.body.profileData);

    // ২. পিডিএফ ফাইল থেকে র-টেক্সট (Raw Text) এক্সট্রাক্ট করা
    try {
      const parsedPdf = await pdfParse(req.file.buffer);

      if (!finalPayload.userProfile) {
        finalPayload.userProfile = {};
      }

      // অনেক সময় টেক্সট parsedPdf.text-এ থাকে, আবার কিছু ক্ষেত্রে শুধু parsedPdf-এ থাকতে পারে।
      // নিচের লাইনটি দুটোর জন্যই সেইফগার্ড হিসেবে কাজ করবে:
      finalPayload.userProfile.resumeText = parsedPdf.text || parsedPdf;

      console.log("--- Updated Payload with Text ---", finalPayload.userProfile.resumeText);

    } catch (pdfError) {
      console.error("PDF Parsing failed:", pdfError);
    }

  } else {
    // যদি কোনো ফাইল না থাকে (নরমাল JSON রিকোয়েস্ট), তবে সরাসরি req.body-ই হলো পেলোড
    finalPayload = req.body;
  }

  // 🎯 ফিক্স ৪: ডাটাবেজে পাঠানোর আগে সব ধরনের রিকোয়েস্ট থেকেই ফালতু 'resumeFile' ফিল্ডটি সম্পূর্ণ ডিলিট করা
  if (finalPayload?.userProfile) {
    delete finalPayload.userProfile.resumeFile;
  }
  if (finalPayload?.resumeFile) {
    delete finalPayload.resumeFile;
  }

  console.log("Cleaned Payload to DB:", finalPayload);

  // ডাটাবেজ আপডেট
  const result = await authService.updateCurrentUser(req.user!, finalPayload as any);

  sendResponse(res, 200, {
    success: true,
    message: "Profile updated successfully.",
    data: result,
  });
});

const getAdminStatus = (req: Request, res: Response) => {
  sendResponse(res, 200, {
    success: true,
    message: "Admin-only route accessed successfully.",
    data: {
      module: "auth",
      role: req.user?.role,
      area: "admin",
    },
  });
};

const getStatus = (_req: Request, res: Response) => {
  sendResponse(res, 200, {
    success: true,
    message: "Auth module is configured and active.",
    data: authService.getStatus(),
  });
};

export const authController = {
  register,
  login,
  googleLogin,
  logout,
  getCurrentUser,
  updateCurrentUser,
  getAdminStatus,
  getStatus,
};
