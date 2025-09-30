import React from 'react';
import Icon from '../../../components/AppIcon';

const QuestionDisplay = ({ 
  question = {},
  currentQuestionIndex = 0,
  totalQuestions = 6,
  className = ''
}) => {
  const getDifficultyConfig = (difficulty) => {
    const configs = {
      easy: {
        bg: 'bg-success/10',
        text: 'text-success',
        border: 'border-success/20',
        icon: 'CheckCircle'
      },
      medium: {
        bg: 'bg-warning/10',
        text: 'text-warning',
        border: 'border-warning/20',
        icon: 'AlertCircle'
      },
      hard: {
        bg: 'bg-error/10',
        text: 'text-error',
        border: 'border-error/20',
        icon: 'AlertTriangle'
      }
    };
    return configs?.[difficulty?.toLowerCase()] || configs?.medium;
  };

  const difficultyConfig = getDifficultyConfig(question?.difficulty);

  return (
    <div className={`bg-card border border-border rounded-lg shadow-card p-6 ${className}`}>
      {/* Question Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <span className="text-sm font-medium text-muted-foreground">
            Question {currentQuestionIndex + 1} of {totalQuestions}
          </span>
          <div className={`inline-flex items-center px-3 py-1 rounded-full border ${difficultyConfig?.bg} ${difficultyConfig?.border}`}>
            <Icon name={difficultyConfig?.icon} size={14} className={`mr-1.5 ${difficultyConfig?.text}`} />
            <span className={`text-sm font-medium ${difficultyConfig?.text}`}>
              {question?.difficulty?.charAt(0)?.toUpperCase() + question?.difficulty?.slice(1) || 'Medium'}
            </span>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Icon name="Brain" size={16} />
          <span>AI Generated</span>
        </div>
      </div>
      {/* Question Content */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground leading-relaxed">
          {question?.title || "Loading question..."}
        </h2>
        
        {question?.description && (
          <div className="prose prose-sm max-w-none">
            <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
              {question?.description}
            </p>
          </div>
        )}

        {/* Code Example (if provided) */}
        {question?.codeExample && (
          <div className="bg-muted/30 border border-border rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-3">
              <Icon name="Code" size={16} className="text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">Code Example</span>
            </div>
            <pre className="text-sm font-mono text-foreground overflow-x-auto">
              <code>{question?.codeExample}</code>
            </pre>
          </div>
        )}

        {/* Requirements/Hints */}
        {question?.requirements && question?.requirements?.length > 0 && (
          <div className="bg-accent/5 border border-accent/20 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-3">
              <Icon name="CheckSquare" size={16} className="text-accent" />
              <span className="text-sm font-medium text-accent">Requirements</span>
            </div>
            <ul className="space-y-2">
              {question?.requirements?.map((req, index) => (
                <li key={index} className="flex items-start space-x-2 text-sm text-foreground">
                  <Icon name="ArrowRight" size={14} className="text-accent mt-0.5 flex-shrink-0" />
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      {/* Question Footer */}
      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center space-x-4">
            <span>Expected time: {question?.expectedTime || '2-3 minutes'}</span>
            <span>•</span>
            <span>Focus on: {question?.focus || 'Problem-solving approach'}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Icon name="Lightbulb" size={14} />
            <span>Think aloud while solving</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionDisplay;