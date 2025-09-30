import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import WelcomeMessage from './components/WelcomeMessage';
import SessionProgressCard from './components/SessionProgressCard';
import ActionButtons from './components/ActionButtons';
import InterruptionScenarios from './components/InterruptionScenarios';

const WelcomeBackModal = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [sessionData, setSessionData] = useState(null);
  const [interruptionType, setInterruptionType] = useState('browser_reload');

  // Mock session data - in real app this would come from Redux/IndexedDB
  const mockSessionData = {
    candidateName: 'John Doe',
    position: 'Senior Frontend Developer',
    currentQuestion: 3,
    totalQuestions: 6,
    completedQuestions: 2,
    timeRemaining: '18:45',
    lastActivity: '2025-09-29 13:25:00',
    interviewId: 'INT-2025-001',
    sessionId: 'SES-789123',
    difficulty: 'Medium',
    answers: [
      {
        questionId: 1,
        question: 'What is React and why is it popular?',
        answer: 'React is a JavaScript library for building user interfaces...',
        timeSpent: 45,
        difficulty: 'Easy'
      },
      {
        questionId: 2,
        question: 'Explain the concept of Virtual DOM',
        answer: 'Virtual DOM is a programming concept where...',
        timeSpent: 58,
        difficulty: 'Easy'
      }
    ]
  };

  useEffect(() => {
    // Simulate session detection and recovery
    const detectSession = () => {
      const storedSession = localStorage.getItem('interview_session');
      if (storedSession) {
        try {
          const parsedSession = JSON.parse(storedSession);
          setSessionData({ ...mockSessionData, ...parsedSession });
          
          // Determine interruption type based on stored flags
          const interruptionFlag = localStorage.getItem('interruption_type');
          setInterruptionType(interruptionFlag || 'browser_reload');
        } catch (error) {
          console.error('Error parsing session data:', error);
          setSessionData(mockSessionData);
        }
      } else {
        // For demo purposes, always show the modal with mock data
        setSessionData(mockSessionData);
        localStorage.setItem('interview_session', JSON.stringify(mockSessionData));
      }
    };

    detectSession();
  }, []);

  const handleContinueInterview = async () => {
    setLoading(true);
    
    try {
      // Simulate session restoration
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Store continuation flag
      localStorage.setItem('session_continued', 'true');
      localStorage.setItem('current_question', sessionData?.currentQuestion?.toString() || '3');
      
      // Navigate to interview questions
      navigate('/interview-questions', { 
        state: { 
          resumeSession: true, 
          sessionData: sessionData 
        } 
      });
    } catch (error) {
      console.error('Error continuing interview:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartOver = () => {
    // Clear all session data
    localStorage.removeItem('interview_session');
    localStorage.removeItem('interruption_type');
    localStorage.removeItem('session_continued');
    localStorage.removeItem('current_question');
    
    // Navigate to resume upload to start fresh
    navigate('/resume-upload');
  };

  const handleExit = () => {
    // Keep session data but mark as exited
    localStorage.setItem('session_exited', 'true');
    
    // Navigate to home or dashboard
    navigate('/interviewer-dashboard');
  };

  if (!sessionData) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading session data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      {/* Modal Overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-modal flex items-center justify-center p-4 pt-20">
        {/* Modal Content */}
        <div className="relative bg-card border border-border rounded-xl shadow-modal max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-scale-in">
          {/* Modal Header */}
          <div className="sticky top-0 bg-card border-b border-border rounded-t-xl px-6 py-4 z-10">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-foreground">Session Recovery</h2>
                <p className="text-sm text-muted-foreground">Resume your interview</p>
              </div>
              <button
                onClick={handleExit}
                className="text-muted-foreground hover:text-foreground transition-colors p-1"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Modal Body */}
          <div className="p-6 space-y-8">
            {/* Welcome Message */}
            <WelcomeMessage 
              candidateName={sessionData?.candidateName}
              sessionType={interruptionType}
            />

            {/* Session Progress */}
            <SessionProgressCard 
              sessionData={sessionData}
            />

            {/* Interruption Details */}
            <InterruptionScenarios 
              interruptionType={interruptionType}
            />

            {/* Action Buttons */}
            <ActionButtons 
              onContinue={handleContinueInterview}
              onStartOver={handleStartOver}
              onExit={handleExit}
              loading={loading}
            />
          </div>

          {/* Modal Footer */}
          <div className="border-t border-border px-6 py-4 bg-muted/30 rounded-b-xl">
            <div className="flex items-center justify-center space-x-4 text-xs text-muted-foreground">
              <div className="flex items-center space-x-1">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                <span>Secure Local Storage</span>
              </div>
              <div className="flex items-center space-x-1">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Auto-Save Enabled</span>
              </div>
              <div className="flex items-center space-x-1">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <span>Privacy Protected</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeBackModal;