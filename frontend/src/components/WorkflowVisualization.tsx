'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight, Tags, Heart, GitBranch, MessageSquare, ArrowRight } from 'lucide-react';
import { WorkflowStep } from '@/types/api';

interface WorkflowVisualizationProps {
  steps: WorkflowStep[];
}

interface StepDisplayProps {
  step: WorkflowStep;
  index: number;
  isExpanded: boolean;
  onToggle: (index: number) => void;
}

function StepDisplay({ step, index, isExpanded, onToggle }: StepDisplayProps) {
  const getStepIcon = (stepType: string) => {
    switch (stepType) {
      case 'categorize':
        return <Tags className="w-5 h-5 text-purple-600" />;
      case 'analyze_sentiment':
        return <Heart className="w-5 h-5 text-pink-600" />;
      case 'route':
        return <GitBranch className="w-5 h-5 text-blue-600" />;
      case 'handle':
        return <MessageSquare className="w-5 h-5 text-green-600" />;
      default:
        return <MessageSquare className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStepColor = (stepType: string) => {
    switch (stepType) {
      case 'categorize':
        return 'border-purple-200 bg-purple-50';
      case 'analyze_sentiment':
        return 'border-pink-200 bg-pink-50';
      case 'route':
        return 'border-blue-200 bg-blue-50';
      case 'handle':
        return 'border-green-200 bg-green-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  const formatStepName = (stepName: string) => {
    return stepName.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <div className={`border-l-4 rounded-lg shadow-sm transition-all duration-200 ${getStepColor(step.step_type)}`}>
      <div
        className="flex items-center p-4 cursor-pointer"
        onClick={() => onToggle(index)}
      >
        <div className="flex items-center flex-1 min-w-0">
          <div className="flex-shrink-0 mr-3">
            {getStepIcon(step.step_type)}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold text-gray-900">
              {formatStepName(step.step_name)}
            </h4>
            <p className="text-xs text-gray-600 mt-1">
              {step.description}
            </p>
          </div>
        </div>
        <div className="flex-shrink-0 ml-2">
          {isExpanded ? (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronRight className="w-5 h-5 text-gray-400" />
          )}
        </div>
      </div>

      {isExpanded && (
        <div className="border-t border-gray-200 p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Input Data */}
            <div>
              <h5 className="text-xs font-semibold text-gray-700 mb-2">Input Data:</h5>
              <div className="bg-white rounded-lg p-3 border">
                <pre className="text-xs text-gray-600 whitespace-pre-wrap">
                  {JSON.stringify(step.input_data, null, 2)}
                </pre>
              </div>
            </div>

            {/* Output Data */}
            <div>
              <h5 className="text-xs font-semibold text-gray-700 mb-2">Output Data:</h5>
              <div className="bg-white rounded-lg p-3 border">
                <pre className="text-xs text-gray-600 whitespace-pre-wrap">
                  {JSON.stringify(step.output_data, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function WorkflowVisualization({ steps }: WorkflowVisualizationProps) {
  const [expandedSteps, setExpandedSteps] = useState<Set<number>>(new Set());

  const toggleStep = (index: number) => {
    const newExpanded = new Set(expandedSteps);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedSteps(newExpanded);
  };

  const expandAll = () => {
    setExpandedSteps(new Set(steps.map((_, index) => index)));
  };

  const collapseAll = () => {
    setExpandedSteps(new Set());
  };

  if (steps.length === 0) {
    return (
      <div className="text-gray-500 text-center py-8">
        No workflow steps to display
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-600">
          Click on any step to view detailed input and output data:
        </p>
        <div className="flex gap-2">
          <button
            onClick={expandAll}
            className="text-xs px-3 py-1 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Expand All
          </button>
          <button
            onClick={collapseAll}
            className="text-xs px-3 py-1 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Collapse All
          </button>
        </div>
      </div>

      {/* Workflow Steps */}
      <div className="space-y-3">
        {steps.map((step, index) => (
          <div key={index} className="relative">
            <StepDisplay
              step={step}
              index={index}
              isExpanded={expandedSteps.has(index)}
              onToggle={toggleStep}
            />
            {index < steps.length - 1 && (
              <div className="flex justify-center my-2">
                <ArrowRight className="w-4 h-4 text-gray-400" />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="text-sm font-semibold text-gray-900 mb-2">
          Workflow Summary
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Total Steps:</span>
            <span className="ml-2 font-medium">{steps.length}</span>
          </div>
          <div>
            <span className="text-gray-600">Categorization:</span>
            <span className="ml-2 font-medium">
              {steps.filter(s => s.step_type === 'categorize').length}
            </span>
          </div>
          <div>
            <span className="text-gray-600">Sentiment Analysis:</span>
            <span className="ml-2 font-medium">
              {steps.filter(s => s.step_type === 'analyze_sentiment').length}
            </span>
          </div>
          <div>
            <span className="text-gray-600">Response Generation:</span>
            <span className="ml-2 font-medium">
              {steps.filter(s => s.step_type === 'handle').length}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
} 