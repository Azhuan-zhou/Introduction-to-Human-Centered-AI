export type Tone = "formal" | "casual" | "academic";
export type ImageDetail = "low" | "high" | "original" | "auto";

export interface RewriteRequest {
  text: string;
  tone: Tone;
  topic_context?: string;
}

export interface RewriteResponse {
  rewritten: string;
  tone: Tone;
}

export interface DescribeImageResponse {
  description: string;
  tone: Tone;
  language: string;
  detail: ImageDetail;
}

export interface DescribeImageRequest {
  image: File;
  tone: Tone;
  language?: string;
  user_prompt?: string;
  detail?: ImageDetail;
}