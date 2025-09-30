import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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

  // Mock questions data with structured difficulty progression (2 Easy, 2 Medium, 2 Hard)
  const questions = [
    {
      id: 1,
      difficulty: 'easy',
      title: 'What is the difference between let, const, and var in JavaScript?',
      description: `Explain the key differences between these three variable declaration keywords in JavaScript. Include information about:\n\n• Scope behavior\n• Hoisting characteristics\n• Reassignment capabilities\n• Temporal dead zone (if applicable)`,
      requirements: [
        'Explain scope differences clearly',
        'Mention hoisting behavior for each',
        'Provide simple code examples',
        'Discuss when to use each one'
      ],
      expectedTime: '2-3 minutes',
      focus: 'JavaScript fundamentals',
      timeLimit: 20
    },
    {
      id: 2,
      difficulty: 'easy',
      title: 'Explain the concept of semantic HTML and its importance.',
      description: `Describe what semantic HTML means and why it's important for web development. Cover the following aspects:\n\n• Definition of semantic HTML\n• Benefits for accessibility\n• SEO advantages\n• Code maintainability`,
      requirements: [
        'Define semantic HTML clearly','List at least 5 semantic HTML elements','Explain accessibility benefits','Mention SEO impact'
      ],
      expectedTime: '2-3 minutes',focus: 'HTML fundamentals and best practices',
      timeLimit: 20
    },
    {
      id: 3,
      difficulty: 'medium',title: 'How does React\'s Virtual DOM work and what are its benefits?',
      description: `Explain the Virtual DOM concept in React and its advantages over direct DOM manipulation. Your answer should cover:\n\n• What is the Virtual DOM\n• How React uses it for rendering\n• Performance benefits\n• Comparison with direct DOM updates`,
      codeExample: `// Example of how React updates might work
const element = <h1>Hello, World!</h1>;
ReactDOM.render(element, document.getElementById('root'));`,
      requirements: [
        'Explain Virtual DOM concept clearly',
        'Describe the diffing algorithm',
        'Compare performance with direct DOM manipulation',
        'Mention reconciliation process'
      ],
      expectedTime: '3-4 minutes',
      focus: 'React concepts and performance',
      timeLimit: 60
    },
    {
      id: 4,
      difficulty: 'medium',
      title: 'Implement a debounce function and explain its use cases.',
      description: `Write a debounce function from scratch and explain when and why you would use it. Include:\n\n• Implementation of the debounce function\n• Explanation of how it works\n• Real-world use cases\n• Difference from throttling`,
      codeExample: `// Your debounce function should work like this:
const debouncedFunction = debounce(() => {
  console.log('This will be called after delay');
}, 300);`,
      requirements: [
        'Implement a working debounce function',
        'Explain the closure concept used',
        'Provide at least 3 use cases',
        'Explain difference from throttling'
      ],
      expectedTime: '4-5 minutes',
      focus: 'JavaScript advanced concepts and practical application',
      timeLimit: 60
    },
    {
      id: 5,
      difficulty: 'hard',
      title: 'Design a scalable REST API for a social media platform.',
      description: `Design the architecture and endpoints for a REST API that handles a social media platform with the following features:\n\n• User management (registration, authentication)\n• Posts (create, read, update, delete)\n• Comments and likes\n• Following/followers system\n• News feed generation`,
      requirements: [
        'Design RESTful endpoints with proper HTTP methods',
        'Consider authentication and authorization',
        'Address scalability concerns',
        'Discuss database design considerations',
        'Mention caching strategies'
      ],
      expectedTime: '6-8 minutes',
      focus: 'System design and API architecture',
      timeLimit: 120
    },
    {
      id: 6,
      difficulty: 'hard',
      title: 'Optimize a React application for performance - identify and solve bottlenecks.',
      description: `You have a React application that's experiencing performance issues. The app has:\n\n• Large lists with frequent updates\n• Complex component trees\n• Heavy computations in render methods\n• Unnecessary re-renders\n• Large bundle sizes\n\nIdentify potential bottlenecks and provide solutions with code examples.`,
      codeExample: `// Example of a potentially problematic component
const UserList = ({ users, searchTerm }) => {
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div>
      {filteredUsers.map(user => (
        <UserCard key={user.id} user={user} />
      ))}
    </div>
  );
};`,
      requirements: [
        'Identify performance bottlenecks in the example','Provide optimized code solutions','Explain React optimization techniques','Discuss bundle optimization strategies','Mention monitoring and profiling tools'
      ],
      expectedTime: '7-10 minutes',focus: 'React performance optimization and debugging',
      timeLimit: 120
    }
  ];

  const currentQuestion = questions?.[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions?.length - 1;
  const completedQuestions = Object.keys(answers)?.length;

  // Session recovery effect
  useEffect(() => {
    const savedSession = localStorage.getItem('interview_session');
    if (savedSession) {
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

  // Save session to localStorage
  useEffect(() => {
    const sessionData = {
      currentQuestionIndex,
      answers,
      timeElapsed,
      timestamp: new Date()?.toISOString()
    };
    localStorage.setItem('interview_session', JSON.stringify(sessionData));
  }, [currentQuestionIndex, answers, timeElapsed]);

  const handleAnswerChange = (answer) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion?.id]: answer
    }));
  };

  const handleSubmitAnswer = async (answer) => {
    setIsSubmitting(true);
    
    // Simulate API call for answer submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    handleAnswerChange(answer);
    setIsSubmitting(false);
  };

  const handleNextQuestion = (answer) => {
    handleAnswerChange(answer);
    
    if (isLastQuestion) {
      // Complete interview
      localStorage.removeItem('interview_session');
      navigate('/interview-complete');
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handleTimeUp = () => {
    const currentAnswer = answers?.[currentQuestion?.id] || '';
    if (currentAnswer?.trim()) {
      handleNextQuestion(currentAnswer);
    } else {
      // Auto-submit empty answer
      handleNextQuestion('No answer provided - time expired');
    }
  };

  const handlePauseInterview = () => {
    setIsPaused(true);
  };

  const handleResumeInterview = () => {
    setIsPaused(false);
  };

  const handleSessionContinue = (sessionData) => {
    setCurrentQuestionIndex(sessionData?.currentQuestion - 1);
    setAnswers(sessionData?.answers || {});
    setTimeElapsed(sessionData?.timeElapsed || 0);
    setShowSessionModal(false);
  };

  const handleSessionStartNew = () => {
    setCurrentQuestionIndex(0);
    setAnswers({});
    setTimeElapsed(0);
    setShowSessionModal(false);
  };

  const getDifficultyTimeLimit = (difficulty) => {
    const timeLimits = { easy: 20, medium: 60, hard: 120 };
    return timeLimits?.[difficulty] || 60;
  };

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
        initialTime={getDifficultyTimeLimit(currentQuestion?.difficulty)}
        onTimeUp={handleTimeUp}
        onPause={handlePauseInterview}
        onResume={handleResumeInterview}
        isPaused={isPaused}
        difficulty={currentQuestion?.difficulty}
        questionNumber={currentQuestionIndex + 1}
        totalQuestions={questions?.length}
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
                  Full-Stack Developer Position • AI-Generated Questions
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
                totalQuestions={questions?.length}
              />
              
              <AnswerInput
                answer={answers?.[currentQuestion?.id] || ''}
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
                totalQuestions={questions?.length}
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
                    onClick={() => handleNextQuestion(answers?.[currentQuestion?.id] || '')}
                    disabled={isLastQuestion || !answers?.[currentQuestion?.id]?.trim()}
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
                      localStorage.removeItem('interview_session');
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