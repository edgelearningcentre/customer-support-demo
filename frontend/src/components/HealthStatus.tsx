'use client';

import { useState, useEffect } from 'react';
import { CheckCircle, AlertCircle, XCircle, RefreshCw } from 'lucide-react';
import { apiService } from '@/services/api';
import { HealthResponse } from '@/types/api';

export default function HealthStatus() {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const checkHealth = async () => {
    try {
      setLoading(true);
      setError(null);
      const healthData = await apiService.getHealth();
      setHealth(healthData);
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || 'Failed to connect to backend');
      setHealth(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkHealth();
  }, []);

  const getStatusIcon = () => {
    if (loading) {
      return <RefreshCw className="w-5 h-5 text-gray-500 animate-spin" />;
    }
    
    if (error || !health) {
      return <XCircle className="w-5 h-5 text-red-500" />;
    }
    
    if (health.status === 'healthy') {
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    }
    
    return <AlertCircle className="w-5 h-5 text-yellow-500" />;
  };

  const getStatusText = () => {
    if (loading) return 'Checking status...';
    if (error) return 'Connection Failed';
    if (!health) return 'Unknown Status';
    
    switch (health.status) {
      case 'healthy':
        return 'All Systems Operational';
      case 'degraded':
        return 'Partially Operational';
      default:
        return 'Status Unknown';
    }
  };

  const getStatusColor = () => {
    if (loading) return 'border-gray-200 bg-gray-50';
    if (error || !health) return 'border-red-200 bg-red-50';
    
    switch (health.status) {
      case 'healthy':
        return 'border-green-200 bg-green-50';
      case 'degraded':
        return 'border-yellow-200 bg-yellow-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  return (
    <div className={`rounded-lg border-2 p-4 transition-colors ${getStatusColor()}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          {getStatusIcon()}
          <div className="ml-3">
            <h3 className="text-sm font-semibold text-gray-900">
              Backend Status
            </h3>
            <p className="text-sm text-gray-600">{getStatusText()}</p>
          </div>
        </div>
        
        <button
          onClick={checkHealth}
          disabled={loading}
          className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50 transition-colors"
          title="Refresh status"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {health && (
        <div className="mt-3 grid grid-cols-1 gap-4 text-xs">
          <div className="flex items-center">
            <div className={`w-2 h-2 rounded-full mr-2 ${
              health.openai_configured ? 'bg-green-500' : 'bg-red-500'
            }`} />
            <span className="text-gray-700">
              OpenAI API: {health.openai_configured ? 'Configured' : 'Not Configured'}
            </span>
          </div>
        </div>
      )}

      {error && (
        <div className="mt-3 text-xs text-red-600">
          <p><strong>Error:</strong> {error}</p>
          <p className="mt-1">
            Make sure the backend server is running on <code>http://localhost:8000</code>
          </p>
        </div>
      )}
    </div>
  );
} 