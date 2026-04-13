import type {
  RewriteRequest,
  RewriteResponse,
  VocabSuggestRequest,
  VocabWord,
  DescribeImageRequest,
  DescribeImageResponse,
} from "../types";

const BASE = import.meta.env.VITE_API_URL ?? "";

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText);
    throw new Error(text || `HTTP ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export async function rewriteText(req: RewriteRequest): Promise<RewriteResponse> {
  const res = await fetch(`${BASE}/api/assistant/rewrite`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(req),
  });
  return handleResponse<RewriteResponse>(res);
}

export async function describeImage(
  req: DescribeImageRequest
): Promise<DescribeImageResponse> {
  const form = new FormData();
  form.append("image", req.image);
  form.append("tone", req.tone);
  form.append("language", req.language ?? "English");
  form.append("detail", req.detail ?? "auto");

  if (req.user_prompt?.trim()) {
    form.append("user_prompt", req.user_prompt.trim());
  }

  const res = await fetch(`${BASE}/api/assistant/describe-image`, {
    method: "POST",
    body: form,
  });

  return handleResponse<DescribeImageResponse>(res);
}


export async function transcribeAudio(audioBlob: Blob): Promise<string> {
  const form = new FormData();
  form.append("audio", audioBlob, "recording.webm");

  const res = await fetch(`${BASE}/api/assistant/transcribe`, {
    method: "POST",
    body: form,
  });

  const data = await handleResponse<{ transcript: string }>(res);
  return data.transcript;
}

export async function speakText(text: string): Promise<void> {
  const res = await fetch(`${BASE}/api/assistant/speak`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, voice: "nova" }),
  });

  if (!res.ok) {
    throw new Error(`TTS failed: ${res.status}`);
  }

  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const audio = new Audio(url);

  return new Promise<void>((resolve) => {
    audio.onended = () => {
      URL.revokeObjectURL(url);
      resolve();
    };
    audio.onerror = () => {
      URL.revokeObjectURL(url);
      resolve();
    };
    audio.play();
  });
}

export async function suggestVocabulary(
  req: VocabSuggestRequest
): Promise<VocabWord[]> {
  const res = await fetch(`${BASE}/api/vocabulary/suggest`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(req),
  });

  const data = await handleResponse<{ words: Omit<VocabWord, "id">[] }>(res);
  return data.words.map((w) => ({ ...w, id: crypto.randomUUID() }));
}
