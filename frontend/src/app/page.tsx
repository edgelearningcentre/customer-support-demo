'use client';

import { useState } from 'react';
import { MessageCircle, Brain, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import QueryForm from '@/components/QueryForm';
import WorkflowVisualization from '@/components/WorkflowVisualization';
import HealthStatus from '@/components/HealthStatus';
import { SupportResponse } from '@/types/api';

export default function Home() {
  const [response, setResponse] = useState<SupportResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleQuerySubmit = (response: SupportResponse) => {
    setResponse(response);
    setIsLoading(false);
  };

  const handleQueryStart = () => {
    setIsLoading(true);
    setResponse(null);
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment.toLowerCase()) {
      case 'positive': return 'text-green-600 bg-green-100';
      case 'negative': return 'text-red-600 bg-red-100';
      case 'neutral': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'technical': return 'text-purple-600 bg-purple-100';
      case 'billing': return 'text-orange-600 bg-orange-100';
      case 'general': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <MessageCircle className="w-8 h-8 text-indigo-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900">
              Customer Support Agent Demo
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Experience the power of LangGraph with an intelligent customer support agent. 
            Watch as the agent categorizes queries, analyzes sentiment, and routes them appropriately.
          </p>
        </div>

        {/* Health Status */}
        <div className="mb-6">
          <HealthStatus />
        </div>

        {/* Query Form */}
        <div className="mb-8">
          <QueryForm 
            onQuerySubmit={handleQuerySubmit}
            onQueryStart={handleQueryStart}
            isLoading={isLoading}
          />
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex items-center justify-center">
              <Loader2 className="w-6 h-6 animate-spin text-indigo-600 mr-3" />
              <span className="text-lg text-gray-600">Agent is processing your query...</span>
            </div>
          </div>
        )}

        {/* Results */}
        {response && !isLoading && (
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Category */}
              <div className="bg-white rounded-lg shadow-md p-4">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Category</h3>
                <div className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(response.category)}`}>
                  {response.category}
                </div>
              </div>

              {/* Sentiment */}
              <div className="bg-white rounded-lg shadow-md p-4">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Sentiment</h3>
                <div className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getSentimentColor(response.sentiment)}`}>
                  {response.sentiment}
                </div>
              </div>

              {/* Status */}
              <div className="bg-white rounded-lg shadow-md p-4">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Status</h3>
                <div className="flex items-center">
                  {response.success ? (
                    <>
                      <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                      <span className="text-green-600 font-medium">Processed</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
                      <span className="text-red-600 font-medium">Error</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Response */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center mb-4">
                <MessageCircle className="w-6 h-6 text-blue-600 mr-2" />
                <h2 className="text-xl font-semibold text-gray-900">
                  Support Response
                </h2>
              </div>
              
              {response.success ? (
                <div className="prose max-w-none">
                  <p className="text-gray-700 whitespace-pre-wrap">{response.response}</p>
                </div>
              ) : (
                <div className="text-red-600">
                  <p>{response.error_message}</p>
                </div>
              )}
            </div>

            {/* Workflow Visualization */}
            {response.workflow_steps.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center mb-4">
                  <Brain className="w-6 h-6 text-purple-600 mr-2" />
                  <h2 className="text-xl font-semibold text-gray-900">
                    Agent Workflow
                  </h2>
                </div>
                <WorkflowVisualization steps={response.workflow_steps} />
              </div>
            )}
          </div>
        )}

        {/* Example Queries */}
        <div className="mt-12 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Try these example queries:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-purple-600 mb-2">Technical Query</h4>
              <p className="text-sm text-gray-700">My internet connection keeps dropping. Can you help?</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-orange-600 mb-2">Billing Query</h4>
              <p className="text-sm text-gray-700">Where can I find my receipt?</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-blue-600 mb-2">General Query</h4>
              <p className="text-sm text-gray-700">What are your business hours?</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-red-600 mb-2">Negative Sentiment</h4>
              <p className="text-sm text-gray-700">I'm furious about this service! Nothing works!</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-gray-500">
          <p>Powered by LangGraph, OpenAI, and Next.js</p>
        </div>
      </div>
    </div>
  );
}
