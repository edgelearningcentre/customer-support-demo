'use client';

import { useState } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { apiService } from '@/services/api';
import { SupportResponse } from '@/types/api';

interface QueryFormProps {
  onQuerySubmit: (response: SupportResponse) => void;
  onQueryStart: () => void;
  isLoading: boolean;
}

const EXAMPLE_QUERIES = [
  "My internet connection keeps dropping. Can you help?",
  "Where can I find my receipt?",
  "What are your business hours?",
  "I'm furious about this service! Nothing works!",
  "I need help talking to chatGPT",
];

export default function QueryForm({ onQuerySubmit, onQueryStart, isLoading }: QueryFormProps) {
  const [query, setQuery] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!query.trim()) {
      setError('Please enter a support query');
      return;
    }

    setError('');
    onQueryStart();

    try {
      const response = await apiService.submitSupportQuery(query.trim());
      onQuerySubmit(response);
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || err.message || 'An error occurred';
      onQuerySubmit({
        query: query.trim(),
        category: '',
        sentiment: '',
        response: '',
        workflow_steps: [],
        success: false,
        error_message: errorMessage,
      });
    }
  };

  const handleExampleClick = (exampleQuery: string) => {
    setQuery(exampleQuery);
    setError('');
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="query" className="block text-sm font-medium text-gray-700 mb-2">
            Submit your customer support query:
          </label>
          <div className="relative">
            <textarea
              id="query"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g., I'm having trouble with my login credentials..."
              className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
              rows={3}
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !query.trim()}
              className="absolute bottom-3 right-3 p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </div>
          {error && (
            <p className="mt-2 text-sm text-red-600">{error}</p>
          )}
        </div>
      </form>

      {/* Quick Example Buttons */}
      <div className="mt-4">
        <p className="text-sm font-medium text-gray-700 mb-2">Or try one of these examples:</p>
        <div className="flex flex-wrap gap-2">
          {EXAMPLE_QUERIES.map((example, index) => (
            <button
              key={index}
              onClick={() => handleExampleClick(example)}
              disabled={isLoading}
              className="text-xs px-3 py-1 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {example}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
} 