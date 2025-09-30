import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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

  // Mock interview completion data
  const mockInterviewData = {
    candidate: {
      name: 'John Doe',
      email: 'john.doe@email.com',
      phone: '+1 (555) 123-4567',
      position: 'Senior Frontend Developer',
      interviewId: 'INT-2025-001',
      completedAt: '2025-09-29 13:38:45'
    },
    results: {
      finalScore: 85,
      percentileRank: 78,
      totalQuestions: 6,
      correctAnswers: 5,
      totalDuration: '8m 45s',
      startTime: '2025-09-29 13:30:00',
      endTime: '2025-09-29 13:38:45'
    },
    summary: {
      overview: `Based on your interview performance, you demonstrated strong technical knowledge in React and JavaScript fundamentals. Your problem-solving approach shows methodical thinking, though there's room for improvement in optimization techniques. Communication was clear and professional throughout the session.`,
      technicalAccuracy: `You correctly answered 5 out of 6 questions with particularly strong performance in React hooks and component lifecycle questions. Your understanding of state management and event handling is solid. The areas that need attention include advanced optimization patterns and performance monitoring techniques.`,
      problemSolving: `Your approach to breaking down complex problems was systematic and logical. You effectively used pseudocode to plan solutions before implementation. However, consider exploring edge cases more thoroughly and discussing alternative approaches to demonstrate deeper analytical thinking.`,
      communication: `You articulated your thought process clearly and asked relevant clarifying questions when needed. Your explanations of technical concepts were well-structured. To enhance further, practice explaining complex topics with simpler analogies and maintain consistent eye contact during explanations.`,
      recommendations: [
        "Focus on advanced React performance optimization techniques",
        "Practice system design questions for senior-level positions", 
        "Strengthen knowledge in testing methodologies and best practices",
        "Explore modern deployment and CI/CD practices"
      ]
    },
    questionBreakdown: [
      {
        id: 1,
        question: "Explain the difference between useState and useReducer hooks in React",
        difficulty: 'easy',score: 95,timeSpent: '18s',maxTime: '20s',
        aiInsight: "Excellent explanation with clear examples and use cases. Demonstrated deep understanding of React hooks."
      },
      {
        id: 2,
        question: "How would you optimize a React component that renders a large list?",
        difficulty: 'easy',score: 88,timeSpent: '19s',maxTime: '20s',
        aiInsight: "Good coverage of virtualization and memoization. Could have mentioned React.memo and useMemo in more detail."
      },
      {
        id: 3,
        question: "Implement a custom hook for handling API calls with loading states",
        difficulty: 'medium',score: 82,timeSpent: '55s',maxTime: '60s',
        aiInsight: "Solid implementation with proper error handling. Consider adding cleanup for cancelled requests."
      },
      {
        id: 4,
        question: "Design a scalable state management solution for a large React application",
        difficulty: 'medium',score: 78,timeSpent: '58s',maxTime: '60s',
        aiInsight: "Good understanding of Redux patterns. Could improve by discussing context API alternatives and performance implications."
      },
      {
        id: 5,
        question: "Explain how you would implement server-side rendering with React",
        difficulty: 'hard',score: 85,timeSpent: '110s',maxTime: '120s',
        aiInsight: "Comprehensive answer covering Next.js and manual SSR setup. Excellent discussion of hydration challenges."
      },
      {
        id: 6,
        question: "Design a micro-frontend architecture using React",
        difficulty: 'hard',score: 72,timeSpent: '115s',maxTime: '120s',
        aiInsight: "Basic understanding shown but missed key concepts like module federation and shared dependencies."
      }
    ],
    timeline: {
      totalDuration: '8m 45s',startTime: '2025-09-29 13:30:00',endTime: '2025-09-29 13:38:45',
      questionTimes: {
        easy: '37s',medium: '1m 53s',hard: '3m 45s'
      },
      phases: [
        {
          id: 1,
          phase: 'Interview Started',time: '13:30:00',duration: null,icon: 'Play',status: 'completed'
        },
        {
          id: 2,
          phase: 'Easy Questions',time: '13:30:15',duration: '37s',icon: 'CheckCircle',status: 'completed',details: '2 questions completed'
        },
        {
          id: 3,
          phase: 'Medium Questions',time: '13:30:52',duration: '1m 53s',icon: 'CheckCircle',status: 'completed',details: '2 questions completed'
        },
        {
          id: 4,
          phase: 'Hard Questions',time: '13:32:45',duration: '3m 45s',icon: 'CheckCircle',status: 'completed',details: '2 questions completed'
        },
        {
          id: 5,
          phase: 'Interview Completed',time: '13:38:45',duration: null,icon: 'Trophy',status: 'completed'
        }
      ]
    }
  };

  useEffect(() => {
    // Simulate loading interview data
    const loadInterviewData = async () => {
      setLoading(true);
      
      try {
        // Check for stored interview data
        const storedData = localStorage.getItem('completed_interview');
        if (storedData) {
          setInterviewData(JSON.parse(storedData));
        } else {
          // Use mock data if no stored data
          setInterviewData(mockInterviewData);
          // Store mock data for consistency
          localStorage.setItem('completed_interview', JSON.stringify(mockInterviewData));
        }
      } catch (error) {
        console.error('Error loading interview data:', error);
        setInterviewData(mockInterviewData);
      } finally {
        setLoading(false);
      }
    };

    loadInterviewData();
  }, []);

  const handleInterviewComplete = (completedData) => {
    // Store completed interview in results
    const existingResults = JSON.parse(localStorage.getItem('interview_results') || '[]');
    existingResults?.push(completedData);
    localStorage.setItem('interview_results', JSON.stringify(existingResults));
    
    // Clear current interview session
    localStorage.removeItem('completed_interview');
    localStorage.removeItem('interview_session');
    
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