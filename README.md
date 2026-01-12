# Customer Support Agent Demo

A full-stack web application demonstrating an intelligent customer support agent built with LangGraph. This demo showcases automated query categorization, sentiment analysis, routing decisions, and response generation.

## 🚀 Features

- **Query Categorization**: Automatically categorizes customer queries into Technical, Billing, or General categories
- **Sentiment Analysis**: Analyzes customer sentiment as Positive, Neutral, or Negative
- **Intelligent Routing**: Routes queries based on category and sentiment with escalation for negative sentiment
- **Workflow Visualization**: Interactive display of the agent's decision-making process
- **Real-time Processing**: Live demonstration of LangGraph workflow execution
- **Modern UI**: Clean, responsive interface built with Next.js and Tailwind CSS

## 🏗️ Architecture

- **Frontend**: Next.js 14 with TypeScript, Tailwind CSS, React components
- **Backend**: FastAPI with Python, integrated with LangGraph workflow
- **AI Framework**: LangGraph with LangChain for multi-step agent workflow
- **LLM**: OpenAI GPT for categorization, sentiment analysis, and response generation

## 📋 Prerequisites

- Node.js 18+ and npm
- Python 3.10+
- OpenAI API key

## 🛠️ Setup Instructions

### Backend Setup

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Create a Python virtual environment:**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables:**
   Create a `.env` file in the backend directory:
   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   ```

5. **Start the backend server:**
   ```bash
   python main.py
   ```
   
   The API will be available at `http://localhost:8000`

### Frontend Setup

1. **Navigate to the frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install Node.js dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables (optional):**
   Create a `.env.local` file:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```
   
   The application will be available at `http://localhost:3000`

## 🎯 Usage

1. **Start both servers** (backend on :8000, frontend on :3000)
2. **Open your browser** to `http://localhost:3000`
3. **Check the health status** to ensure OpenAI API is configured
4. **Submit customer support queries** to see the agent in action:

### Example Queries

- **Technical**: "My internet connection keeps dropping. Can you help?"
- **Billing**: "Where can I find my receipt?"
- **General**: "What are your business hours?"
- **Negative Sentiment**: "I'm furious about this service! Nothing works!"

## 🔄 Workflow Process

The agent follows this workflow for each query:

1. **Categorization** - Classifies the query into Technical, Billing, or General
2. **Sentiment Analysis** - Determines if the sentiment is Positive, Neutral, or Negative
3. **Routing Decision** - Routes based on sentiment and category:
   - Negative sentiment → Escalate to human agent
   - Technical category → Generate technical response
   - Billing category → Generate billing response
   - General category → Generate general response
4. **Response Generation** - Creates an appropriate response based on the routing decision

## 🔧 API Endpoints

### Backend API (`http://localhost:8000`)

- `GET /` - API information
- `GET /health` - Health check and OpenAI API status
- `POST /support` - Submit customer support queries
- `GET /docs` - Interactive API documentation (Swagger UI)

### Request/Response Examples

**Support Request:**
```json
{
  "query": "My internet connection keeps dropping. Can you help?"
}
```

**Support Response:**
```json
{
  "query": "My internet connection keeps dropping. Can you help?",
  "category": "Technical",
  "sentiment": "Negative",
  "response": "This query has been escalated to a human agent due to its negative sentiment...",
  "workflow_steps": [
    {
      "step_name": "categorize",
      "step_type": "categorize",
      "input_data": {"query": "..."},
      "output_data": {"category": "Technical"},
      "description": "Categorized customer query as: Technical"
    }
  ],
  "success": true
}
```

## 🎨 Frontend Components

- **`QueryForm`**: Input form with example queries
- **`WorkflowVisualization`**: Interactive workflow step display with expand/collapse
- **`HealthStatus`**: Backend connectivity and OpenAI API status monitoring
- **`page.tsx`**: Main application layout with results display

## 🔍 Workflow Visualization Features

- **Step-by-step breakdown** of agent decision making
- **Interactive expansion** to view input/output data for each step
- **Color-coded steps** by type (categorization, sentiment, routing, handling)
- **Workflow summary** with step counts and statistics
- **Expand/Collapse all** controls for detailed inspection

## 🛠️ Development

### Adding New Categories

1. **Backend**: Update the categorization prompt in `main.py`
2. **Frontend**: Add new category colors in the `getCategoryColor` function
3. **Workflow**: Add new routing logic in the `route_query` function

### Adding New Sentiment Types

1. **Backend**: Update sentiment analysis prompt and routing logic
2. **Frontend**: Add new sentiment colors and handling in the UI

### Customizing Responses

1. **Backend**: Modify the response generation prompts in handler functions
2. **Workflow**: Add new handler nodes for specialized response types

## 🚀 Deployment

### Backend Deployment
- Deploy to cloud platforms (AWS, GCP, Azure)
- Use Docker for containerization
- Set OPENAI_API_KEY environment variable in production
- Configure proper CORS settings

### Frontend Deployment
- Deploy to Vercel, Netlify, or similar platforms
- Update `NEXT_PUBLIC_API_URL` for production backend
- Build with `npm run build`

## 📊 LangGraph Workflow

The workflow is implemented using LangGraph's StateGraph with the following nodes:

- **categorize**: Query categorization node
- **analyze_sentiment**: Sentiment analysis node  
- **route_query**: Conditional routing based on sentiment and category
- **handle_technical**: Technical response generation
- **handle_billing**: Billing response generation
- **handle_general**: General response generation
- **escalate**: Human escalation for negative sentiment

## 🎓 Educational Value

This demo demonstrates:

- **LangGraph workflow design** with conditional routing
- **Multi-step AI agent** reasoning and decision making
- **State management** in complex AI workflows
- **Integration patterns** between LangGraph and web applications
- **Observability** in AI agent systems

## 📝 License

This project is for demonstration purposes. Check individual package licenses for dependencies.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

- **LangGraph Documentation**: [langchain-ai.github.io/langgraph](https://langchain-ai.github.io/langgraph)
- **OpenAI API**: [platform.openai.com/docs](https://platform.openai.com/docs)
- **Issues**: Create GitHub issues for bugs or feature requests

## 🎉 What's Next?

Try these enhancements:
- Add more sophisticated routing logic
- Implement conversation memory and context
- Add custom knowledge base integration
- Build analytics dashboard for query patterns
- Add multi-language support
- Implement real-time chat interface

---

**Powered by LangGraph, OpenAI, and Next.js** 🚀 