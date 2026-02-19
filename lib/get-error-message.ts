import { AxiosError } from "axios";

export function getErrorMessage(error: unknown): string {
  if (error instanceof AxiosError && error.response?.data != null) {
    const data = error.response.data as Record<string, unknown>;
    const rawMessage = data?.message;

    if (Array.isArray(rawMessage)) {
      return rawMessage.join("\n");
    }
    if (typeof rawMessage === "string") return rawMessage;
    if (typeof data?.error === "string") return data.error;
    return JSON.stringify(data);
  }
  if (error instanceof Error) return error.message;
  return "Error desconocido";
}
