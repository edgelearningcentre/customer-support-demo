export interface SupportRequest {
  query: string;
}

export interface WorkflowStep {
  step_name: string;
  step_type: 'categorize' | 'analyze_sentiment' | 'route' | 'handle';
  input_data: Record<string, any>;
  output_data: Record<string, any>;
  description: string;
}

export interface SupportResponse {
  query: string;
  category: string;
  sentiment: string;
  response: string;
  workflow_steps: WorkflowStep[];
  success: boolean;
  error_message?: string;
}

export interface HealthResponse {
  status: string;
  openai_configured: boolean;
} 