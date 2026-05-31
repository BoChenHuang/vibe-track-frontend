import type { AnalyzeResponse } from '../types/api';
import { mockResponse } from './data';

export async function mockAnalyze(): Promise<AnalyzeResponse> {
  await new Promise<void>((resolve) => setTimeout(resolve, 1800));
  return mockResponse;
}
