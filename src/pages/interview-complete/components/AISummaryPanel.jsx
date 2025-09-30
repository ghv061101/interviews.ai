import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';


const AISummaryPanel = ({ 
  summary = null,
  candidateName = "John Doe",
  position = "Senior Frontend Developer",
  className = ''
}) => {
  const [expandedSection, setExpandedSection] = useState('overview');

  const mockSummary = {
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
  };

  const displaySummary = summary || mockSummary;

  const sections = [
    {
      id: 'overview',
      title: 'Overall Assessment',
      icon: 'FileText',
      content: displaySummary?.overview
    },
    {
      id: 'technical',
      title: 'Technical Accuracy',
      icon: 'Code',
      content: displaySummary?.technicalAccuracy
    },
    {
      id: 'problem-solving',
      title: 'Problem Solving',
      icon: 'Lightbulb',
      content: displaySummary?.problemSolving
    },
    {
      id: 'communication',
      title: 'Communication',
      icon: 'MessageSquare',
      content: displaySummary?.communication
    }
  ];

  return (
    <div className={`bg-card border border-border rounded-lg ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
            <Icon name="Brain" size={20} className="text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-foreground">AI Performance Summary</h2>
            <p className="text-sm text-muted-foreground">
              Detailed evaluation for {candidateName} - {position}
            </p>
          </div>
        </div>
      </div>
      {/* Summary Sections */}
      <div className="p-6">
        <div className="space-y-4">
          {sections?.map((section) => (
            <div key={section?.id} className="border border-border rounded-lg overflow-hidden">
              <button
                onClick={() => setExpandedSection(expandedSection === section?.id ? null : section?.id)}
                className="w-full p-4 text-left hover:bg-muted/30 transition-colors flex items-center justify-between"
              >
                <div className="flex items-center space-x-3">
                  <Icon name={section?.icon} size={18} className="text-primary" />
                  <span className="font-medium text-foreground">{section?.title}</span>
                </div>
                <Icon 
                  name={expandedSection === section?.id ? 'ChevronUp' : 'ChevronDown'} 
                  size={16} 
                  className="text-muted-foreground" 
                />
              </button>
              
              {expandedSection === section?.id && (
                <div className="px-4 pb-4 animate-slide-in">
                  <div className="pl-9">
                    <p className="text-sm text-foreground leading-relaxed">
                      {section?.content}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Recommendations */}
        {displaySummary?.recommendations && (
          <div className="mt-6 p-4 bg-accent/10 border border-accent/20 rounded-lg">
            <div className="flex items-center space-x-2 mb-3">
              <Icon name="Target" size={18} className="text-accent" />
              <h3 className="font-medium text-accent">Recommendations for Improvement</h3>
            </div>
            <ul className="space-y-2">
              {displaySummary?.recommendations?.map((recommendation, index) => (
                <li key={index} className="flex items-start space-x-2 text-sm">
                  <Icon name="ArrowRight" size={14} className="text-accent mt-0.5 flex-shrink-0" />
                  <span className="text-foreground">{recommendation}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* AI Confidence */}
        <div className="mt-4 p-3 bg-muted/30 rounded-lg">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2">
              <Icon name="Zap" size={14} className="text-warning" />
              <span className="text-muted-foreground">AI Confidence Level</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-16 bg-muted rounded-full h-1.5">
                <div className="w-4/5 bg-warning h-1.5 rounded-full" />
              </div>
              <span className="font-medium text-foreground">85%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AISummaryPanel;