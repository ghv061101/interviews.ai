import React from 'react';
import Icon from '../../../components/AppIcon';

const SessionProgressCard = ({ 
  sessionData = {},
  className = ''
}) => {
  const {
    candidateName = 'John Doe',
    position = 'Senior Frontend Developer',
    currentQuestion = 3,
    totalQuestions = 6,
    completedQuestions = 2,
    timeRemaining = '18:45',
    lastActivity = '2025-09-29 13:25:00',
    interviewId = 'INT-2025-001',
    difficulty = 'Medium'
  } = sessionData;

  const progressPercentage = (completedQuestions / totalQuestions) * 100;

  const formatLastActivity = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  };

  const getDifficultyColor = (level) => {
    switch (level?.toLowerCase()) {
      case 'easy': return 'text-success bg-success/10';
      case 'hard': return 'text-error bg-error/10';
      default: return 'text-warning bg-warning/10';
    }
  };

  return (
    <div className={`bg-muted/30 rounded-lg p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full">
            <span className="text-lg font-semibold text-primary">
              {candidateName?.split(' ')?.map(n => n?.[0])?.join('')}
            </span>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">{candidateName}</h3>
            <p className="text-sm text-muted-foreground">{position}</p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-xs text-muted-foreground bg-background px-2 py-1 rounded">
            ID: {interviewId}
          </span>
        </div>
      </div>
      {/* Progress Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-foreground">Interview Progress</span>
          <span className="text-sm text-muted-foreground">
            {completedQuestions} of {totalQuestions} completed
          </span>
        </div>
        
        <div className="w-full bg-muted rounded-full h-3">
          <div 
            className="bg-primary h-3 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>

        {/* Current Status */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="text-center sm:text-left">
            <div className="text-sm text-muted-foreground">Current Question</div>
            <div className="text-lg font-semibold text-foreground">
              {currentQuestion} of {totalQuestions}
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-sm text-muted-foreground">Time Remaining</div>
            <div className="text-lg font-mono font-semibold text-warning">
              {timeRemaining}
            </div>
          </div>
          
          <div className="text-center sm:text-right">
            <div className="text-sm text-muted-foreground">Difficulty</div>
            <span className={`inline-block text-sm font-medium px-2 py-1 rounded-full ${getDifficultyColor(difficulty)}`}>
              {difficulty}
            </span>
          </div>
        </div>
      </div>
      {/* Last Activity */}
      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Icon name="Clock" size={14} />
          <span>Last activity: {formatLastActivity(lastActivity)}</span>
        </div>
      </div>
      {/* Auto-save Confirmation */}
      <div className="mt-3 flex items-center space-x-2 text-sm text-success">
        <Icon name="CheckCircle" size={14} />
        <span>All progress automatically saved</span>
      </div>
    </div>
  );
};

export default SessionProgressCard;