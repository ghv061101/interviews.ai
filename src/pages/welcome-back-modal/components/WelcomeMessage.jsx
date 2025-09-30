import React from 'react';
import Icon from '../../../components/AppIcon';

const WelcomeMessage = ({ 
  candidateName = 'John Doe',
  sessionType = 'interrupted',
  className = ''
}) => {
  const getWelcomeContent = () => {
    switch (sessionType) {
      case 'paused':
        return {
          title: `Welcome back, ${candidateName}!`,
          message: `You paused your interview session. Your progress has been safely saved and you can continue exactly where you left off.`,
          icon: 'Pause',
          iconColor: 'text-warning'
        };
      case 'crashed':
        return {
          title: `Welcome back, ${candidateName}!`,
          message: `We detected that your previous session was interrupted unexpectedly. Don't worry - all your progress has been automatically saved.`,
          icon: 'AlertTriangle',
          iconColor: 'text-error'
        };
      case 'network':
        return {
          title: `Welcome back, ${candidateName}!`,
          message: `Your session was interrupted due to network issues. We've restored your progress and you can continue your interview seamlessly.`,
          icon: 'Wifi',
          iconColor: 'text-accent'
        };
      default:
        return {
          title: `Welcome back, ${candidateName}!`,
          message: `We found your incomplete interview session. You can pick up exactly where you left off with all your previous answers preserved.`,
          icon: 'RotateCcw',
          iconColor: 'text-primary'
        };
    }
  };

  const content = getWelcomeContent();

  return (
    <div className={`text-center ${className}`}>
      {/* Welcome Icon */}
      <div className="flex items-center justify-center mb-6">
        <div className={`flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 ${content?.iconColor}`}>
          <Icon name={content?.icon} size={32} />
        </div>
      </div>
      {/* Welcome Text */}
      <div className="space-y-3">
        <h1 className="text-2xl sm:text-3xl font-semibold text-foreground">
          {content?.title}
        </h1>
        
        <p className="text-base text-muted-foreground leading-relaxed max-w-md mx-auto">
          {content?.message}
        </p>
      </div>
      {/* Session Recovery Info */}
      <div className="mt-6 p-4 bg-success/10 border border-success/20 rounded-lg">
        <div className="flex items-center justify-center space-x-2 text-success">
          <Icon name="Shield" size={16} />
          <span className="text-sm font-medium">Secure Session Recovery</span>
        </div>
        <p className="text-xs text-success/80 mt-1">
          Your data is encrypted and stored locally for privacy
        </p>
      </div>
    </div>
  );
};

export default WelcomeMessage;