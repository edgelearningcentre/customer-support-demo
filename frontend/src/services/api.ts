import axios from 'axios';
import { SupportRequest, SupportResponse, HealthResponse } from '@/types/api';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000, // 60 seconds timeout for LLM calls
});

export const apiService = {
  async submitSupportQuery(query: string): Promise<SupportResponse> {
    const request: SupportRequest = { query };
    const response = await api.post<SupportResponse>('/support', request);
    return response.data;
  },

  async getHealth(): Promise<HealthResponse> {
    const response = await api.get<HealthResponse>('/health');
    return response.data;
  },
}; 