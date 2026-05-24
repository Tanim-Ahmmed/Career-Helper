import axios from "axios";

type ErrorResponsePayload = {
  success?: boolean;
  message?: string;
};

export function getErrorMessage(
  error: unknown,
  fallbackMessage = "Something went wrong. Please try again.",
) {
  if (axios.isAxiosError<ErrorResponsePayload>(error)) {
    return error.response?.data?.message?.trim() || fallbackMessage;
  }

  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }

  return fallbackMessage;
}
