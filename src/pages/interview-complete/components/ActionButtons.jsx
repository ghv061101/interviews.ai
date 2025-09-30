import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ActionButtons = ({ 
  candidateData = null,
  interviewResults = null,
  onComplete = () => {},
  className = ''
}) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [isRequestingFeedback, setIsRequestingFeedback] = useState(false);
  const [feedbackRequested, setFeedbackRequested] = useState(false);
  const navigate = useNavigate();

  const mockCandidateData = {
    name: 'John Doe',
    email: 'john.doe@email.com',
    position: 'Senior Frontend Developer',
    interviewId: 'INT-2025-001',
    completedAt: '2025-09-29 13:38:45'
  };

  const mockResults = {
    finalScore: 85,
    totalQuestions: 6,
    correctAnswers: 5,
    duration: '8m 45s'
  };

  const displayData = candidateData || mockCandidateData;
  const displayResults = interviewResults || mockResults;

  const handleDownloadSummary = async () => {
    setIsDownloading(true);
    
    try {
      // Simulate PDF generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create mock PDF download
      const pdfContent = `Interview Summary - ${displayData?.name}
      
Position: ${displayData?.position}
Interview ID: ${displayData?.interviewId}
Completed: ${displayData?.completedAt}

Final Score: ${displayResults?.finalScore}/100
Questions Answered: ${displayResults?.correctAnswers}/${displayResults?.totalQuestions}
Duration: ${displayResults?.duration}

This is a mock PDF download. In a real application, this would generate a comprehensive PDF report with detailed analysis and recommendations.`;

      const blob = new Blob([pdfContent], { type: 'text/plain' });
      const url = window.URL?.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Interview_Summary_${displayData?.name?.replace(' ', '_')}_${displayData?.interviewId}.txt`;
      document.body?.appendChild(link);
      link?.click();
      document.body?.removeChild(link);
      window.URL?.revokeObjectURL(url);
      
    } catch (error) {
      console.error('Error downloading summary:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleRequestFeedback = async () => {
    setIsRequestingFeedback(true);
    
    try {
      // Simulate feedback request
      await new Promise(resolve => setTimeout(resolve, 1500));
      setFeedbackRequested(true);
    } catch (error) {
      console.error('Error requesting feedback:', error);
    } finally {
      setIsRequestingFeedback(false);
    }
  };

  const handleCompleteInterview = () => {
    // Clear interview session data
    localStorage.removeItem('interview_session');
    localStorage.removeItem('current_question');
    localStorage.removeItem('interview_progress');
    
    // Save completed interview to results
    const completedInterview = {
      ...displayData,
      ...displayResults,
      completedAt: new Date()?.toISOString(),
      status: 'completed'
    };
    
    const existingResults = JSON.parse(localStorage.getItem('interview_results') || '[]');
    existingResults?.push(completedInterview);
    localStorage.setItem('interview_results', JSON.stringify(existingResults));
    
    onComplete(completedInterview);
    
    // Navigate to resume upload for new interview
    navigate('/resume-upload');
  };

  const handleViewDashboard = () => {
    navigate('/interviewer-dashboard');
  };

  return (
    <div className={`bg-card border border-border rounded-lg p-6 ${className}`}>
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-foreground mb-2">Next Steps</h2>
        <p className="text-sm text-muted-foreground">
          Download your results or request additional feedback from our team
        </p>
      </div>
      {/* Action Buttons */}
      <div className="space-y-4">
        {/* Primary Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button
            variant="default"
            iconName="Download"
            iconPosition="left"
            iconSize={16}
            loading={isDownloading}
            onClick={handleDownloadSummary}
            fullWidth
          >
            {isDownloading ? 'Generating PDF...' : 'Download Summary'}
          </Button>

          <Button
            variant="outline"
            iconName="MessageSquare"
            iconPosition="left"
            iconSize={16}
            loading={isRequestingFeedback}
            disabled={feedbackRequested}
            onClick={handleRequestFeedback}
            fullWidth
          >
            {feedbackRequested ? 'Feedback Requested' : 'Request Detailed Feedback'}
          </Button>
        </div>

        {/* Feedback Success Message */}
        {feedbackRequested && (
          <div className="bg-success/10 border border-success/20 rounded-lg p-4 animate-slide-in">
            <div className="flex items-center space-x-2">
              <Icon name="CheckCircle" size={16} className="text-success" />
              <div>
                <p className="text-sm font-medium text-success">Feedback Request Sent</p>
                <p className="text-xs text-success/80 mt-1">
                  Our team will review your interview and send detailed feedback to {displayData?.email} within 24 hours.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Secondary Actions */}
        <div className="pt-4 border-t border-border">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              variant="ghost"
              iconName="BarChart3"
              iconPosition="left"
              iconSize={16}
              onClick={handleViewDashboard}
              fullWidth
            >
              View All Results
            </Button>

            <Button
              variant="ghost"
              iconName="RefreshCw"
              iconPosition="left"
              iconSize={16}
              onClick={() => navigate('/resume-upload')}
              fullWidth
            >
              Take Another Interview
            </Button>
          </div>
        </div>

        {/* Complete Interview */}
        <div className="pt-4 border-t border-border">
          <Button
            variant="success"
            iconName="Trophy"
            iconPosition="left"
            iconSize={16}
            onClick={handleCompleteInterview}
            fullWidth
            className="bg-gradient-to-r from-success to-success/80 hover:from-success/90 hover:to-success/70"
          >
            Complete Interview Session
          </Button>
        </div>
      </div>
      {/* Additional Information */}
      <div className="mt-6 pt-4 border-t border-border">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="flex items-center space-x-2 text-muted-foreground">
            <Icon name="Shield" size={14} />
            <span>Your data is securely stored</span>
          </div>
          <div className="flex items-center space-x-2 text-muted-foreground">
            <Icon name="Clock" size={14} />
            <span>Results available for 30 days</span>
          </div>
          <div className="flex items-center space-x-2 text-muted-foreground">
            <Icon name="Mail" size={14} />
            <span>Summary sent to your email</span>
          </div>
          <div className="flex items-center space-x-2 text-muted-foreground">
            <Icon name="HelpCircle" size={14} />
            <span>Support available 24/7</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActionButtons;