import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../../components/ui/Header';
import CandidateHeader from './components/CandidateHeader';
import ResumeDetailsTab from './components/ResumeDetailsTab';
import ChatHistoryTab from './components/ChatHistoryTab';
import AISummaryTab from './components/AISummaryTab';
import PerformanceAnalyticsTab from './components/PerformanceAnalyticsTab';
import Icon from '../../components/AppIcon';

const CandidateProfile = () => {
  const navigate = useNavigate();
  const { candidateId } = useParams();
  const [activeTab, setActiveTab] = useState('resume');
  const [candidate, setCandidate] = useState({});
  const [loading, setLoading] = useState(true);

  // Mock candidate data - in real app, this would come from API
  const mockCandidate = {
    id: candidateId || 1,
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

  useEffect(() => {
    // Simulate API call to fetch candidate data
    const fetchCandidateData = async () => {
      setLoading(true);
      try {
        // In real app, make API call here
        await new Promise(resolve => setTimeout(resolve, 1000));
        setCandidate(mockCandidate);
      } catch (error) {
        console.error('Error fetching candidate data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCandidateData();
  }, [candidateId]);

  const tabs = [
    {
      id: 'resume',
      label: 'Resume Details',
      icon: 'FileText',
      component: ResumeDetailsTab
    },
    {
      id: 'chat',
      label: 'Interview Chat',
      icon: 'MessageSquare',
      component: ChatHistoryTab
    },
    {
      id: 'ai-summary',
      label: 'AI Summary',
      icon: 'Brain',
      component: AISummaryTab
    },
    {
      id: 'analytics',
      label: 'Performance Analytics',
      icon: 'BarChart3',
      component: PerformanceAnalyticsTab
    }
  ];

  const handleBackToDashboard = () => {
    navigate('/interviewer-dashboard');
  };

  const handleDownloadReport = () => {
    console.log('Downloading comprehensive report for candidate:', candidate?.id);
    // In real app, generate and download PDF report
  };

  const handleScheduleFollowup = () => {
    console.log('Scheduling follow-up interview for candidate:', candidate?.id);
    // In real app, open scheduling modal or navigate to scheduling page
  };

  const handleDownloadResume = () => {
    console.log('Downloading resume for candidate:', candidate?.id);
    // In real app, download resume file
  };

  const handleAddNote = (messageId, noteText) => {
    console.log('Adding note to message:', messageId, noteText);
    // In real app, save note to backend
  };

  const handleRegenerateInsights = () => {
    console.log('Regenerating AI insights for candidate:', candidate?.id);
    // In real app, call AI service to regenerate insights
  };

  const handleExportAnalytics = () => {
    console.log('Exporting analytics for candidate:', candidate?.id);
    // In real app, export analytics data
  };

  const renderTabContent = () => {
    const activeTabData = tabs?.find(tab => tab?.id === activeTab);
    if (!activeTabData) return null;

    const TabComponent = activeTabData?.component;

    switch (activeTab) {
      case 'resume':
        return (
          <TabComponent
            onDownloadResume={handleDownloadResume}
            className="mt-6"
          />
        );
      case 'chat':
        return (
          <TabComponent
            onAddNote={handleAddNote}
            className="mt-6"
          />
        );
      case 'ai-summary':
        return (
          <TabComponent
            onRegenerateInsights={handleRegenerateInsights}
            className="mt-6"
          />
        );
      case 'analytics':
        return (
          <TabComponent
            onExportAnalytics={handleExportAnalytics}
            className="mt-6"
          />
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-16">
          <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
            <div className="flex flex-col items-center space-y-4">
              <Icon name="Loader2" size={48} className="animate-spin text-primary" />
              <p className="text-lg text-muted-foreground">Loading candidate profile...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        {/* Candidate Header */}
        <CandidateHeader
          candidate={candidate}
          onBack={handleBackToDashboard}
          onDownloadReport={handleDownloadReport}
          onScheduleFollowup={handleScheduleFollowup}
        />

        {/* Tab Navigation */}
        <div className="bg-card border-b border-border sticky top-16 z-10">
          <div className="px-6">
            <nav className="flex space-x-8 overflow-x-auto">
              {tabs?.map((tab) => (
                <button
                  key={tab?.id}
                  onClick={() => setActiveTab(tab?.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                    activeTab === tab?.id
                      ? 'border-primary text-primary' :'border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground'
                  }`}
                >
                  <Icon name={tab?.icon} size={16} />
                  <span>{tab?.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="px-6 py-6">
          <div className="max-w-7xl mx-auto">
            {renderTabContent()}
          </div>
        </div>

        {/* Mobile Tab Indicator */}
        <div className="md:hidden fixed bottom-4 left-4 right-4 bg-card border border-border rounded-lg shadow-lg p-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-foreground">
              {tabs?.find(tab => tab?.id === activeTab)?.label}
            </span>
            <div className="flex space-x-1">
              {tabs?.map((tab, index) => (
                <div
                  key={tab?.id}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    activeTab === tab?.id ? 'bg-primary' : 'bg-muted'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CandidateProfile;