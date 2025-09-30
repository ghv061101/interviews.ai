import React, { useState, useEffect } from 'react';
import Icon from '../AppIcon';
import Button from './Button';

const InterviewTimer = ({ 
  initialTime = 1800, // 30 minutes in seconds
  onTimeUp = () => {},
  onPause = () => {},
  onResume = () => {},
  isPaused = false,
  autoSubmit = true,
  showPauseButton = true,
  difficulty = 'medium',
  questionNumber = 1,
  totalQuestions = 10,
  className = ''
}) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(!isPaused);

  useEffect(() => {
    setTimeLeft(initialTime);
  }, [initialTime]);

  useEffect(() => {
    setIsRunning(!isPaused);
  }, [isPaused]);

  useEffect(() => {
    let interval = null;
    
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(time => {
          if (time <= 1) {
            setIsRunning(false);
            onTimeUp();
            return 0;
          }
          return time - 1;
        });
      }, 1000);
    } else if (!isRunning) {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft, onTimeUp]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes?.toString()?.padStart(2, '0')}:${remainingSeconds?.toString()?.padStart(2, '0')}`;
  };

  const getUrgencyLevel = () => {
    const percentage = (timeLeft / initialTime) * 100;
    if (percentage <= 10) return 'critical';
    if (percentage <= 25) return 'warning';
    return 'normal';
  };

  const handlePause = () => {
    setIsRunning(false);
    onPause();
  };

  const handleResume = () => {
    setIsRunning(true);
    onResume();
  };

  const urgencyLevel = getUrgencyLevel();
  const percentage = (timeLeft / initialTime) * 100;

  const getTimerColors = () => {
    switch (urgencyLevel) {
      case 'critical':
        return {
          bg: 'bg-error/10',
          border: 'border-error/20',
          text: 'text-error',
          progress: 'bg-error'
        };
      case 'warning':
        return {
          bg: 'bg-warning/10',
          border: 'border-warning/20',
          text: 'text-warning',
          progress: 'bg-warning'
        };
      default:
        return {
          bg: 'bg-primary/10',
          border: 'border-primary/20',
          text: 'text-primary',
          progress: 'bg-primary'
        };
    }
  };

  const colors = getTimerColors();

  return (
    <div className={`fixed top-20 right-6 z-timer ${className}`}>
      <div className={`bg-card border ${colors?.border} rounded-lg shadow-interactive p-4 min-w-[200px] transition-all duration-300`}>
        {/* Timer Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Icon name="Clock" size={16} className={colors?.text} />
            <span className="text-sm font-medium text-foreground">Time Remaining</span>
          </div>
          {!isRunning && timeLeft > 0 && (
            <Icon name="Pause" size={14} className="text-muted-foreground" />
          )}
        </div>

        {/* Timer Display */}
        <div className="text-center mb-4">
          <div className={`text-2xl font-mono font-semibold ${colors?.text} transition-colors duration-200`}>
            {formatTime(timeLeft)}
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            Question {questionNumber} of {totalQuestions}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="w-full bg-muted rounded-full h-1.5">
            <div 
              className={`h-1.5 rounded-full transition-all duration-1000 ease-linear ${colors?.progress}`}
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>

        {/* Question Difficulty */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs text-muted-foreground">Difficulty:</span>
          <span className={`text-xs font-medium px-2 py-1 rounded-full ${
            difficulty === 'easy' ? 'bg-success/10 text-success' :
            difficulty === 'hard'? 'bg-error/10 text-error' : 'bg-warning/10 text-warning'
          }`}>
            {difficulty?.charAt(0)?.toUpperCase() + difficulty?.slice(1)}
          </span>
        </div>

        {/* Control Buttons */}
        {showPauseButton && timeLeft > 0 && (
          <div className="flex space-x-2">
            {isRunning ? (
              <Button
                variant="outline"
                size="sm"
                iconName="Pause"
                iconPosition="left"
                iconSize={14}
                onClick={handlePause}
                fullWidth
                className="text-xs"
              >
                Pause
              </Button>
            ) : (
              <Button
                variant="default"
                size="sm"
                iconName="Play"
                iconPosition="left"
                iconSize={14}
                onClick={handleResume}
                fullWidth
                className="text-xs"
              >
                Resume
              </Button>
            )}
          </div>
        )}

        {/* Time Up Message */}
        {timeLeft === 0 && (
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 text-error mb-2">
              <Icon name="AlertCircle" size={16} />
              <span className="text-sm font-medium">Time's Up!</span>
            </div>
            {autoSubmit && (
              <p className="text-xs text-muted-foreground">
                Auto-submitting your answer...
              </p>
            )}
          </div>
        )}

        {/* Urgency Warnings */}
        {urgencyLevel === 'warning' && isRunning && (
          <div className="mt-3 p-2 bg-warning/10 border border-warning/20 rounded-md">
            <div className="flex items-center space-x-2">
              <Icon name="AlertTriangle" size={14} className="text-warning" />
              <span className="text-xs text-warning font-medium">25% time remaining</span>
            </div>
          </div>
        )}

        {urgencyLevel === 'critical' && isRunning && (
          <div className="mt-3 p-2 bg-error/10 border border-error/20 rounded-md animate-pulse">
            <div className="flex items-center space-x-2">
              <Icon name="AlertCircle" size={14} className="text-error" />
              <span className="text-xs text-error font-medium">Final 10% - hurry up!</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InterviewTimer;