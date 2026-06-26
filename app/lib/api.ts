import { API_BASE_URL } from './env';
import type { AnalyzeResponse, RateLimitStatus, RateLimitError } from '../types/api';

export interface AnalyzeParams {
  mode: 'text' | 'image';
  text?: string;
  image?: File | null;
  market: string;
  limit: number;
}

export interface RateLimitHeaders {
  remaining: number | null;
  limit: number | null;
  resetAt: number | null;
}

export class RateLimitApiError extends Error {
  readonly body: RateLimitError;
  constructor(body: RateLimitError) {
    super(body.message);
    this.name = 'RateLimitApiError';
    this.body = body;
  }
}

export class ApiHttpError extends Error {
  readonly statusCode: number;
  constructor(statusCode: number, message: string) {
    super(message);
    this.name = 'ApiHttpError';
    this.statusCode = statusCode;
  }
}

function parseRateLimitHeaders(res: Response): RateLimitHeaders {
  const remaining = res.headers.get('X-RateLimit-Remaining');
  const limit = res.headers.get('X-RateLimit-Limit');
  const reset = res.headers.get('X-RateLimit-Reset');
  return {
    remaining: remaining !== null ? Number(remaining) : null,
    limit: limit !== null ? Number(limit) : null,
    resetAt: reset !== null ? Number(reset) : null,
  };
}

export async function analyzeVibe(
  params: AnalyzeParams
): Promise<{ data: AnalyzeResponse; headers: RateLimitHeaders }> {
  const fd = new FormData();
  if (params.mode === 'text' && params.text) {
    fd.append('text', params.text);
  } else if (params.mode === 'image' && params.image) {
    fd.append('image', params.image);
  }
  fd.append('market', params.market);
  fd.append('limit', String(params.limit));

  // Do not set Content-Type — browser must set it with the multipart boundary
  const res = await fetch(`${API_BASE_URL}/analyze`, {
    method: 'POST',
    body: fd,
  });

  if (res.status === 429) {
    const body = await res.json() as RateLimitError;
    throw new RateLimitApiError(body);
  }

  if (!res.ok) {
    let message = `HTTP ${res.status}`;
    try {
      const body = await res.json() as { message?: string };
      if (typeof body.message === 'string') message = body.message;
    } catch { /* ignore parse error */ }
    throw new ApiHttpError(res.status, message);
  }

  const data = await res.json() as AnalyzeResponse;
  return { data, headers: parseRateLimitHeaders(res) };
}

export async function getRateLimit(): Promise<RateLimitStatus> {
  const res = await fetch(`${API_BASE_URL}/ratelimit`);
  if (!res.ok) throw new ApiHttpError(res.status, `HTTP ${res.status}`);
  return res.json() as Promise<RateLimitStatus>;
}

export async function getHealth(): Promise<{ status: string }> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);
  try {
    const res = await fetch(`${API_BASE_URL}/health`, { signal: controller.signal });
    if (!res.ok) throw new ApiHttpError(res.status, `HTTP ${res.status}`);
    return res.json() as Promise<{ status: string }>;
  } finally {
    clearTimeout(timeout);
  }
}
