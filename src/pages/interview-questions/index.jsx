import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import interviewService from '../../services/interviewService';
import Header from '../../components/ui/Header';
import CandidateProgressIndicator from '../../components/ui/CandidateProgressIndicator';
import InterviewTimer from '../../components/ui/InterviewTimer';
import SessionRecoveryModal from '../../components/ui/SessionRecoveryModal';
import QuestionDisplay from './components/QuestionDisplay';
import AnswerInput from './components/AnswerInput';
import InterviewProgress from './components/InterviewProgress';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const InterviewQuestions = () => {
  const navigate = useNavigate();
  
  // Interview state
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSessionModal, setShowSessionModal] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Interview session state
  const [interviewSession, setInterviewSession] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [isLastQuestion, setIsLastQuestion] = useState(false);
  const completedQuestions = Object.keys(answers)?.length;

  // Load interview session on component mount
  useEffect(() => {
    const session = interviewService.loadInterviewSession();
    if (session) {
      setInterviewSession(session);
      setCurrentQuestionIndex(session.currentQuestionIndex);
      setTimeElapsed(calculateElapsedTime(session.startTime));
      
      // Set current question
      if (session.questions[session.currentQuestionIndex]) {
        setCurrentQuestion(session.questions[session.currentQuestionIndex]);
        setIsLastQuestion(session.currentQuestionIndex >= 5); // 6 questions total (0-5)
      }
      
      // Load existing answers
      const existingAnswers = {};
      session.answers.forEach((answer, index) => {
        if (session.questions[index]) {
          existingAnswers[session.questions[index].id] = answer.answer;
        }
      });
      setAnswers(existingAnswers);
    } else {
      // No session found, redirect to resume upload
      navigate('/resume-upload');
    }
  }, [navigate]);

  const calculateElapsedTime = (startTime) => {
    const start = new Date(startTime);
    const now = new Date();
    return Math.floor((now - start) / 1000);
  };

  // Session recovery effect
  useEffect(() => {
    const savedSession = interviewService.loadInterviewSession();
    if (savedSession && savedSession.status === 'paused') {
      setShowSessionModal(true);
    }
  }, []);

  // Time tracking effect
  useEffect(() => {
    let interval = null;
    if (!isPaused) {
      interval = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPaused]);

  const handleAnswerChange = (answer) => {
    if (currentQuestion) {
      setAnswers(prev => ({
        ...prev,
        [currentQuestion.id]: answer
      }));
    }
  };

  const handleSubmitAnswer = async (answer, timeSpent = 0) => {
    setIsSubmitting(true);
    
    try {
      if (interviewSession) {
        const updatedSession = await interviewService.submitAnswer(
          interviewSession, 
          answer, 
          timeSpent
        );
        
        setInterviewSession(updatedSession);
        
        if (updatedSession.status === 'completed') {
          // Interview completed, navigate to results
          navigate('/interview-complete');
        } else {
          // Move to next question
          const nextIndex = updatedSession.currentQuestionIndex;
          setCurrentQuestionIndex(nextIndex);
          setCurrentQuestion(updatedSession.questions[nextIndex]);
          setIsLastQuestion(nextIndex >= 5);
        }
      }
    } catch (error) {
      console.error('Error submitting answer:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNextQuestion = (answer) => {
    const timeSpent = Math.floor(Math.random() * 30) + 30; // Mock time spent
    handleSubmitAnswer(answer, timeSpent);
  };

  const handleTimeUp = () => {
    const currentAnswer = currentQuestion ? answers?.[currentQuestion.id] || '' : '';
    const timeLimit = currentQuestion?.timeLimit || 60;
    handleSubmitAnswer(currentAnswer?.trim() || 'No answer provided - time expired', timeLimit);
  };

  const handlePauseInterview = () => {
    setIsPaused(true);
    if (interviewSession) {
      interviewService.pauseInterview(interviewSession);
    }
  };

  const handleResumeInterview = () => {
    setIsPaused(false);
    if (interviewSession) {
      interviewService.resumeInterview(interviewSession);
    }
  };

  const handleSessionContinue = (sessionData) => {
    if (interviewSession) {
      interviewService.resumeInterview(interviewSession);
      setIsPaused(false);
    }
    setShowSessionModal(false);
  };

  const handleSessionStartNew = () => {
    interviewService.clearCurrentSession();
    navigate('/resume-upload');
    setShowSessionModal(false);
  };

  // Show loading if no interview session
  if (!interviewSession || !currentQuestion) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-16 flex items-center justify-center min-h-[calc(100vh-4rem)]">
          <div className="text-center">
            <Icon name="Loader2" size={48} className="animate-spin text-primary mx-auto mb-4" />
            <p className="text-lg text-foreground">Loading interview...</p>
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
        currentStep={2}
        totalSteps={3}
        completionStatus="in-progress"
        timeRemaining={`${Math.floor(timeElapsed / 60)}:${(timeElapsed % 60)?.toString()?.padStart(2, '0')} elapsed`}
      />
      {/* Interview Timer */}
      <InterviewTimer
        initialTime={currentQuestion?.timeLimit || 60}
        onTimeUp={handleTimeUp}
        onPause={handlePauseInterview}
        onResume={handleResumeInterview}
        isPaused={isPaused}
        difficulty={currentQuestion?.difficulty}
        questionNumber={currentQuestion?.questionNumber || 1}
        totalQuestions={6}
        key={currentQuestionIndex} // Reset timer for each question
      />
      {/* Main Content */}
      <main className="pt-4 pb-8">
        <div className="max-w-6xl mx-auto px-6">
          {/* Interview Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-foreground">Technical Interview</h1>
                <p className="text-muted-foreground mt-1">
                  {interviewSession?.candidateData?.position || 'Full-Stack Developer'} Position • AI-Generated Questions
                </p>
              </div>
              
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  iconName={isPaused ? "Play" : "Pause"}
                  iconPosition="left"
                  iconSize={16}
                  onClick={isPaused ? handleResumeInterview : handlePauseInterview}
                >
                  {isPaused ? 'Resume' : 'Pause'}
                </Button>
                
                <Button
                  variant="ghost"
                  iconName="HelpCircle"
                  iconPosition="left"
                  iconSize={16}
                  onClick={() => console.log('Show help')}
                >
                  Help
                </Button>
              </div>
            </div>
          </div>

          {/* Interview Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Question Area */}
            <div className="lg:col-span-2 space-y-6">
              <QuestionDisplay
                question={currentQuestion}
                currentQuestionIndex={currentQuestionIndex}
                totalQuestions={6}
              />
              
              <AnswerInput
                answer={currentQuestion ? answers?.[currentQuestion.id] || '' : ''}
                onAnswerChange={handleAnswerChange}
                onSubmit={handleSubmitAnswer}
                onNext={handleNextQuestion}
                isLastQuestion={isLastQuestion}
                isSubmitting={isSubmitting}
                autoSaveEnabled={true}
                maxCharacters={2000}
              />
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <InterviewProgress
                currentQuestion={currentQuestionIndex}
                totalQuestions={6}
                completedQuestions={completedQuestions}
                difficulty={currentQuestion?.difficulty}
                timeElapsed={timeElapsed}
              />

              {/* Quick Navigation */}
              <div className="bg-card border border-border rounded-lg shadow-card p-4">
                <h3 className="text-sm font-medium text-foreground mb-3 flex items-center">
                  <Icon name="Navigation" size={16} className="mr-2" />
                  Quick Actions
                </h3>
                
                <div className="space-y-2">
                  <Button
                    variant="ghost"
                    iconName="SkipForward"
                    iconPosition="left"
                    iconSize={14}
                    onClick={() => handleNextQuestion(currentQuestion ? answers?.[currentQuestion.id] || '' : '')}
                    disabled={isLastQuestion || !currentQuestion || !(currentQuestion ? answers?.[currentQuestion.id]?.trim() : false)}
                    fullWidth
                    className="justify-start text-sm"
                  >
                    Skip to Next Question
                  </Button>
                  
                  <Button
                    variant="ghost"
                    iconName="Save"
                    iconPosition="left"
                    iconSize={14}
                    onClick={() => console.log('Manual save')}
                    fullWidth
                    className="justify-start text-sm"
                  >
                    Save Progress
                  </Button>
                  
                  <Button
                    variant="ghost"
                    iconName="MessageSquare"
                    iconPosition="left"
                    iconSize={14}
                    onClick={() => console.log('Show hints')}
                    fullWidth
                    className="justify-start text-sm"
                  >
                    Request Hint
                  </Button>
                </div>
              </div>

              {/* Interview Tips */}
              <div className="bg-accent/5 border border-accent/20 rounded-lg p-4">
                <h3 className="text-sm font-medium text-accent mb-3 flex items-center">
                  <Icon name="Lightbulb" size={16} className="mr-2" />
                  Interview Tips
                </h3>
                
                <ul className="text-sm text-accent/80 space-y-2">
                  <li className="flex items-start space-x-2">
                    <Icon name="ArrowRight" size={12} className="mt-1 flex-shrink-0" />
                    <span>Think out loud while solving problems</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <Icon name="ArrowRight" size={12} className="mt-1 flex-shrink-0" />
                    <span>Ask clarifying questions if needed</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <Icon name="ArrowRight" size={12} className="mt-1 flex-shrink-0" />
                    <span>Consider edge cases in your solutions</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <Icon name="ArrowRight" size={12} className="mt-1 flex-shrink-0" />
                    <span>Explain your reasoning step by step</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Emergency Actions */}
          <div className="mt-8 pt-6 border-t border-border">
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Having technical issues? Contact support immediately.
              </div>
              
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  iconName="Phone"
                  iconPosition="left"
                  iconSize={14}
                  onClick={() => console.log('Contact support')}
                  size="sm"
                >
                  Contact Support
                </Button>
                
                <Button
                  variant="destructive"
                  iconName="AlertTriangle"
                  iconPosition="left"
                  iconSize={14}
                  onClick={() => {
                    if (confirm('Are you sure you want to end the interview? This action cannot be undone.')) {
                      interviewService.clearCurrentSession();
                      navigate('/resume-upload');
                    }
                  }}
                  size="sm"
                >
                  End Interview
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
      {/* Session Recovery Modal */}
      <SessionRecoveryModal
        isOpen={showSessionModal}
        onClose={() => setShowSessionModal(false)}
        onContinue={handleSessionContinue}
        onStartNew={handleSessionStartNew}
        autoDetect={true}
      />
    </div>
  );
};

export default InterviewQuestions;