import React from 'react';
import Icon from '../../../components/AppIcon';

const InterviewProgress = ({ 
  currentQuestion = 0,
  totalQuestions = 6,
  completedQuestions = 0,
  difficulty = 'medium',
  timeElapsed = 0,
  className = ''
}) => {
  const progressPercentage = ((currentQuestion) / totalQuestions) * 100;
  const completionPercentage = (completedQuestions / totalQuestions) * 100;

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds?.toString()?.padStart(2, '0')}`;
  };

  const getDifficultyPhase = () => {
    if (currentQuestion < 2) return { phase: 'Easy Questions', color: 'text-success', bg: 'bg-success/10' };
    if (currentQuestion < 4) return { phase: 'Medium Questions', color: 'text-warning', bg: 'bg-warning/10' };
    return { phase: 'Hard Questions', color: 'text-error', bg: 'bg-error/10' };
  };

  const difficultyPhase = getDifficultyPhase();

  return (
    <div className={`bg-card border border-border rounded-lg shadow-card p-6 ${className}`}>
      {/* Progress Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <Icon name="BarChart3" size={20} className="text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Interview Progress</h3>
        </div>
        
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Icon name="Clock" size={14} />
          <span>Time: {formatTime(timeElapsed)}</span>
        </div>
      </div>
      {/* Current Phase */}
      <div className={`inline-flex items-center px-3 py-2 rounded-lg mb-4 ${difficultyPhase?.bg}`}>
        <Icon name="Target" size={16} className={`mr-2 ${difficultyPhase?.color}`} />
        <span className={`text-sm font-medium ${difficultyPhase?.color}`}>
          {difficultyPhase?.phase}
        </span>
      </div>
      {/* Progress Bar */}
      <div className="space-y-3 mb-6">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Overall Progress</span>
          <span className="font-medium text-foreground">
            {currentQuestion} of {totalQuestions} questions
          </span>
        </div>
        
        <div className="w-full bg-muted rounded-full h-3 relative overflow-hidden">
          {/* Completed progress */}
          <div 
            className="bg-success h-3 rounded-full transition-all duration-500 ease-out absolute left-0 top-0"
            style={{ width: `${completionPercentage}%` }}
          />
          {/* Current progress */}
          <div 
            className="bg-primary h-3 rounded-full transition-all duration-500 ease-out absolute left-0 top-0"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>0%</span>
          <span>50%</span>
          <span>100%</span>
        </div>
      </div>
      {/* Question Breakdown */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-success/10 rounded-full mx-auto mb-2">
            <Icon name="CheckCircle" size={20} className="text-success" />
          </div>
          <div className="text-sm font-medium text-foreground">Easy</div>
          <div className="text-xs text-muted-foreground">
            {Math.min(currentQuestion, 2)} / 2 completed
          </div>
        </div>
        
        <div className="text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-warning/10 rounded-full mx-auto mb-2">
            <Icon name="AlertCircle" size={20} className="text-warning" />
          </div>
          <div className="text-sm font-medium text-foreground">Medium</div>
          <div className="text-xs text-muted-foreground">
            {Math.max(0, Math.min(currentQuestion - 2, 2))} / 2 completed
          </div>
        </div>
        
        <div className="text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-error/10 rounded-full mx-auto mb-2">
            <Icon name="AlertTriangle" size={20} className="text-error" />
          </div>
          <div className="text-sm font-medium text-foreground">Hard</div>
          <div className="text-xs text-muted-foreground">
            {Math.max(0, Math.min(currentQuestion - 4, 2))} / 2 completed
          </div>
        </div>
      </div>
      {/* Milestones */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-2">
            <Icon 
              name={completedQuestions >= 2 ? "CheckCircle" : "Circle"} 
              size={16} 
              className={completedQuestions >= 2 ? "text-success" : "text-muted-foreground"} 
            />
            <span className={completedQuestions >= 2 ? "text-foreground" : "text-muted-foreground"}>
              Easy section complete
            </span>
          </div>
          {completedQuestions >= 2 && (
            <Icon name="Check" size={14} className="text-success" />
          )}
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-2">
            <Icon 
              name={completedQuestions >= 4 ? "CheckCircle" : "Circle"} 
              size={16} 
              className={completedQuestions >= 4 ? "text-success" : "text-muted-foreground"} 
            />
            <span className={completedQuestions >= 4 ? "text-foreground" : "text-muted-foreground"}>
              Medium section complete
            </span>
          </div>
          {completedQuestions >= 4 && (
            <Icon name="Check" size={14} className="text-success" />
          )}
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-2">
            <Icon 
              name={completedQuestions >= 6 ? "CheckCircle" : "Circle"} 
              size={16} 
              className={completedQuestions >= 6 ? "text-success" : "text-muted-foreground"} 
            />
            <span className={completedQuestions >= 6 ? "text-foreground" : "text-muted-foreground"}>
              Interview complete
            </span>
          </div>
          {completedQuestions >= 6 && (
            <Icon name="Check" size={14} className="text-success" />
          )}
        </div>
      </div>
      {/* Encouragement Message */}
      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex items-start space-x-2">
          <Icon name="MessageSquare" size={16} className="text-accent mt-0.5" />
          <div className="text-sm">
            <p className="font-medium text-accent mb-1">Keep Going!</p>
            <p className="text-muted-foreground">
              {currentQuestion === 0 && "You're just getting started. Take your time and think through each question."}
              {currentQuestion > 0 && currentQuestion < 3 && "Great start! You're building momentum through the easy questions."}
              {currentQuestion >= 3 && currentQuestion < 5 && "Excellent progress! You're tackling the medium difficulty questions well."}
              {currentQuestion >= 5 && "Almost there! You're on the final stretch with the challenging questions."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewProgress;