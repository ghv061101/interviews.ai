import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import interviewService from '../../services/interviewService';
import Header from '../../components/ui/Header';
import CandidateProgressIndicator from '../../components/ui/CandidateProgressIndicator';
import ScoreDisplay from './components/ScoreDisplay';
import AISummaryPanel from './components/AISummaryPanel';
import PerformanceBreakdown from './components/PerformanceBreakdown';
import TimelineReview from './components/TimelineReview';
import ActionButtons from './components/ActionButtons';
import Icon from '../../components/AppIcon';

const InterviewComplete = () => {
  const [interviewData, setInterviewData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadInterviewData = async () => {
      setLoading(true);
      
      try {
        // Get the most recent completed interview
        const completedInterviews = interviewService.getCompletedInterviews();
        
        if (completedInterviews.length > 0) {
          const latestInterview = completedInterviews[completedInterviews.length - 1];
          
          // Transform interview session data to match component expectations
          const transformedData = transformInterviewData(latestInterview);
          setInterviewData(transformedData);
        } else {
          // No completed interviews found, redirect to resume upload
          navigate('/resume-upload');
          return;
        }
      } catch (error) {
        console.error('Error loading interview data:', error);
        navigate('/resume-upload');
      } finally {
        setLoading(false);
      }
    };

    loadInterviewData();
  }, [navigate]);

  const transformInterviewData = (interviewSession) => {
    const { candidateData, questions, answers, evaluations, finalSummary, startTime, endTime } = interviewSession;
    
    // Calculate total score
    const totalScore = evaluations.reduce((sum, eval) => sum + (eval.score || 0), 0);
    const maxTotalScore = evaluations.reduce((sum, eval) => sum + (eval.maxScore || 0), 0);
    const finalScore = maxTotalScore > 0 ? Math.round((totalScore / maxTotalScore) * 100) : 0;
    
    // Calculate duration
    const start = new Date(startTime);
    const end = new Date(endTime);
    const durationMs = end - start;
    const minutes = Math.floor(durationMs / 60000);
    const seconds = Math.floor((durationMs % 60000) / 1000);
    const totalDuration = `${minutes}m ${seconds}s`;
    
    return {
      candidate: {
        name: candidateData.fullName,
        email: candidateData.email,
        phone: candidateData.phone,
        position: candidateData.position || 'Full Stack Developer',
        interviewId: interviewSession.id,
        completedAt: endTime
      },
      results: {
        finalScore,
        percentileRank: Math.min(finalScore + 10, 95), // Mock percentile
        totalQuestions: questions.length,
        correctAnswers: evaluations.filter(e => e.score >= e.maxScore * 0.7).length,
        totalDuration,
        startTime,
        endTime
      },
      summary: {
        overview: finalSummary?.summary || 'Strong technical performance demonstrated.',
        technicalAccuracy: finalSummary?.detailedFeedback || 'Good technical understanding shown.',
        problemSolving: 'Systematic approach to problem-solving with clear explanations.',
        communication: 'Clear communication throughout the interview.',
        recommendations: finalSummary?.nextSteps || ['Continue with technical assessment']
      },
      questionBreakdown: questions.map((question, index) => ({
        id: question.id,
        question: question.title,
        difficulty: question.difficulty,
        score: evaluations[index]?.score || 0,
        timeSpent: `${answers[index]?.timeSpent || 60}s`,
        maxTime: `${question.timeLimit}s`,
        aiInsight: evaluations[index]?.feedback || 'Good response provided.'
      })),
      timeline: {
        totalDuration,
        startTime: new Date(startTime).toLocaleTimeString(),
        endTime: new Date(endTime).toLocaleTimeString(),
        questionTimes: {
          easy: '40s',
          medium: '2m 00s', 
          hard: '4m 00s'
        },
        phases: [
          {
            id: 1,
            phase: 'Interview Started',
            time: new Date(startTime).toLocaleTimeString(),
            duration: null,
            icon: 'Play',
            status: 'completed'
          },
          {
            id: 2,
            phase: 'Easy Questions',
            time: new Date(startTime).toLocaleTimeString(),
            duration: '40s',
            icon: 'CheckCircle',
            status: 'completed',
            details: '2 questions completed'
          },
          {
            id: 3,
            phase: 'Medium Questions',
            time: new Date(Date.parse(startTime) + 60000).toLocaleTimeString(),
            duration: '2m 00s',
            icon: 'CheckCircle',
            status: 'completed',
            details: '2 questions completed'
          },
          {
            id: 4,
            phase: 'Hard Questions',
            time: new Date(Date.parse(startTime) + 180000).toLocaleTimeString(),
            duration: '4m 00s',
            icon: 'CheckCircle',
            status: 'completed',
            details: '2 questions completed'
          },
          {
            id: 5,
            phase: 'Interview Completed',
            time: new Date(endTime).toLocaleTimeString(),
            duration: null,
            icon: 'Trophy',
            status: 'completed'
          }
        ]
      }
    };
  };

  const handleInterviewComplete = (completedData) => {
    console.log('Interview completed and stored:', completedData);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-16">
          <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
            <div className="flex flex-col items-center space-y-4">
              <Icon name="Loader2" size={48} className="animate-spin text-primary" />
              <div className="text-center">
                <h2 className="text-xl font-semibold text-foreground mb-2">
                  Processing Your Results
                </h2>
                <p className="text-muted-foreground">
                  Our AI is analyzing your interview performance...
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!interviewData) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-16">
          <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
            <div className="text-center max-w-md mx-auto px-6">
              <Icon name="AlertCircle" size={48} className="text-error mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-foreground mb-2">
                No Interview Data Found
              </h2>
              <p className="text-muted-foreground mb-6">
                We couldn't find your interview results. Please start a new interview.
              </p>
              <button
                onClick={() => navigate('/resume-upload')}
                className="inline-flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                <Icon name="Upload" size={16} />
                <span>Start New Interview</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      {/* Progress Indicator */}
      <CandidateProgressIndicator
        currentStep={3}
        totalSteps={3}
        completionStatus="completed"
        stepLabels={['Upload Resume', 'Interview Questions', 'Complete']}
      />
      {/* Main Content */}
      <main className="pt-4 pb-12">
        <div className="max-w-7xl mx-auto px-6">
          {/* Header Section */}
          <div className="mb-8">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-success/10 rounded-full mb-4">
                <Icon name="Trophy" size={32} className="text-success" />
              </div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Interview Complete!
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Congratulations {interviewData?.candidate?.name}! You've successfully completed your 
                {' '}{interviewData?.candidate?.position} interview. Here's your detailed performance analysis.
              </p>
            </div>
          </div>

          {/* Results Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Score and Summary */}
            <div className="lg:col-span-2 space-y-8">
              {/* Score Display */}
              <ScoreDisplay
                finalScore={interviewData?.results?.finalScore}
                percentileRank={interviewData?.results?.percentileRank}
                totalQuestions={interviewData?.results?.totalQuestions}
                correctAnswers={interviewData?.results?.correctAnswers}
              />

              {/* AI Summary Panel */}
              <AISummaryPanel
                summary={interviewData?.summary}
                candidateName={interviewData?.candidate?.name}
                position={interviewData?.candidate?.position}
              />

              {/* Performance Breakdown - Mobile/Tablet */}
              <div className="lg:hidden">
                <PerformanceBreakdown
                  questionBreakdown={interviewData?.questionBreakdown}
                />
              </div>
            </div>

            {/* Right Column - Timeline and Actions */}
            <div className="space-y-8">
              {/* Timeline Review */}
              <TimelineReview
                interviewData={interviewData?.timeline}
              />

              {/* Action Buttons */}
              <ActionButtons
                candidateData={interviewData?.candidate}
                interviewResults={interviewData?.results}
                onComplete={handleInterviewComplete}
              />
            </div>
          </div>

          {/* Performance Breakdown - Desktop */}
          <div className="hidden lg:block mt-8">
            <PerformanceBreakdown
              questionBreakdown={interviewData?.questionBreakdown}
            />
          </div>

          {/* Footer Information */}
          <div className="mt-12 pt-8 border-t border-border">
            <div className="bg-muted/30 rounded-lg p-6">
              <div className="flex items-start space-x-3">
                <Icon name="Info" size={20} className="text-primary mt-0.5" />
                <div>
                  <h3 className="font-medium text-foreground mb-2">What happens next?</h3>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>• Your interview results have been saved and can be accessed anytime</p>
                    <p>• A copy of your summary will be sent to {interviewData?.candidate?.email}</p>
                    <p>• You can download a detailed PDF report using the button above</p>
                    <p>• Our team may reach out with additional opportunities based on your performance</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default InterviewComplete;