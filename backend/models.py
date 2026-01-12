from pydantic import BaseModel
from typing import List, Optional

class SupportRequest(BaseModel):
    query: str

class WorkflowStep(BaseModel):
    step_name: str
    step_type: str  # "categorize", "analyze_sentiment", "route", "handle"
    input_data: dict
    output_data: dict
    description: str

class SupportResponse(BaseModel):
    query: str
    category: str
    sentiment: str
    response: str
    workflow_steps: List[WorkflowStep]
    success: bool
    error_message: Optional[str] = None

class HealthResponse(BaseModel):
    status: str
    openai_configured: bool 