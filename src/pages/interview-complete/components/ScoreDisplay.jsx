import React from 'react';
import Icon from '../../../components/AppIcon';

const ScoreDisplay = ({ 
  finalScore = 85,
  percentileRank = 78,
  totalQuestions = 6,
  correctAnswers = 5,
  className = ''
}) => {
  const getScoreColor = (score) => {
    if (score >= 90) return 'text-success';
    if (score >= 80) return 'text-accent';
    if (score >= 70) return 'text-warning';
    return 'text-error';
  };

  const getScoreIcon = (score) => {
    if (score >= 90) return 'Trophy';
    if (score >= 80) return 'Award';
    if (score >= 70) return 'Star';
    return 'AlertCircle';
  };

  const getPerformanceLevel = (score) => {
    if (score >= 90) return 'Excellent';
    if (score >= 80) return 'Good';
    if (score >= 70) return 'Average';
    return 'Needs Improvement';
  };

  const scoreColor = getScoreColor(finalScore);
  const scoreIcon = getScoreIcon(finalScore);
  const performanceLevel = getPerformanceLevel(finalScore);

  return (
    <div className={`bg-card border border-border rounded-lg p-6 text-center ${className}`}>
      {/* Score Icon */}
      <div className="flex justify-center mb-4">
        <div className={`w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center`}>
          <Icon name={scoreIcon} size={32} className={scoreColor} />
        </div>
      </div>

      {/* Final Score */}
      <div className="mb-4">
        <div className={`text-5xl font-bold ${scoreColor} mb-2`}>
          {finalScore}
        </div>
        <div className="text-lg font-medium text-foreground mb-1">
          {performanceLevel} Performance
        </div>
        <div className="text-sm text-muted-foreground">
          Out of 100 points
        </div>
      </div>

      {/* Score Breakdown */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-muted/30 rounded-lg p-3">
          <div className="text-2xl font-bold text-foreground">
            {correctAnswers}/{totalQuestions}
          </div>
          <div className="text-sm text-muted-foreground">
            Questions Correct
          </div>
        </div>
        <div className="bg-muted/30 rounded-lg p-3">
          <div className="text-2xl font-bold text-accent">
            {percentileRank}%
          </div>
          <div className="text-sm text-muted-foreground">
            Percentile Rank
          </div>
        </div>
      </div>

      {/* Performance Indicator */}
      <div className="w-full bg-muted rounded-full h-3 mb-2">
        <div 
          className={`h-3 rounded-full transition-all duration-1000 ease-out ${
            finalScore >= 90 ? 'bg-success' :
            finalScore >= 80 ? 'bg-accent' :
            finalScore >= 70 ? 'bg-warning' : 'bg-error'
          }`}
          style={{ width: `${finalScore}%` }}
        />
      </div>
      <div className="text-xs text-muted-foreground">
        Your score compared to other candidates
      </div>
    </div>
  );
};

export default ScoreDisplay;