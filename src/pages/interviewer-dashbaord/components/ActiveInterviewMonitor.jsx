import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ActiveInterviewMonitor = ({ className = '' }) => {
  const [activeInterviews, setActiveInterviews] = useState([]);

  // Mock active interviews data
  const mockActiveInterviews = [
    {
      id: 'INT-2025-003',
      candidateName: 'Alex Thompson',
      position: 'Full Stack Developer',
      currentQuestion: 4,
      totalQuestions: 6,
      timeRemaining: '08:45',
      difficulty: 'Medium',
      status: 'answering',
      startTime: '13:15:00',
      avatar: null
    },
    {
      id: 'INT-2025-004',
      candidateName: 'Maria Garcia',
      position: 'Frontend Developer',
      currentQuestion: 2,
      totalQuestions: 6,
      timeRemaining: '12:30',
      difficulty: 'Easy',
      status: 'reading',
      startTime: '13:30:00',
      avatar: null
    }
  ];

  useEffect(() => {
    setActiveInterviews(mockActiveInterviews);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'answering':
        return 'text-success bg-success/10';
      case 'reading':
        return 'text-accent bg-accent/10';
      case 'paused':
        return 'text-warning bg-warning/10';
      default:
        return 'text-muted-foreground bg-muted/10';
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy':
        return 'text-success bg-success/10';
      case 'Medium':
        return 'text-warning bg-warning/10';
      case 'Hard':
        return 'text-error bg-error/10';
      default:
        return 'text-muted-foreground bg-muted/10';
    }
  };

  if (activeInterviews?.length === 0) {
    return (
      <div className={`bg-card border border-border rounded-lg p-6 shadow-card ${className}`}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">Active Interviews</h2>
          <Icon name="Activity" size={20} className="text-muted-foreground" />
        </div>
        <div className="text-center py-8">
          <Icon name="Users" size={48} className="text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">No active interviews</p>
          <p className="text-sm text-muted-foreground mt-1">Interviews will appear here when candidates start</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-card border border-border rounded-lg shadow-card ${className}`}>
      <div className="flex items-center justify-between p-6 border-b border-border">
        <h2 className="text-lg font-semibold text-foreground">Active Interviews</h2>
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
            <span className="text-sm text-muted-foreground">Live</span>
          </div>
          <Button variant="ghost" size="sm" iconName="RefreshCw" iconSize={16} />
        </div>
      </div>
      <div className="p-6 space-y-4">
        {activeInterviews?.map((interview) => (
          <div key={interview?.id} className="border border-border rounded-lg p-4 hover:bg-muted/30 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-full">
                  <span className="text-sm font-medium text-primary">
                    {interview?.candidateName?.split(' ')?.map(n => n?.[0])?.join('')}
                  </span>
                </div>
                <div>
                  <h3 className="font-medium text-foreground">{interview?.candidateName}</h3>
                  <p className="text-sm text-muted-foreground">{interview?.position}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-muted-foreground">Started at</div>
                <div className="text-sm font-medium text-foreground">{interview?.startTime}</div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="text-center">
                <div className="text-lg font-bold text-foreground">{interview?.currentQuestion}/{interview?.totalQuestions}</div>
                <div className="text-xs text-muted-foreground">Questions</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-mono font-bold text-warning">{interview?.timeRemaining}</div>
                <div className="text-xs text-muted-foreground">Time Left</div>
              </div>
              <div className="text-center">
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(interview?.difficulty)}`}>
                  {interview?.difficulty}
                </span>
                <div className="text-xs text-muted-foreground mt-1">Difficulty</div>
              </div>
              <div className="text-center">
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(interview?.status)}`}>
                  {interview?.status?.charAt(0)?.toUpperCase() + interview?.status?.slice(1)}
                </span>
                <div className="text-xs text-muted-foreground mt-1">Status</div>
              </div>
            </div>

            <div className="w-full bg-muted rounded-full h-2 mb-4">
              <div 
                className="bg-accent h-2 rounded-full transition-all duration-300"
                style={{ width: `${(interview?.currentQuestion / interview?.totalQuestions) * 100}%` }}
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">ID: {interview?.id}</span>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  iconName="Eye"
                  iconPosition="left"
                  iconSize={14}
                  onClick={() => console.log('Monitor interview', interview?.id)}
                >
                  Monitor
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  iconName="MessageSquare"
                  iconSize={14}
                  onClick={() => console.log('View chat', interview?.id)}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActiveInterviewMonitor;