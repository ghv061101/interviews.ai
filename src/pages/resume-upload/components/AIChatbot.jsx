import React, { useState, useRef, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const AIChatbot = ({ 
  isVisible = false,
  missingFields = [],
  onFieldProvided = () => {},
  onClose = () => {},
  className = ''
}) => {
  const [messages, setMessages] = useState([]);
  const [currentInput, setCurrentInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentField, setCurrentField] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const fieldLabels = {
    fullName: 'full name',
    email: 'email address',
    phone: 'phone number'
  };

  useEffect(() => {
    if (isVisible && missingFields?.length > 0) {
      initializeChat();
    }
  }, [isVisible, missingFields]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef?.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const initializeChat = () => {
    const welcomeMessage = {
      id: Date.now(),
      type: 'bot',
      content: `Hi! I noticed some information is missing from your resume. I'll help you provide the required details to start your interview.`,
      timestamp: new Date()
    };

    setMessages([welcomeMessage]);
    
    setTimeout(() => {
      askForNextField();
    }, 1000);
  };

  const askForNextField = () => {
    const nextField = missingFields?.find(field => !messages?.some(msg => msg?.fieldType === field));
    
    if (!nextField) {
      const completionMessage = {
        id: Date.now(),
        type: 'bot',
        content: `Perfect! All required information has been collected. You can now start your interview. Good luck! 🚀`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, completionMessage]);
      return;
    }

    setCurrentField(nextField);
    setIsTyping(true);

    setTimeout(() => {
      const fieldMessage = {
        id: Date.now(),
        type: 'bot',
        content: getFieldPrompt(nextField),
        timestamp: new Date(),
        fieldType: nextField
      };
      
      setMessages(prev => [...prev, fieldMessage]);
      setIsTyping(false);
      inputRef?.current?.focus();
    }, 1500);
  };

  const getFieldPrompt = (field) => {
    switch (field) {
      case 'fullName':
        return "What's your full name? Please provide your first and last name as you'd like it to appear in the interview.";
      case 'email':
        return "What's your email address? I'll need a valid email for interview communications.";
      case 'phone':
        return "What's your phone number? Please include your country code if applicable.";
      default:
        return `Please provide your ${fieldLabels?.[field]}.`;
    }
  };

  const validateInput = (field, value) => {
    switch (field) {
      case 'fullName':
        return value?.trim()?.length >= 2;
      case 'email':
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/?.test(value);
      case 'phone':
        return /^[\+]?[1-9][\d]{0,15}$/?.test(value?.replace(/[\s\-\(\)]/g, ''));
      default:
        return value?.trim()?.length > 0;
    }
  };

  const handleSendMessage = () => {
    if (!currentInput?.trim() || !currentField) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: currentInput,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);

    if (validateInput(currentField, currentInput)) {
      onFieldProvided(currentField, currentInput);
      
      const confirmMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: `Great! I've recorded your ${fieldLabels?.[currentField]}: ${currentInput}`,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, confirmMessage]);
      setCurrentInput('');
      setCurrentField(null);
      
      setTimeout(() => {
        askForNextField();
      }, 1000);
    } else {
      const errorMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: getValidationError(currentField),
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    }
    
    setCurrentInput('');
  };

  const getValidationError = (field) => {
    switch (field) {
      case 'fullName':
        return "Please provide a valid full name with at least 2 characters.";
      case 'email':
        return "Please provide a valid email address (e.g., john@example.com).";
      case 'phone':
        return "Please provide a valid phone number.";
      default:
        return "Please provide valid information.";
    }
  };

  const handleKeyPress = (e) => {
    if (e?.key === 'Enter' && !e?.shiftKey) {
      e?.preventDefault();
      handleSendMessage();
    }
  };

  if (!isVisible) return null;

  return (
    <div className={`bg-card border border-border rounded-lg shadow-interactive ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-8 h-8 bg-accent/10 rounded-full">
            <Icon name="Bot" size={16} className="text-accent" />
          </div>
          <div>
            <h3 className="font-medium text-foreground">AI Assistant</h3>
            <p className="text-xs text-muted-foreground">Here to help complete your information</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          iconName="X"
          iconSize={16}
          onClick={onClose}
          className="text-muted-foreground hover:text-foreground"
        />
      </div>
      {/* Messages */}
      <div className="h-80 overflow-y-auto p-4 space-y-4">
        {messages?.map((message) => (
          <div
            key={message?.id}
            className={`flex ${message?.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[80%] ${message?.type === 'user' ? 'order-2' : 'order-1'}`}>
              <div
                className={`px-3 py-2 rounded-lg text-sm ${
                  message?.type === 'user' ?'bg-primary text-primary-foreground ml-auto' :'bg-muted text-foreground'
                }`}
              >
                {message?.content}
              </div>
              <div className={`text-xs text-muted-foreground mt-1 ${
                message?.type === 'user' ? 'text-right' : 'text-left'
              }`}>
                {message?.timestamp?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
            
            {message?.type === 'bot' && (
              <div className="flex items-end w-6 h-6 mr-2 order-0">
                <div className="w-6 h-6 bg-accent/10 rounded-full flex items-center justify-center">
                  <Icon name="Bot" size={12} className="text-accent" />
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="flex items-end w-6 h-6 mr-2">
              <div className="w-6 h-6 bg-accent/10 rounded-full flex items-center justify-center">
                <Icon name="Bot" size={12} className="text-accent" />
              </div>
            </div>
            <div className="bg-muted px-3 py-2 rounded-lg">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>
      {/* Input */}
      <div className="p-4 border-t border-border">
        <div className="flex space-x-2">
          <Input
            ref={inputRef}
            type="text"
            placeholder={currentField ? `Enter your ${fieldLabels?.[currentField]}...` : 'Type your message...'}
            value={currentInput}
            onChange={(e) => setCurrentInput(e?.target?.value)}
            onKeyPress={handleKeyPress}
            disabled={!currentField}
            className="flex-1"
          />
          <Button
            variant="default"
            size="sm"
            iconName="Send"
            iconSize={16}
            onClick={handleSendMessage}
            disabled={!currentInput?.trim() || !currentField}
          />
        </div>
      </div>
    </div>
  );
};

export default AIChatbot;