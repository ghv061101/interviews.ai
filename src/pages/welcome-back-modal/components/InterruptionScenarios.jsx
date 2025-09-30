import React from 'react';
import Icon from '../../../components/AppIcon';

const InterruptionScenarios = ({ 
  interruptionType = 'browser_reload',
  className = ''
}) => {
  const scenarios = {
    browser_reload: {
      icon: 'RefreshCw',
      title: 'Browser Reload Detected',
      description: 'Your browser was refreshed during the interview',
      color: 'text-accent bg-accent/10 border-accent/20'
    },
    browser_crash: {
      icon: 'AlertTriangle',
      title: 'Unexpected Interruption',
      description: 'Your browser closed unexpectedly',
      color: 'text-error bg-error/10 border-error/20'
    },
    network_disconnect: {
      icon: 'WifiOff',
      title: 'Network Disconnection',
      description: 'Internet connection was lost temporarily',
      color: 'text-warning bg-warning/10 border-warning/20'
    },
    intentional_pause: {
      icon: 'Pause',
      title: 'Interview Paused',
      description: 'You paused the interview session',
      color: 'text-primary bg-primary/10 border-primary/20'
    },
    tab_switch: {
      icon: 'ExternalLink',
      title: 'Tab Switch Detected',
      description: 'You switched to another browser tab',
      color: 'text-secondary bg-secondary/10 border-secondary/20'
    }
  };

  const scenario = scenarios?.[interruptionType] || scenarios?.browser_reload;

  return (
    <div className={`${className}`}>
      <div className={`p-4 rounded-lg border ${scenario?.color}`}>
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <Icon name={scenario?.icon} size={20} className={scenario?.color?.split(' ')?.[0]} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className={`text-sm font-medium ${scenario?.color?.split(' ')?.[0]}`}>
              {scenario?.title}
            </h3>
            <p className={`text-sm mt-1 ${scenario?.color?.split(' ')?.[0]}/80`}>
              {scenario?.description}
            </p>
          </div>
        </div>
      </div>
      {/* Recovery Features */}
      <div className="mt-4 space-y-2">
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Icon name="CheckCircle" size={14} className="text-success" />
          <span>All answers automatically saved</span>
        </div>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Icon name="Clock" size={14} className="text-success" />
          <span>Timer state preserved</span>
        </div>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Icon name="Database" size={14} className="text-success" />
          <span>Progress data secured locally</span>
        </div>
      </div>
    </div>
  );
};

export default InterruptionScenarios;