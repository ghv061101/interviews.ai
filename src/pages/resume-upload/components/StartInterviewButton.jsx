import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const StartInterviewButton = ({ 
  isEnabled = false,
  isLoading = false,
  onStartInterview = () => {},
  validationStatus = {},
  className = ''
}) => {
  const getButtonContent = () => {
    if (isLoading) {
      return {
        text: 'Preparing Interview...',
        icon: 'Loader2',
        variant: 'default'
      };
    }
    
    if (isEnabled) {
      return {
        text: 'Start Interview',
        icon: 'Play',
        variant: 'default'
      };
    }
    
    return {
      text: 'Complete Information Required',
      icon: 'AlertCircle',
      variant: 'outline'
    };
  };

  const buttonConfig = getButtonContent();
  const missingFields = Object.entries(validationStatus)?.filter(([_, isValid]) => !isValid)?.map(([field, _]) => field);

  const getFieldLabel = (field) => {
    const labels = {
      resume: 'Resume upload',
      fullName: 'Full name',
      email: 'Email address',
      phone: 'Phone number'
    };
    return labels?.[field] || field;
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Main Button */}
      <Button
        variant={buttonConfig?.variant}
        size="lg"
        iconName={buttonConfig?.icon}
        iconPosition="left"
        iconSize={20}
        onClick={onStartInterview}
        disabled={!isEnabled || isLoading}
        loading={isLoading}
        fullWidth
        className={`h-14 text-base font-medium transition-all duration-200 ${
          isEnabled ? 'shadow-interactive hover:shadow-lg' : ''
        }`}
      >
        {buttonConfig?.text}
      </Button>
      {/* Status Indicators */}
      {!isEnabled && !isLoading && (
        <div className="bg-warning/10 border border-warning/20 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Icon name="AlertTriangle" size={16} className="text-warning mt-0.5" />
            <div>
              <p className="text-sm font-medium text-warning mb-2">
                Please complete the following requirements:
              </p>
              <ul className="space-y-1">
                {missingFields?.map((field) => (
                  <li key={field} className="flex items-center space-x-2 text-sm text-warning/80">
                    <Icon name="Circle" size={8} />
                    <span>{getFieldLabel(field)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
      {/* Success State */}
      {isEnabled && !isLoading && (
        <div className="bg-success/10 border border-success/20 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <Icon name="CheckCircle" size={16} className="text-success" />
            <div>
              <p className="text-sm font-medium text-success">Ready to Start!</p>
              <p className="text-xs text-success/80 mt-1">
                All requirements completed. Click the button above to begin your interview.
              </p>
            </div>
          </div>
        </div>
      )}
      {/* Loading State Info */}
      {isLoading && (
        <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <Icon name="Brain" size={16} className="text-accent animate-pulse" />
            <div>
              <p className="text-sm font-medium text-accent">Preparing Your Interview</p>
              <p className="text-xs text-accent/80 mt-1">
                AI is generating personalized questions based on your resume...
              </p>
            </div>
          </div>
        </div>
      )}
      {/* Interview Info */}
      <div className="bg-muted/30 rounded-lg p-4">
        <h4 className="flex items-center space-x-2 text-sm font-medium text-foreground mb-3">
          <Icon name="Info" size={16} />
          <span>What to Expect</span>
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-start space-x-2">
            <Icon name="Clock" size={14} className="text-muted-foreground mt-0.5" />
            <div>
              <p className="font-medium text-foreground">Timed Questions</p>
              <p className="text-muted-foreground text-xs">20s-120s per question</p>
            </div>
          </div>
          <div className="flex items-start space-x-2">
            <Icon name="Target" size={14} className="text-muted-foreground mt-0.5" />
            <div>
              <p className="font-medium text-foreground">6 Questions</p>
              <p className="text-muted-foreground text-xs">Easy, Medium, Hard</p>
            </div>
          </div>
          <div className="flex items-start space-x-2">
            <Icon name="Brain" size={14} className="text-muted-foreground mt-0.5" />
            <div>
              <p className="font-medium text-foreground">AI Evaluation</p>
              <p className="text-muted-foreground text-xs">Instant scoring</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StartInterviewButton;