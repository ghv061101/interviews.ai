import React from 'react';
import Icon from '../../../components/AppIcon';

const PerformanceBreakdown = ({ 
  questionBreakdown = null,
  className = ''
}) => {
  const mockBreakdown = [
    {
      id: 1,
      question: "Explain the difference between useState and useReducer hooks in React",
      difficulty: 'easy',
      score: 95,
      timeSpent: '18s',
      maxTime: '20s',
      aiInsight: "Excellent explanation with clear examples and use cases. Demonstrated deep understanding of React hooks."
    },
    {
      id: 2,
      question: "How would you optimize a React component that renders a large list?",
      difficulty: 'easy',
      score: 88,
      timeSpent: '19s',
      maxTime: '20s',
      aiInsight: "Good coverage of virtualization and memoization. Could have mentioned React.memo and useMemo in more detail."
    },
    {
      id: 3,
      question: "Implement a custom hook for handling API calls with loading states",
      difficulty: 'medium',
      score: 82,
      timeSpent: '55s',
      maxTime: '60s',
      aiInsight: "Solid implementation with proper error handling. Consider adding cleanup for cancelled requests."
    },
    {
      id: 4,
      question: "Design a scalable state management solution for a large React application",
      difficulty: 'medium',
      score: 78,
      timeSpent: '58s',
      maxTime: '60s',
      aiInsight: "Good understanding of Redux patterns. Could improve by discussing context API alternatives and performance implications."
    },
    {
      id: 5,
      question: "Explain how you would implement server-side rendering with React",
      difficulty: 'hard',
      score: 85,
      timeSpent: '110s',
      maxTime: '120s',
      aiInsight: "Comprehensive answer covering Next.js and manual SSR setup. Excellent discussion of hydration challenges."
    },
    {
      id: 6,
      question: "Design a micro-frontend architecture using React",
      difficulty: 'hard',
      score: 72,
      timeSpent: '115s',
      maxTime: '120s',
      aiInsight: "Basic understanding shown but missed key concepts like module federation and shared dependencies."
    }
  ];

  const displayBreakdown = questionBreakdown || mockBreakdown;

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'text-success bg-success/10 border-success/20';
      case 'medium': return 'text-warning bg-warning/10 border-warning/20';
      case 'hard': return 'text-error bg-error/10 border-error/20';
      default: return 'text-muted-foreground bg-muted/10 border-muted/20';
    }
  };

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-success';
    if (score >= 80) return 'text-accent';
    if (score >= 70) return 'text-warning';
    return 'text-error';
  };

  const getTimeColor = (timeSpent, maxTime) => {
    const spent = parseInt(timeSpent);
    const max = parseInt(maxTime);
    const percentage = (spent / max) * 100;
    
    if (percentage <= 75) return 'text-success';
    if (percentage <= 90) return 'text-warning';
    return 'text-error';
  };

  const groupedQuestions = displayBreakdown?.reduce((acc, question) => {
    if (!acc?.[question?.difficulty]) {
      acc[question.difficulty] = [];
    }
    acc?.[question?.difficulty]?.push(question);
    return acc;
  }, {});

  return (
    <div className={`bg-card border border-border rounded-lg ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center space-x-3">
          <Icon name="BarChart3" size={24} className="text-primary" />
          <div>
            <h2 className="text-xl font-semibold text-foreground">Performance Breakdown</h2>
            <p className="text-sm text-muted-foreground">
              Detailed analysis of each question response
            </p>
          </div>
        </div>
      </div>
      {/* Question Groups */}
      <div className="p-6">
        {Object.entries(groupedQuestions)?.map(([difficulty, questions]) => (
          <div key={difficulty} className="mb-8 last:mb-0">
            {/* Difficulty Header */}
            <div className="flex items-center space-x-3 mb-4">
              <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getDifficultyColor(difficulty)}`}>
                {difficulty?.charAt(0)?.toUpperCase() + difficulty?.slice(1)} Questions
              </span>
              <div className="text-sm text-muted-foreground">
                {questions?.length} question{questions?.length > 1 ? 's' : ''}
              </div>
            </div>

            {/* Questions */}
            <div className="space-y-4">
              {questions?.map((question) => (
                <div key={question?.id} className="border border-border rounded-lg p-4 hover:bg-muted/20 transition-colors">
                  {/* Question Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-medium text-foreground mb-2 leading-relaxed">
                        Q{question?.id}: {question?.question}
                      </h3>
                      <div className="flex items-center space-x-4 text-sm">
                        <div className="flex items-center space-x-1">
                          <Icon name="Target" size={14} className={getScoreColor(question?.score)} />
                          <span className={`font-medium ${getScoreColor(question?.score)}`}>
                            {question?.score}/100
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Icon name="Clock" size={14} className={getTimeColor(question?.timeSpent, question?.maxTime)} />
                          <span className={getTimeColor(question?.timeSpent, question?.maxTime)}>
                            {question?.timeSpent} / {question?.maxTime}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className={`text-2xl font-bold ${getScoreColor(question?.score)} ml-4`}>
                      {question?.score}
                    </div>
                  </div>

                  {/* AI Insight */}
                  <div className="bg-muted/30 rounded-lg p-3">
                    <div className="flex items-start space-x-2">
                      <Icon name="Brain" size={16} className="text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="text-xs font-medium text-primary mb-1">AI Insight</div>
                        <p className="text-sm text-foreground leading-relaxed">
                          {question?.aiInsight}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      {/* Summary Stats */}
      <div className="p-6 border-t border-border bg-muted/20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-success">
              {displayBreakdown?.filter(q => q?.score >= 90)?.length}
            </div>
            <div className="text-sm text-muted-foreground">Excellent Answers</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-accent">
              {displayBreakdown?.filter(q => q?.score >= 80 && q?.score < 90)?.length}
            </div>
            <div className="text-sm text-muted-foreground">Good Answers</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-warning">
              {displayBreakdown?.filter(q => q?.score < 80)?.length}
            </div>
            <div className="text-sm text-muted-foreground">Needs Improvement</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceBreakdown;