import React from 'react';
import Icon from '../../../components/AppIcon';

const TimelineReview = ({ 
  interviewData = null,
  className = ''
}) => {
  const mockData = {
    totalDuration: '8m 45s',
    startTime: '2025-09-29 13:30:00',
    endTime: '2025-09-29 13:38:45',
    questionTimes: {
      easy: '37s',
      medium: '1m 53s',
      hard: '3m 45s'
    },
    phases: [
      {
        id: 1,
        phase: 'Interview Started',
        time: '13:30:00',
        duration: null,
        icon: 'Play',
        status: 'completed'
      },
      {
        id: 2,
        phase: 'Easy Questions',
        time: '13:30:15',
        duration: '37s',
        icon: 'CheckCircle',
        status: 'completed',
        details: '2 questions completed'
      },
      {
        id: 3,
        phase: 'Medium Questions',
        time: '13:30:52',
        duration: '1m 53s',
        icon: 'CheckCircle',
        status: 'completed',
        details: '2 questions completed'
      },
      {
        id: 4,
        phase: 'Hard Questions',
        time: '13:32:45',
        duration: '3m 45s',
        icon: 'CheckCircle',
        status: 'completed',
        details: '2 questions completed'
      },
      {
        id: 5,
        phase: 'Interview Completed',
        time: '13:38:45',
        duration: null,
        icon: 'Trophy',
        status: 'completed'
      }
    ]
  };

  const displayData = interviewData || mockData;

  const formatTime = (timeString) => {
    const date = new Date(`2025-09-29 ${timeString}`);
    return date?.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const getPhaseColor = (phase) => {
    if (phase?.includes('Easy')) return 'text-success bg-success/10';
    if (phase?.includes('Medium')) return 'text-warning bg-warning/10';
    if (phase?.includes('Hard')) return 'text-error bg-error/10';
    if (phase?.includes('Started')) return 'text-accent bg-accent/10';
    return 'text-primary bg-primary/10';
  };

  return (
    <div className={`bg-card border border-border rounded-lg ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center space-x-3 mb-4">
          <Icon name="Clock" size={24} className="text-primary" />
          <div>
            <h2 className="text-xl font-semibold text-foreground">Interview Timeline</h2>
            <p className="text-sm text-muted-foreground">
              Complete duration and phase breakdown
            </p>
          </div>
        </div>

        {/* Duration Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-muted/30 rounded-lg p-3 text-center">
            <div className="text-lg font-bold text-foreground">
              {displayData?.totalDuration}
            </div>
            <div className="text-xs text-muted-foreground">Total Time</div>
          </div>
          <div className="bg-success/10 rounded-lg p-3 text-center">
            <div className="text-lg font-bold text-success">
              {displayData?.questionTimes?.easy}
            </div>
            <div className="text-xs text-muted-foreground">Easy Questions</div>
          </div>
          <div className="bg-warning/10 rounded-lg p-3 text-center">
            <div className="text-lg font-bold text-warning">
              {displayData?.questionTimes?.medium}
            </div>
            <div className="text-xs text-muted-foreground">Medium Questions</div>
          </div>
          <div className="bg-error/10 rounded-lg p-3 text-center">
            <div className="text-lg font-bold text-error">
              {displayData?.questionTimes?.hard}
            </div>
            <div className="text-xs text-muted-foreground">Hard Questions</div>
          </div>
        </div>
      </div>
      {/* Timeline */}
      <div className="p-6">
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border" />
          
          {/* Timeline Items */}
          <div className="space-y-6">
            {displayData?.phases?.map((phase, index) => (
              <div key={phase?.id} className="relative flex items-start space-x-4">
                {/* Timeline Dot */}
                <div className={`relative z-10 w-12 h-12 rounded-full border-2 border-card flex items-center justify-center ${getPhaseColor(phase?.phase)}`}>
                  <Icon name={phase?.icon} size={20} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 pb-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-foreground">
                      {phase?.phase}
                    </h3>
                    <div className="text-sm text-muted-foreground">
                      {formatTime(phase?.time)}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    {phase?.duration && (
                      <div className="flex items-center space-x-1">
                        <Icon name="Timer" size={14} />
                        <span>{phase?.duration}</span>
                      </div>
                    )}
                    {phase?.details && (
                      <div className="flex items-center space-x-1">
                        <Icon name="Info" size={14} />
                        <span>{phase?.details}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Performance Insights */}
      <div className="p-6 border-t border-border bg-muted/20">
        <h3 className="font-medium text-foreground mb-3">Time Management Analysis</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <Icon name="TrendingUp" size={16} className="text-success" />
            <span className="text-foreground">Efficient time usage across all difficulty levels</span>
          </div>
          <div className="flex items-center space-x-2">
            <Icon name="Target" size={16} className="text-accent" />
            <span className="text-foreground">Consistent pacing throughout interview</span>
          </div>
          <div className="flex items-center space-x-2">
            <Icon name="CheckCircle" size={16} className="text-success" />
            <span className="text-foreground">No questions skipped or timed out</span>
          </div>
          <div className="flex items-center space-x-2">
            <Icon name="Clock" size={16} className="text-primary" />
            <span className="text-foreground">Completed within optimal time range</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimelineReview;