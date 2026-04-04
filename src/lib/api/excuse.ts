import axiosInstance from "../axiosInstance";

export interface ExcuseParams {
  context: string;
  tone: "polite" | "urgent" | "subtle";
  timeOfDay: string;
  locationType?: string;
  person?: string;
}

export interface ExcuseResponse {
  message: string;
  excuse: string;
}

/**
 * Generate Dual AI Alert + Excuse via the backend Cohere endpoint.
 * Returns both the mock alert text and the user's excuse.
 */
export async function generateExcuse(
  params: ExcuseParams
): Promise<ExcuseResponse> {
  try {
    const res = await axiosInstance.post<ExcuseResponse>(
      "/api/chatbot/excuse",
      params
    );
    return res.data;
  } catch {
    // Graceful fallback — return a generic dual result
    const pLower = (params.person || "Someone").toLowerCase();
    const isWork = pLower.includes("boss") || pLower.includes("work") || pLower.includes("office") || pLower.includes("manager") || pLower.includes("colleague");

    if (isWork) {
      return {
        message: "URGENT: There's an issue with the project that needs your immediate attention.",
        excuse: `I'm so sorry, my ${pLower} just notified me of an urgent work issue. I really need to handle this right away.`
      };
    }

    const fallbacks: Record<ExcuseParams["tone"], { message: string; excuse: string }> = {
      polite: {
        message: "Hey, can you come home? We need your help with something.",
        excuse: `I just got a message from my ${pLower}, they need my help with something. I should probably head out.`
      },
      urgent: {
        message: "EMERGENCY: Please call me immediately or come home!",
        excuse: `I'm so sorry, an emergency just came up with my ${pLower}. I have to leave right now.`
      },
      subtle: {
        message: "Are you almost done? Just checking in.",
        excuse: "I just realized I have something I need to take care of. I'll catch up with you later!"
      },
    };
    return fallbacks[params.tone] || fallbacks.polite;
  }
}
