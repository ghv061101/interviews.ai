import React from 'react';
import Icon from '../AppIcon';

const CandidateProgressIndicator = ({ 
  currentStep = 1, 
  totalSteps = 3, 
  completionStatus = 'in-progress',
  timeRemaining = null,
  stepLabels = ['Upload Resume', 'Interview Questions', 'Complete'],
  className = ''
}) => {
  const progressPercentage = (currentStep / totalSteps) * 100;
  
  const getStepStatus = (stepIndex) => {
    if (stepIndex < currentStep) return 'completed';
    if (stepIndex === currentStep) return 'current';
    return 'upcoming';
  };

  const getStepIcon = (stepIndex, status) => {
    if (status === 'completed') return 'CheckCircle';
    if (status === 'current') return 'Circle';
    return 'Circle';
  };

  return (
    <div className={`bg-card border-b border-border px-6 py-4 ${className}`}>
      {/* Progress Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <h2 className="text-lg font-medium text-foreground">Interview Progress</h2>
          {timeRemaining && (
            <div className="flex items-center space-x-1 text-sm text-muted-foreground">
              <Icon name="Clock" size={14} />
              <span>{timeRemaining}</span>
            </div>
          )}
        </div>
        <div className="text-sm text-muted-foreground">
          Step {currentStep} of {totalSteps}
        </div>
      </div>
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="w-full bg-muted rounded-full h-2">
          <div 
            className="bg-primary h-2 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>
      {/* Step Indicators - Desktop */}
      <div className="hidden md:flex items-center justify-between">
        {stepLabels?.map((label, index) => {
          const stepNumber = index + 1;
          const status = getStepStatus(stepNumber);
          const iconName = getStepIcon(stepNumber, status);
          
          return (
            <div key={index} className="flex items-center">
              <div className="flex flex-col items-center">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all duration-200 ${
                  status === 'completed' 
                    ? 'bg-success border-success text-success-foreground' 
                    : status === 'current' ?'bg-primary border-primary text-primary-foreground' :'bg-background border-muted-foreground text-muted-foreground'
                }`}>
                  {status === 'completed' ? (
                    <Icon name="Check" size={16} />
                  ) : (
                    <span className="text-sm font-medium">{stepNumber}</span>
                  )}
                </div>
                <span className={`mt-2 text-sm font-medium ${
                  status === 'current' ? 'text-foreground' : 'text-muted-foreground'
                }`}>
                  {label}
                </span>
              </div>
              {index < stepLabels?.length - 1 && (
                <div className={`flex-1 h-0.5 mx-4 ${
                  stepNumber < currentStep ? 'bg-success' : 'bg-muted'
                }`} />
              )}
            </div>
          );
        })}
      </div>
      {/* Step Indicators - Mobile */}
      <div className="md:hidden">
        <div className="flex items-center justify-center space-x-2">
          {stepLabels?.map((_, index) => {
            const stepNumber = index + 1;
            const status = getStepStatus(stepNumber);
            
            return (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-200 ${
                  status === 'completed' 
                    ? 'bg-success' 
                    : status === 'current' ?'bg-primary' :'bg-muted'
                }`}
              />
            );
          })}
        </div>
        <div className="text-center mt-3">
          <span className="text-sm font-medium text-foreground">
            {stepLabels?.[currentStep - 1]}
          </span>
        </div>
      </div>
      {/* Completion Status */}
      {completionStatus === 'completed' && (
        <div className="mt-4 p-3 bg-success/10 border border-success/20 rounded-lg">
          <div className="flex items-center space-x-2">
            <Icon name="CheckCircle" size={16} className="text-success" />
            <span className="text-sm font-medium text-success">Interview completed successfully!</span>
          </div>
        </div>
      )}
      {completionStatus === 'paused' && (
        <div className="mt-4 p-3 bg-warning/10 border border-warning/20 rounded-lg">
          <div className="flex items-center space-x-2">
            <Icon name="Pause" size={16} className="text-warning" />
            <span className="text-sm font-medium text-warning">Interview paused - you can resume anytime</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default CandidateProgressIndicator;