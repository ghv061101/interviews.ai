import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const CandidateHeader = ({ 
  candidate = {},
  onBack = () => {},
  onDownloadReport = () => {},
  onScheduleFollowup = () => {},
  className = ''
}) => {
  const mockCandidate = {
    id: 1,
    name: 'Sarah Johnson',
    email: 'sarah.johnson@email.com',
    phone: '+1 (555) 123-4567',
    position: 'Senior Frontend Developer',
    experience: '5 years',
    location: 'San Francisco, CA',
    status: 'completed',
    score: 85,
    interviewDate: '2025-09-28',
    duration: '45 min',
    skills: ['React', 'TypeScript', 'Node.js', 'GraphQL', 'AWS'],
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    resumeUrl: '/assets/documents/sarah-johnson-resume.pdf',
    linkedinUrl: 'https://linkedin.com/in/sarah-johnson',
    githubUrl: 'https://github.com/sarah-johnson'
  };

  const displayCandidate = Object.keys(candidate)?.length > 0 ? candidate : mockCandidate;

  const getStatusBadge = (status) => {
    const statusConfig = {
      scheduled: { bg: 'bg-accent/10', text: 'text-accent', icon: 'Calendar' },
      'in-progress': { bg: 'bg-warning/10', text: 'text-warning', icon: 'Clock' },
      completed: { bg: 'bg-success/10', text: 'text-success', icon: 'CheckCircle' },
      cancelled: { bg: 'bg-error/10', text: 'text-error', icon: 'XCircle' }
    };

    const config = statusConfig?.[status] || statusConfig?.scheduled;

    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config?.bg} ${config?.text}`}>
        <Icon name={config?.icon} size={14} className="mr-2" />
        {status?.charAt(0)?.toUpperCase() + status?.slice(1)?.replace('-', ' ')}
      </span>
    );
  };

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-success';
    if (score >= 80) return 'text-accent';
    if (score >= 70) return 'text-warning';
    return 'text-error';
  };

  return (
    <div className={`bg-card border-b border-border ${className}`}>
      <div className="px-6 py-4">
        {/* Navigation */}
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            iconName="ArrowLeft"
            iconPosition="left"
            iconSize={16}
            onClick={onBack}
            className="text-muted-foreground hover:text-foreground"
          >
            Back to Dashboard
          </Button>

          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              iconName="Download"
              iconPosition="left"
              iconSize={16}
              onClick={onDownloadReport}
            >
              Download Report
            </Button>
            <Button
              variant="default"
              iconName="Calendar"
              iconPosition="left"
              iconSize={16}
              onClick={onScheduleFollowup}
            >
              Schedule Follow-up
            </Button>
          </div>
        </div>

        {/* Candidate Profile */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:space-x-6">
          {/* Avatar and Basic Info */}
          <div className="flex items-start space-x-4 mb-6 lg:mb-0">
            <div className="flex-shrink-0">
              <div className="relative">
                <Image
                  src={displayCandidate?.avatar}
                  alt={displayCandidate?.name}
                  className="w-20 h-20 rounded-full object-cover border-2 border-border"
                />
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-success rounded-full border-2 border-card flex items-center justify-center">
                  <Icon name="Check" size={12} className="text-white" />
                </div>
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                <h1 className="text-2xl font-semibold text-foreground truncate">
                  {displayCandidate?.name}
                </h1>
                {getStatusBadge(displayCandidate?.status)}
              </div>

              <p className="text-lg text-muted-foreground mb-2">
                {displayCandidate?.position}
              </p>

              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
                <div className="flex items-center space-x-1">
                  <Icon name="Mail" size={14} />
                  <span>{displayCandidate?.email}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Icon name="Phone" size={14} />
                  <span>{displayCandidate?.phone}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Icon name="MapPin" size={14} />
                  <span>{displayCandidate?.location}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Icon name="Briefcase" size={14} />
                  <span>{displayCandidate?.experience} experience</span>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex items-center space-x-3">
                <Button
                  variant="ghost"
                  size="sm"
                  iconName="Linkedin"
                  iconSize={16}
                  onClick={() => window.open(displayCandidate?.linkedinUrl, '_blank')}
                  className="text-muted-foreground hover:text-accent"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  iconName="Github"
                  iconSize={16}
                  onClick={() => window.open(displayCandidate?.githubUrl, '_blank')}
                  className="text-muted-foreground hover:text-foreground"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  iconName="FileText"
                  iconSize={16}
                  onClick={() => window.open(displayCandidate?.resumeUrl, '_blank')}
                  className="text-muted-foreground hover:text-primary"
                />
              </div>
            </div>
          </div>

          {/* Interview Stats */}
          <div className="flex-shrink-0 lg:min-w-[300px]">
            <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
              {/* Overall Score */}
              <div className="bg-muted/30 rounded-lg p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Icon name="Target" size={20} className="text-muted-foreground mr-2" />
                  <span className="text-sm font-medium text-muted-foreground">Overall Score</span>
                </div>
                <div className={`text-3xl font-bold ${getScoreColor(displayCandidate?.score)}`}>
                  {displayCandidate?.score}
                </div>
                <div className="text-xs text-muted-foreground mt-1">out of 100</div>
              </div>

              {/* Interview Details */}
              <div className="bg-muted/30 rounded-lg p-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Date:</span>
                    <span className="text-sm font-medium text-foreground">
                      {displayCandidate?.interviewDate}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Duration:</span>
                    <span className="text-sm font-medium text-foreground">
                      {displayCandidate?.duration}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Questions:</span>
                    <span className="text-sm font-medium text-foreground">6 of 6</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Skills */}
            <div className="mt-4">
              <h3 className="text-sm font-medium text-foreground mb-2">Key Skills</h3>
              <div className="flex flex-wrap gap-2">
                {displayCandidate?.skills?.map((skill, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateHeader;