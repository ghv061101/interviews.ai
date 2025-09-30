import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AnswerInput = ({ 
  answer = '',
  onAnswerChange = () => {},
  onSubmit = () => {},
  onNext = () => {},
  isLastQuestion = false,
  isSubmitting = false,
  autoSaveEnabled = true,
  maxCharacters = 2000,
  className = ''
}) => {
  const [localAnswer, setLocalAnswer] = useState(answer);
  const [lastSaved, setLastSaved] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // Auto-save functionality
  useEffect(() => {
    if (!autoSaveEnabled) return;

    const saveTimeout = setTimeout(() => {
      if (localAnswer !== answer && localAnswer?.trim()) {
        setIsSaving(true);
        onAnswerChange(localAnswer);
        
        // Simulate save delay
        setTimeout(() => {
          setIsSaving(false);
          setLastSaved(new Date());
        }, 500);
      }
    }, 1000);

    return () => clearTimeout(saveTimeout);
  }, [localAnswer, answer, onAnswerChange, autoSaveEnabled]);

  const handleAnswerChange = (e) => {
    const value = e?.target?.value;
    if (value?.length <= maxCharacters) {
      setLocalAnswer(value);
    }
  };

  const handleSubmit = () => {
    onAnswerChange(localAnswer);
    onSubmit(localAnswer);
  };

  const handleNext = () => {
    onAnswerChange(localAnswer);
    onNext(localAnswer);
  };

  const characterCount = localAnswer?.length;
  const isNearLimit = characterCount > maxCharacters * 0.8;
  const isAtLimit = characterCount >= maxCharacters;

  const formatLastSaved = (date) => {
    if (!date) return '';
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 10) return 'Saved just now';
    if (diffInSeconds < 60) return `Saved ${diffInSeconds}s ago`;
    return `Saved ${Math.floor(diffInSeconds / 60)}m ago`;
  };

  return (
    <div className={`bg-card border border-border rounded-lg shadow-card p-6 ${className}`}>
      {/* Input Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Icon name="Edit3" size={16} className="text-muted-foreground" />
          <span className="text-sm font-medium text-foreground">Your Answer</span>
        </div>
        
        <div className="flex items-center space-x-3 text-sm">
          {/* Auto-save status */}
          {autoSaveEnabled && (
            <div className="flex items-center space-x-1">
              {isSaving ? (
                <>
                  <Icon name="Loader2" size={14} className="animate-spin text-accent" />
                  <span className="text-accent">Saving...</span>
                </>
              ) : lastSaved ? (
                <>
                  <Icon name="Check" size={14} className="text-success" />
                  <span className="text-success">{formatLastSaved(lastSaved)}</span>
                </>
              ) : (
                <span className="text-muted-foreground">Auto-save enabled</span>
              )}
            </div>
          )}
          
          {/* Character count */}
          <span className={`font-mono ${
            isAtLimit ? 'text-error' : isNearLimit ?'text-warning': 'text-muted-foreground'
          }`}>
            {characterCount}/{maxCharacters}
          </span>
        </div>
      </div>
      {/* Text Area */}
      <div className="relative mb-4">
        <textarea
          value={localAnswer}
          onChange={handleAnswerChange}
          placeholder="Type your answer here... Be specific and explain your thought process."
          className="w-full h-48 md:h-64 p-4 border border-border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground placeholder-muted-foreground transition-all duration-200"
          disabled={isSubmitting}
        />
        
        {/* Character limit warning */}
        {isNearLimit && (
          <div className={`absolute bottom-2 right-2 px-2 py-1 rounded text-xs font-medium ${
            isAtLimit ? 'bg-error/10 text-error' : 'bg-warning/10 text-warning'
          }`}>
            {isAtLimit ? 'Character limit reached' : 'Approaching limit'}
          </div>
        )}
      </div>
      {/* Writing Tips */}
      <div className="bg-accent/5 border border-accent/20 rounded-lg p-3 mb-6">
        <div className="flex items-start space-x-2">
          <Icon name="Lightbulb" size={16} className="text-accent mt-0.5 flex-shrink-0" />
          <div className="text-sm">
            <p className="font-medium text-accent mb-1">Writing Tips</p>
            <ul className="text-accent/80 space-y-1">
              <li>• Explain your approach step by step</li>
              <li>• Include code examples if relevant</li>
              <li>• Mention any assumptions you're making</li>
              <li>• Consider edge cases and potential issues</li>
            </ul>
          </div>
        </div>
      </div>
      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
        <Button
          variant="default"
          iconName="Send"
          iconPosition="left"
          iconSize={16}
          onClick={handleSubmit}
          disabled={!localAnswer?.trim() || isSubmitting}
          loading={isSubmitting}
          className="sm:flex-1"
        >
          Submit Answer
        </Button>
        
        {!isLastQuestion && (
          <Button
            variant="outline"
            iconName="ArrowRight"
            iconPosition="right"
            iconSize={16}
            onClick={handleNext}
            disabled={!localAnswer?.trim() || isSubmitting}
            className="sm:flex-1"
          >
            Next Question
          </Button>
        )}
        
        {isLastQuestion && (
          <Button
            variant="success"
            iconName="CheckCircle"
            iconPosition="left"
            iconSize={16}
            onClick={handleNext}
            disabled={!localAnswer?.trim() || isSubmitting}
            className="sm:flex-1"
          >
            Complete Interview
          </Button>
        )}
      </div>
      {/* Progress Indicator */}
      <div className="mt-4 pt-4 border-t border-border">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center space-x-2">
            <Icon name="FileText" size={14} />
            <span>
              {localAnswer?.trim() ? 'Answer provided' : 'No answer yet'}
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Icon name="Save" size={14} />
            <span>
              {autoSaveEnabled ? 'Auto-saving enabled' : 'Manual save only'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnswerInput;