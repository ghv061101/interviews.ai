import React from 'react';
import Icon from '../../../components/AppIcon';

const DashboardMetrics = ({ 
  totalCandidates = 0,
  averageScore = 0,
  completionRate = 0,
  pendingInterviews = 0,
  className = ''
}) => {
  const metrics = [
    {
      id: 'total',
      label: 'Total Candidates',
      value: totalCandidates,
      icon: 'Users',
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      change: '+12%',
      changeType: 'positive'
    },
    {
      id: 'average',
      label: 'Average Score',
      value: `${averageScore}%`,
      icon: 'TrendingUp',
      color: 'text-success',
      bgColor: 'bg-success/10',
      change: '+5.2%',
      changeType: 'positive'
    },
    {
      id: 'completion',
      label: 'Completion Rate',
      value: `${completionRate}%`,
      icon: 'CheckCircle',
      color: 'text-accent',
      bgColor: 'bg-accent/10',
      change: '+8.1%',
      changeType: 'positive'
    },
    {
      id: 'pending',
      label: 'Pending Interviews',
      value: pendingInterviews,
      icon: 'Clock',
      color: 'text-warning',
      bgColor: 'bg-warning/10',
      change: '-3',
      changeType: 'negative'
    }
  ];

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ${className}`}>
      {metrics?.map((metric) => (
        <div key={metric?.id} className="bg-card border border-border rounded-lg p-6 shadow-card hover:shadow-interactive transition-all duration-200">
          <div className="flex items-center justify-between mb-4">
            <div className={`flex items-center justify-center w-12 h-12 rounded-lg ${metric?.bgColor}`}>
              <Icon name={metric?.icon} size={24} className={metric?.color} />
            </div>
            <div className={`text-xs font-medium px-2 py-1 rounded-full ${
              metric?.changeType === 'positive' ?'bg-success/10 text-success' :'bg-error/10 text-error'
            }`}>
              {metric?.change}
            </div>
          </div>
          
          <div className="space-y-1">
            <h3 className="text-2xl font-bold text-foreground">{metric?.value}</h3>
            <p className="text-sm text-muted-foreground">{metric?.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardMetrics;