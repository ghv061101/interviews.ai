import React, { useState, useEffect } from 'react';
import Icon from '../AppIcon';
import Button from './Button';

const SessionRecoveryModal = ({ 
  isOpen = false,
  onClose = () => {},
  onContinue = () => {},
  onStartNew = () => {},
  sessionData = null,
  autoDetect = true,
  className = ''
}) => {
  const [showModal, setShowModal] = useState(isOpen);
  const [detectedSession, setDetectedSession] = useState(sessionData);

  // Mock session data if none provided
  const mockSessionData = {
    candidateName: 'John Doe',
    position: 'Senior Frontend Developer',
    currentQuestion: 3,
    totalQuestions: 10,
    timeRemaining: '15:30',
    lastActivity: '2025-09-29 13:25:00',
    completedQuestions: 2,
    progress: 30,
    interviewId: 'INT-2025-001',
    sessionId: 'SES-789123'
  };

  useEffect(() => {
    if (autoDetect && !sessionData) {
      // Simulate session detection
      const hasStoredSession = localStorage.getItem('interview_session');
      if (hasStoredSession) {
        setDetectedSession(mockSessionData);
        setShowModal(true);
      }
    }
  }, [autoDetect, sessionData]);

  useEffect(() => {
    setShowModal(isOpen);
  }, [isOpen]);

  useEffect(() => {
    if (sessionData) {
      setDetectedSession(sessionData);
    }
  }, [sessionData]);

  const handleContinue = () => {
    onContinue(detectedSession);
    setShowModal(false);
  };

  const handleStartNew = () => {
    // Clear stored session
    localStorage.removeItem('interview_session');
    onStartNew();
    setShowModal(false);
  };

  const handleClose = () => {
    setShowModal(false);
    onClose();
  };

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

  if (!showModal || !detectedSession) return null;

  return (
    <div className="fixed inset-0 z-modal flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={handleClose}
      />
      {/* Modal */}
      <div className={`relative bg-card border border-border rounded-lg shadow-modal max-w-md w-full animate-scale-in ${className}`}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-accent/10 rounded-full">
              <Icon name="RotateCcw" size={20} className="text-accent" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">Resume Interview</h2>
              <p className="text-sm text-muted-foreground">Previous session detected</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            iconName="X"
            iconSize={16}
            onClick={handleClose}
            className="text-muted-foreground hover:text-foreground"
          />
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Session Info */}
          <div className="bg-muted/30 rounded-lg p-4 mb-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-medium text-foreground">{detectedSession?.candidateName}</h3>
                <p className="text-sm text-muted-foreground">{detectedSession?.position}</p>
              </div>
              <span className="text-xs text-muted-foreground bg-background px-2 py-1 rounded">
                ID: {detectedSession?.interviewId}
              </span>
            </div>

            {/* Progress */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-medium text-foreground">
                  {detectedSession?.currentQuestion} of {detectedSession?.totalQuestions} questions
                </span>
              </div>
              
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-accent h-2 rounded-full transition-all duration-300"
                  style={{ width: `${detectedSession?.progress}%` }}
                />
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Completed:</span>
                  <span className="ml-2 font-medium text-success">
                    {detectedSession?.completedQuestions} questions
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Time left:</span>
                  <span className="ml-2 font-mono font-medium text-warning">
                    {detectedSession?.timeRemaining}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Last Activity */}
          <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
            <Icon name="Clock" size={14} />
            <span>Last activity: {formatLastActivity(detectedSession?.lastActivity)}</span>
          </div>

          {/* Warning */}
          <div className="bg-warning/10 border border-warning/20 rounded-lg p-3 mb-6">
            <div className="flex items-start space-x-2">
              <Icon name="AlertTriangle" size={16} className="text-warning mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-warning mb-1">Session Recovery</p>
                <p className="text-warning/80">
                  Your previous interview session was interrupted. You can continue where you left off 
                  or start a completely new interview.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
            <Button
              variant="default"
              iconName="Play"
              iconPosition="left"
              iconSize={16}
              onClick={handleContinue}
              fullWidth
              className="sm:flex-1"
            >
              Continue Interview
            </Button>
            <Button
              variant="outline"
              iconName="RefreshCw"
              iconPosition="left"
              iconSize={16}
              onClick={handleStartNew}
              fullWidth
              className="sm:flex-1"
            >
              Start New Interview
            </Button>
          </div>

          {/* Additional Options */}
          <div className="mt-4 pt-4 border-t border-border">
            <div className="flex items-center justify-between text-sm">
              <button
                onClick={() => console.log('Download session data')}
                className="text-muted-foreground hover:text-foreground transition-colors flex items-center space-x-1"
              >
                <Icon name="Download" size={14} />
                <span>Download session data</span>
              </button>
              <button
                onClick={() => console.log('Contact support')}
                className="text-muted-foreground hover:text-foreground transition-colors flex items-center space-x-1"
              >
                <Icon name="HelpCircle" size={14} />
                <span>Need help?</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionRecoveryModal;