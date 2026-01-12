import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from typing import Dict, TypedDict, List
from langchain_core.prompts import ChatPromptTemplate
from langchain_openai import ChatOpenAI
from langgraph.graph import StateGraph, END
from config import config
from models import SupportRequest, SupportResponse, WorkflowStep, HealthResponse
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Set OpenAI API key
os.environ["OPENAI_API_KEY"] = config.OPENAI_API_KEY

# Global variables
app_workflow = None
openai_configured = False

class State(TypedDict):
    query: str
    category: str
    sentiment: str
    response: str

# Workflow step tracking
workflow_steps: List[WorkflowStep] = []

def clear_workflow_steps():
    """Clear the global workflow steps for a new request"""
    global workflow_steps
    workflow_steps = []

def add_workflow_step(step_name: str, step_type: str, input_data: dict, output_data: dict, description: str):
    """Add a step to the workflow tracking"""
    workflow_steps.append(WorkflowStep(
        step_name=step_name,
        step_type=step_type,
        input_data=input_data,
        output_data=output_data,
        description=description
    ))

def categorize(state: State) -> State:
    """Categorize the customer query into Technical, Billing, or General."""
    prompt = ChatPromptTemplate.from_template(
        "Categorize the following customer query into one of these categories: "
        "Technical, Billing, General. Respond with only the category name. Query: {query}"
    )
    chain = prompt | ChatOpenAI(temperature=0)
    
    input_data = {"query": state["query"]}
    category = chain.invoke({"query": state["query"]}).content.strip()
    output_data = {"category": category}
    
    add_workflow_step(
        step_name="categorize",
        step_type="categorize",
        input_data=input_data,
        output_data=output_data,
        description=f"Categorized customer query as: {category}"
    )
    
    return {"category": category}

def analyze_sentiment(state: State) -> State:
    """Analyze the sentiment of the customer query as Positive, Neutral, or Negative."""
    prompt = ChatPromptTemplate.from_template(
        "Analyze the sentiment of the following customer query. "
        "Respond with either 'Positive', 'Neutral', or 'Negative'. Query: {query}"
    )
    chain = prompt | ChatOpenAI(temperature=0)
    
    input_data = {"query": state["query"]}
    sentiment = chain.invoke({"query": state["query"]}).content.strip()
    output_data = {"sentiment": sentiment}
    
    add_workflow_step(
        step_name="analyze_sentiment",
        step_type="analyze_sentiment",
        input_data=input_data,
        output_data=output_data,
        description=f"Analyzed sentiment as: {sentiment}"
    )
    
    return {"sentiment": sentiment}

def handle_technical(state: State) -> State:
    """Provide a technical support response to the query."""
    prompt = ChatPromptTemplate.from_template(
        "Provide a helpful technical support response to the following query. "
        "Be professional, clear, and offer specific steps when possible: {query}"
    )
    chain = prompt | ChatOpenAI(temperature=0)
    
    input_data = {"query": state["query"], "category": state["category"]}
    response = chain.invoke({"query": state["query"]}).content
    output_data = {"response": response}
    
    add_workflow_step(
        step_name="handle_technical",
        step_type="handle",
        input_data=input_data,
        output_data=output_data,
        description="Generated technical support response"
    )
    
    return {"response": response}

def handle_billing(state: State) -> State:
    """Provide a billing support response to the query."""
    prompt = ChatPromptTemplate.from_template(
        "Provide a helpful billing support response to the following query. "
        "Be professional and guide the customer to resolve their billing issue: {query}"
    )
    chain = prompt | ChatOpenAI(temperature=0)
    
    input_data = {"query": state["query"], "category": state["category"]}
    response = chain.invoke({"query": state["query"]}).content
    output_data = {"response": response}
    
    add_workflow_step(
        step_name="handle_billing",
        step_type="handle",
        input_data=input_data,
        output_data=output_data,
        description="Generated billing support response"
    )
    
    return {"response": response}

def handle_general(state: State) -> State:
    """Provide a general support response to the query."""
    prompt = ChatPromptTemplate.from_template(
        "Provide a helpful general support response to the following query. "
        "Be professional, friendly, and provide useful information: {query}"
    )
    chain = prompt | ChatOpenAI(temperature=0)
    
    input_data = {"query": state["query"], "category": state["category"]}
    response = chain.invoke({"query": state["query"]}).content
    output_data = {"response": response}
    
    add_workflow_step(
        step_name="handle_general",
        step_type="handle",
        input_data=input_data,
        output_data=output_data,
        description="Generated general support response"
    )
    
    return {"response": response}

def escalate(state: State) -> State:
    """Escalate the query to a human agent due to negative sentiment."""
    response = "This query has been escalated to a human agent due to its negative sentiment. A member of our support team will contact you shortly to address your concerns personally."
    
    add_workflow_step(
        step_name="escalate",
        step_type="handle",
        input_data={"query": state["query"], "sentiment": state["sentiment"]},
        output_data={"response": response},
        description="Escalated to human agent due to negative sentiment"
    )
    
    return {"response": response}

def route_query(state: State) -> str:
    """Route the query based on its sentiment and category."""
    routing_decision = {
        "sentiment": state["sentiment"],
        "category": state["category"]
    }
    
    if state["sentiment"] == "Negative":
        route = "escalate"
    elif state["category"] == "Technical":
        route = "handle_technical"
    elif state["category"] == "Billing":
        route = "handle_billing"
    else:
        route = "handle_general"
    
    add_workflow_step(
        step_name="route_query",
        step_type="route",
        input_data=routing_decision,
        output_data={"route": route},
        description=f"Routed query to: {route} based on sentiment '{state['sentiment']}' and category '{state['category']}'"
    )
    
    return route

def initialize_workflow():
    """Initialize the LangGraph workflow"""
    global app_workflow, openai_configured
    
    try:
        if not config.OPENAI_API_KEY:
            logger.error("OpenAI API key not configured")
            return False
            
        # Test OpenAI connection
        test_llm = ChatOpenAI(temperature=0)
        test_response = test_llm.invoke("Hello")
        openai_configured = True
        
        # Create the graph
        workflow = StateGraph(State)
        
        # Add nodes
        workflow.add_node("categorize", categorize)
        workflow.add_node("analyze_sentiment", analyze_sentiment)
        workflow.add_node("handle_technical", handle_technical)
        workflow.add_node("handle_billing", handle_billing)
        workflow.add_node("handle_general", handle_general)
        workflow.add_node("escalate", escalate)
        
        # Add edges
        workflow.add_edge("categorize", "analyze_sentiment")
        workflow.add_conditional_edges(
            "analyze_sentiment",
            route_query,
            {
                "handle_technical": "handle_technical",
                "handle_billing": "handle_billing",
                "handle_general": "handle_general",
                "escalate": "escalate"
            }
        )
        workflow.add_edge("handle_technical", END)
        workflow.add_edge("handle_billing", END)
        workflow.add_edge("handle_general", END)
        workflow.add_edge("escalate", END)
        
        # Set entry point
        workflow.set_entry_point("categorize")
        
        # Compile the graph
        app_workflow = workflow.compile()
        
        logger.info("Customer support workflow initialized successfully")
        return True
        
    except Exception as e:
        logger.error(f"Failed to initialize workflow: {e}")
        openai_configured = False
        return False

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Handle startup and shutdown events"""
    # Startup
    logger.info("Starting up Customer Support Agent Demo...")
    
    if not initialize_workflow():
        logger.error("Workflow initialization failed!")
    
    yield
    
    # Shutdown (if needed)
    logger.info("Shutting down...")

app = FastAPI(
    title="Customer Support Agent Demo",
    description="A demo application showcasing LangGraph customer support agent workflow",
    version="1.0.0",
    lifespan=lifespan
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=config.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint"""
    return HealthResponse(
        status="healthy" if openai_configured else "degraded",
        openai_configured=openai_configured
    )

@app.post("/support", response_model=SupportResponse)
async def handle_support_query(request: SupportRequest):
    """Process a customer support query through the LangGraph workflow"""
    if not app_workflow:
        raise HTTPException(status_code=500, detail="Workflow not initialized")
    
    try:
        logger.info(f"Processing support query: {request.query}")
        
        # Clear previous workflow steps
        clear_workflow_steps()
        
        # Process through workflow
        result = app_workflow.invoke({"query": request.query})
        
        return SupportResponse(
            query=request.query,
            category=result.get("category", ""),
            sentiment=result.get("sentiment", ""),
            response=result.get("response", ""),
            workflow_steps=workflow_steps,
            success=True
        )
        
    except Exception as e:
        logger.error(f"Support query processing failed: {e}")
        return SupportResponse(
            query=request.query,
            category="",
            sentiment="",
            response="",
            workflow_steps=[],
            success=False,
            error_message=str(e)
        )

@app.get("/")
async def root():
    """Root endpoint with API information"""
    return {
        "message": "Customer Support Agent Demo API",
        "version": "1.0.0",
        "endpoints": {
            "health": "/health",
            "support": "/support",
            "docs": "/docs"
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 