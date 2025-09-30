import React, { useState, useRef, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const ChatHistoryTab = ({ 
  chatHistory = [],
  onAddNote = () => {},
  className = ''
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [noteText, setNoteText] = useState('');
  const [showNoteModal, setShowNoteModal] = useState(false);
  const chatEndRef = useRef(null);

  const mockChatHistory = [
    {
      id: 1,
      type: 'system',
      content: 'Interview started. Good luck!',
      timestamp: '2025-09-28T14:00:00Z',
      questionNumber: null,
      difficulty: null,
      score: null
    },
    {
      id: 2,
      type: 'question',
      content: 'What is the difference between let, const, and var in JavaScript?',
      timestamp: '2025-09-28T14:00:30Z',
      questionNumber: 1,
      difficulty: 'easy',
      timeLimit: 20,
      score: null
    },
    {
      id: 3,
      type: 'answer',
      content: `The main differences are:\n\n1. **var**: Function-scoped, can be redeclared and updated, hoisted with undefined initialization\n2. **let**: Block-scoped, can be updated but not redeclared in same scope, hoisted but not initialized\n3. **const**: Block-scoped, cannot be updated or redeclared, must be initialized at declaration\n\nExample:\n\`\`\`javascript\nvar x = 1; // function scoped\nlet y = 2; // block scoped\nconst z = 3; // block scoped, immutable\n\`\`\``,
      timestamp: '2025-09-28T14:01:15Z',
      questionNumber: 1,
      difficulty: 'easy',
      timeUsed: 45,
      score: 18,
      maxScore: 20,
      aiEvaluation: 'Excellent answer with clear explanations and good code example. Shows strong understanding of JavaScript fundamentals.'
    },
    {
      id: 4,
      type: 'question',
      content: 'Explain the concept of closures in JavaScript and provide a practical example.',
      timestamp: '2025-09-28T14:02:00Z',
      questionNumber: 2,
      difficulty: 'easy',
      timeLimit: 20,
      score: null
    },
    {
      id: 5,
      type: 'answer',
      content: `A closure is when a function has access to variables from its outer (enclosing) scope even after the outer function has returned.\n\nPractical example - Counter function:\n\`\`\`javascript\nfunction createCounter() {\n  let count = 0;\n  return function() {\n    count++;\n    return count;\n  };\n}\n\nconst counter = createCounter();\nconsole.log(counter()); // 1\nconsole.log(counter()); // 2\n\`\`\`\n\nThe inner function maintains access to the 'count' variable even after createCounter has finished executing.`,
      timestamp: '2025-09-28T14:02:50Z',
      questionNumber: 2,
      difficulty: 'easy',
      timeUsed: 50,
      score: 17,
      maxScore: 20,
      aiEvaluation: 'Good understanding of closures with a practical example. Could have mentioned more use cases like data privacy.'
    },
    {
      id: 6,
      type: 'question',
      content: 'How would you implement a debounce function in JavaScript? Explain when and why you would use it.',
      timestamp: '2025-09-28T14:03:30Z',
      questionNumber: 3,
      difficulty: 'medium',
      timeLimit: 60,
      score: null
    },
    {
      id: 7,
      type: 'answer',
      content: `Debounce delays function execution until after a specified time has passed since the last call.\n\nImplementation:\n\`\`\`javascript\nfunction debounce(func, delay) {\n  let timeoutId;\n  return function(...args) {\n    clearTimeout(timeoutId);\n    timeoutId = setTimeout(() => func.apply(this, args), delay);\n  };\n}\n\n// Usage example:\nconst debouncedSearch = debounce((query) => {\n  // API call\n  searchAPI(query);\n}, 300);\n\`\`\`\n\n**When to use:**\n- Search input fields (avoid API calls on every keystroke)\n- Resize event handlers\n- Button click prevention\n- Form validation\n\n**Why use it:**\n- Improves performance by reducing unnecessary function calls\n- Prevents API spam\n- Better user experience`,
      timestamp: '2025-09-28T14:04:45Z',
      questionNumber: 3,
      difficulty: 'medium',
      timeUsed: 75,
      score: 25,
      maxScore: 30,
      aiEvaluation: 'Excellent implementation with clear explanation of use cases. Shows practical understanding of performance optimization.'
    },
    {
      id: 8,
      type: 'question',
      content: 'Describe the React component lifecycle methods and their modern Hook equivalents.',
      timestamp: '2025-09-28T14:05:30Z',
      questionNumber: 4,
      difficulty: 'medium',
      timeLimit: 60,
      score: null
    },
    {
      id: 9,
      type: 'answer',
      content: `**Class Component Lifecycle → Hook Equivalents:**\n\n1. **componentDidMount** → useEffect with empty dependency array\n\`\`\`javascript\nuseEffect(() => {\n  // Mount logic\n}, []);\n\`\`\`\n\n2. **componentDidUpdate** → useEffect with dependencies\n\`\`\`javascript\nuseEffect(() => {\n  // Update logic\n}, [dependency]);\n\`\`\`\n\n3. **componentWillUnmount** → useEffect cleanup function\n\`\`\`javascript\nuseEffect(() => {\n  return () => {\n    // Cleanup logic\n  };\n}, []);\n\`\`\`\n\n4. **shouldComponentUpdate** → React.memo or useMemo\n\n5. **getDerivedStateFromProps** → useState with useEffect\n\nHooks provide more granular control and better code reusability compared to class lifecycle methods.`,
      timestamp: '2025-09-28T14:06:40Z',
      questionNumber: 4,
      difficulty: 'medium',
      timeUsed: 70,
      score: 27,
      maxScore: 30,
      aiEvaluation: 'Strong knowledge of both class components and hooks. Good code examples and clear mapping between concepts.'
    },
    {
      id: 10,
      type: 'question',
      content: 'Design a scalable architecture for a large React application. Include state management, routing, and performance considerations.',
      timestamp: '2025-09-28T14:07:30Z',
      questionNumber: 5,
      difficulty: 'hard',
      timeLimit: 120,
      score: null
    },
    {
      id: 11,
      type: 'answer',
      content: `**Scalable React Architecture:**\n\n**1. Folder Structure:**\n\`\`\`\nsrc/\n├── components/     # Reusable UI components\n├── pages/         # Route components\n├── hooks/         # Custom hooks\n├── services/      # API calls\n├── store/         # State management\n├── utils/         # Helper functions\n└── types/         # TypeScript definitions\n\`\`\`\n\n**2. State Management:**\n- **Redux Toolkit** for global state\n- **React Query** for server state\n- **Zustand** for simple local state\n- Context API for theme/auth\n\n**3. Routing:**\n- React Router with lazy loading\n- Route-based code splitting\n- Protected routes with HOCs\n\n**4. Performance:**\n- React.memo for component optimization\n- useMemo/useCallback for expensive operations\n- Virtual scrolling for large lists\n- Bundle splitting with Webpack\n- CDN for static assets\n\n**5. Code Quality:**\n- TypeScript for type safety\n- ESLint + Prettier\n- Husky for git hooks\n- Jest + Testing Library\n\n**6. Build & Deploy:**\n- Vite for fast builds\n- Docker containerization\n- CI/CD with GitHub Actions`,
      timestamp: '2025-09-28T14:09:45Z',
      questionNumber: 5,
      difficulty: 'hard',
      timeUsed: 135,
      score: 32,
      maxScore: 40,
      aiEvaluation: 'Comprehensive architecture design showing deep understanding of scalable React applications. Covers all major aspects with practical solutions.'
    },
    {
      id: 12,
      type: 'question',
      content: 'Implement a custom React hook for managing complex form state with validation. Include error handling and submission logic.',
      timestamp: '2025-09-28T14:10:30Z',
      questionNumber: 6,
      difficulty: 'hard',
      timeLimit: 120,
      score: null
    },
    {
      id: 13,
      type: 'answer',
      content: `**Custom Form Hook Implementation:**\n\n\`\`\`javascript\nimport { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';


;\n\nfunction useForm(initialValues, validationRules) {\n  const [values, setValues] = useState(initialValues);\n  const [errors, setErrors] = useState({});\n  const [isSubmitting, setIsSubmitting] = useState(false);\n  const [touched, setTouched] = useState({});\n\n  const validate = useCallback((fieldName, value) => {\n    const rule = validationRules[fieldName];\n    if (!rule) return '';\n\n    if (rule.required && !value) {\n      return rule.required;\n    }\n    if (rule.pattern && !rule.pattern.test(value)) {\n      return rule.patternMessage;\n    }\n    if (rule.minLength && value.length < rule.minLength) {\n      return \`Minimum \${rule.minLength} characters required\`;\n    }\n    return '';\n  }, [validationRules]);\n\n  const handleChange = useCallback((name, value) => {\n    setValues(prev => ({ ...prev, [name]: value }));\n    \n    if (touched[name]) {\n      const error = validate(name, value);\n      setErrors(prev => ({ ...prev, [name]: error }));\n    }\n  }, [validate, touched]);\n\n  const handleBlur = useCallback((name) => {\n    setTouched(prev => ({ ...prev, [name]: true }));\n    const error = validate(name, values[name]);\n    setErrors(prev => ({ ...prev, [name]: error }));\n  }, [validate, values]);\n\n  const handleSubmit = useCallback(async (onSubmit) => {\n    // Validate all fields\n    const newErrors = {};\n    Object.keys(validationRules).forEach(field => {\n      newErrors[field] = validate(field, values[field]);\n    });\n    \n    setErrors(newErrors);\n    setTouched(Object.keys(validationRules).reduce((acc, key) => {\n      acc[key] = true;\n      return acc;\n    }, {}));\n\n    const hasErrors = Object.values(newErrors).some(error => error);\n    if (hasErrors) return;\n\n    setIsSubmitting(true);\n    try {\n      await onSubmit(values);\n    } catch (error) {\n      console.error('Form submission error:', error);\n    } finally {\n      setIsSubmitting(false);\n    }\n  }, [values, validationRules, validate]);\n\n  const reset = useCallback(() => {\n    setValues(initialValues);\n    setErrors({});\n    setTouched({});\n    setIsSubmitting(false);\n  }, [initialValues]);\n\n  return {\n    values,\n    errors,\n    touched,\n    isSubmitting,\n    handleChange,\n    handleBlur,\n    handleSubmit,\n    reset\n  };\n}\n\n// Usage example:\nconst validationRules = {\n  email: {\n    required: 'Email is required',\n    pattern: /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/,\n    patternMessage: 'Invalid email format'\n  },\n  password: {\n    required: 'Password is required',\n    minLength: 8\n  }\n};\n\nconst { values, errors, handleChange, handleSubmit } = useForm(\n  { email: '', password: '' },\n  validationRules\n);\n\`\`\``,
      timestamp: '2025-09-28T14:12:50Z',
      questionNumber: 6,
      difficulty: 'hard',
      timeUsed: 140,
      score: 35,
      maxScore: 40,
      aiEvaluation: 'Excellent custom hook implementation with comprehensive validation logic. Shows advanced React patterns and practical form handling.'
    },
    {
      id: 14,
      type: 'system',
      content: 'Interview completed successfully! Final score: 85/100',
      timestamp: '2025-09-28T14:13:00Z',
      questionNumber: null,
      difficulty: null,
      score: null
    }
  ];

  const displayHistory = chatHistory?.length > 0 ? chatHistory : mockChatHistory;

  const filteredHistory = displayHistory?.filter(message =>
    message?.content?.toLowerCase()?.includes(searchTerm?.toLowerCase())
  );

  const scrollToBottom = () => {
    chatEndRef?.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [filteredHistory]);

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date?.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const getMessageIcon = (type, difficulty) => {
    switch (type) {
      case 'system':
        return { name: 'Info', color: 'text-accent' };
      case 'question':
        return { 
          name: 'MessageSquare', 
          color: difficulty === 'easy' ? 'text-success' : 
                 difficulty === 'medium' ? 'text-warning' : 'text-error'
        };
      case 'answer':
        return { name: 'User', color: 'text-primary' };
      default:
        return { name: 'MessageCircle', color: 'text-muted-foreground' };
    }
  };

  const getDifficultyBadge = (difficulty) => {
    if (!difficulty) return null;
    
    const config = {
      easy: { bg: 'bg-success/10', text: 'text-success' },
      medium: { bg: 'bg-warning/10', text: 'text-warning' },
      hard: { bg: 'bg-error/10', text: 'text-error' }
    };

    const { bg, text } = config?.[difficulty];

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${bg} ${text}`}>
        {difficulty?.charAt(0)?.toUpperCase() + difficulty?.slice(1)}
      </span>
    );
  };

  const getScoreBadge = (score, maxScore) => {
    if (score === null || score === undefined) return null;

    const percentage = (score / maxScore) * 100;
    let colorClass = 'text-muted-foreground';
    
    if (percentage >= 90) colorClass = 'text-success';
    else if (percentage >= 80) colorClass = 'text-accent';
    else if (percentage >= 70) colorClass = 'text-warning';
    else colorClass = 'text-error';

    return (
      <span className={`font-mono font-medium ${colorClass}`}>
        {score}/{maxScore}
      </span>
    );
  };

  const handleAddNote = (messageId) => {
    setSelectedMessage(messageId);
    setShowNoteModal(true);
  };

  const submitNote = () => {
    if (noteText?.trim()) {
      onAddNote(selectedMessage, noteText);
      setNoteText('');
      setShowNoteModal(false);
      setSelectedMessage(null);
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <h2 className="text-xl font-semibold text-foreground">Interview Chat History</h2>
        <div className="flex items-center space-x-3">
          <Input
            type="search"
            placeholder="Search messages..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e?.target?.value)}
            className="sm:w-64"
          />
          <Button
            variant="outline"
            iconName="Download"
            iconPosition="left"
            iconSize={16}
            onClick={() => console.log('Export chat history')}
          >
            Export
          </Button>
        </div>
      </div>
      {/* Chat Container */}
      <div className="bg-card border border-border rounded-lg">
        <div className="h-[600px] overflow-y-auto p-6 space-y-4">
          {filteredHistory?.map((message) => {
            const icon = getMessageIcon(message?.type, message?.difficulty);
            
            return (
              <div key={message?.id} className="group">
                <div className={`flex items-start space-x-3 ${
                  message?.type === 'answer' ? 'flex-row-reverse space-x-reverse' : ''
                }`}>
                  {/* Avatar */}
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    message?.type === 'system' ? 'bg-accent/10' :
                    message?.type === 'question'? 'bg-muted' : 'bg-primary/10'
                  }`}>
                    <Icon name={icon?.name} size={16} className={icon?.color} />
                  </div>

                  {/* Message Content */}
                  <div className={`flex-1 min-w-0 ${
                    message?.type === 'answer' ? 'text-right' : ''
                  }`}>
                    {/* Message Header */}
                    <div className={`flex items-center space-x-2 mb-1 ${
                      message?.type === 'answer' ? 'justify-end' : ''
                    }`}>
                      {message?.questionNumber && (
                        <span className="text-xs font-medium text-muted-foreground">
                          Q{message?.questionNumber}
                        </span>
                      )}
                      {getDifficultyBadge(message?.difficulty)}
                      <span className="text-xs text-muted-foreground">
                        {formatTimestamp(message?.timestamp)}
                      </span>
                      {message?.timeLimit && message?.type === 'question' && (
                        <span className="text-xs text-muted-foreground">
                          ({message?.timeLimit}s limit)
                        </span>
                      )}
                      {message?.timeUsed && message?.type === 'answer' && (
                        <span className="text-xs text-muted-foreground">
                          ({message?.timeUsed}s used)
                        </span>
                      )}
                    </div>

                    {/* Message Body */}
                    <div className={`rounded-lg p-4 ${
                      message?.type === 'system' ? 'bg-accent/10 text-accent' :
                      message?.type === 'question' ? 'bg-muted text-foreground' :
                      'bg-primary/10 text-foreground'
                    }`}>
                      <div className="whitespace-pre-wrap text-sm leading-relaxed">
                        {message?.content}
                      </div>
                      
                      {/* Score and AI Evaluation for answers */}
                      {message?.type === 'answer' && message?.score !== null && (
                        <div className="mt-3 pt-3 border-t border-border/50">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-medium text-muted-foreground">Score:</span>
                            {getScoreBadge(message?.score, message?.maxScore)}
                          </div>
                          {message?.aiEvaluation && (
                            <div className="text-xs text-muted-foreground italic">
                              <Icon name="Brain" size={12} className="inline mr-1" />
                              {message?.aiEvaluation}
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Message Actions */}
                    <div className={`flex items-center space-x-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity ${
                      message?.type === 'answer' ? 'justify-end' : ''
                    }`}>
                      <Button
                        variant="ghost"
                        size="sm"
                        iconName="MessageSquare"
                        iconSize={12}
                        onClick={() => handleAddNote(message?.id)}
                        className="text-muted-foreground hover:text-primary"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        iconName="Copy"
                        iconSize={12}
                        onClick={() => navigator.clipboard?.writeText(message?.content)}
                        className="text-muted-foreground hover:text-primary"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        iconName="Share"
                        iconSize={12}
                        onClick={() => console.log('Share message', message?.id)}
                        className="text-muted-foreground hover:text-primary"
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={chatEndRef} />
        </div>
      </div>
      {/* Note Modal */}
      {showNoteModal && (
        <div className="fixed inset-0 z-modal flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setShowNoteModal(false)} />
          <div className="relative bg-card border border-border rounded-lg shadow-modal max-w-md w-full">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h3 className="text-lg font-medium text-foreground">Add Note</h3>
              <Button
                variant="ghost"
                size="sm"
                iconName="X"
                iconSize={16}
                onClick={() => setShowNoteModal(false)}
              />
            </div>
            <div className="p-4">
              <textarea
                value={noteText}
                onChange={(e) => setNoteText(e?.target?.value)}
                placeholder="Add your note about this message..."
                className="w-full h-32 p-3 border border-border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <div className="flex justify-end space-x-2 mt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowNoteModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="default"
                  onClick={submitNote}
                  disabled={!noteText?.trim()}
                >
                  Add Note
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-muted/30 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-success">6</div>
          <div className="text-sm text-muted-foreground">Questions Answered</div>
        </div>
        <div className="bg-muted/30 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-primary">45:30</div>
          <div className="text-sm text-muted-foreground">Total Time</div>
        </div>
        <div className="bg-muted/30 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-warning">85</div>
          <div className="text-sm text-muted-foreground">Average Score</div>
        </div>
        <div className="bg-muted/30 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-accent">154</div>
          <div className="text-sm text-muted-foreground">Total Messages</div>
        </div>
      </div>
    </div>
  );
};

export default ChatHistoryTab;