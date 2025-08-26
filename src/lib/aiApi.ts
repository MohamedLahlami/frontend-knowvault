// aiApi.ts
export type SummarizeAlgorithm = "lexrank" | "lsa" | "textrank";

export interface SummarizeRequest {
  document: string;
  language?: string; // e.g., 'english', 'french'
  sentences?: number; // default 3
  algorithm?: SummarizeAlgorithm;
}

export interface SummarizeResponse {
  summary: string;
  sentences_returned: number;
  algorithm: SummarizeAlgorithm;
  language: string;
}

const AI_BASE_URL = "http://localhost:8081/api/ai";

export async function summarizeDocument(
  payload: SummarizeRequest,
  token?: string
): Promise<SummarizeResponse> {
  const response = await fetch(`${AI_BASE_URL}/summarize`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => "");
    throw new Error(
      errorText || `AI summarize failed with status ${response.status}`
    );
  }

  return (await response.json()) as SummarizeResponse;
}
