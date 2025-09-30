import React from 'react';
import Button from '../../../components/ui/Button';

const ActionButtons = ({ 
  onContinue = () => {},
  onStartOver = () => {},
  onExit = () => {},
  loading = false,
  className = ''
}) => {
  return (
    <div className={`space-y-4 ${className}`}>
      {/* Primary Action */}
      <Button
        variant="default"
        size="lg"
        iconName="Play"
        iconPosition="left"
        iconSize={18}
        onClick={onContinue}
        loading={loading}
        fullWidth
        className="h-12 text-base font-medium"
      >
        Continue Interview
      </Button>

      {/* Secondary Actions */}
      <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
        <Button
          variant="outline"
          size="default"
          iconName="RefreshCw"
          iconPosition="left"
          iconSize={16}
          onClick={onStartOver}
          fullWidth
          className="sm:flex-1"
        >
          Start Over
        </Button>
        
        <Button
          variant="ghost"
          size="default"
          iconName="X"
          iconPosition="left"
          iconSize={16}
          onClick={onExit}
          fullWidth
          className="sm:flex-1"
        >
          Exit Interview
        </Button>
      </div>

      {/* Help Section */}
      <div className="pt-4 border-t border-border">
        <div className="flex flex-col sm:flex-row items-center justify-between space-y-2 sm:space-y-0">
          <button
            onClick={() => console.log('Download session data')}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center space-x-1"
          >
            <span>Download Progress Report</span>
          </button>
          
          <button
            onClick={() => console.log('Contact support')}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center space-x-1"
          >
            <span>Need Help?</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActionButtons;