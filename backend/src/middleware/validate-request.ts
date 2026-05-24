import type { NextFunction, Request, Response } from "express";
import type { ZodType } from "zod";

type RequestValidationShape = {
  body?: unknown;
  query?: unknown;
  params?: unknown;
};

export function validateRequest<T extends RequestValidationShape>(schema: ZodType<T>) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse({
      body: req.body,
      query: req.query,
      params: req.params,
    });

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: "Validation failed.",
        errors: result.error.flatten(),
      });
    }

    const parsedData = result.data;

    if (parsedData.body) {
      req.body = parsedData.body as Request["body"];
    }

    res.locals.validated = parsedData;

    next();
  };
}
