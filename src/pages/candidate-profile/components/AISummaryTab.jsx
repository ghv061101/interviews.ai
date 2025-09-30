import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AISummaryTab = ({ 
  aiSummary = {},
  onRegenerateInsights = () => {},
  className = ''
}) => {
  const [expandedSections, setExpandedSections] = useState({
    strengths: true,
    weaknesses: true,
    technical: true,
    recommendations: true
  });

  const mockAISummary = {
    overallAssessment: {
      score: 85,
      grade: 'A-',
      recommendation: 'Strong Hire',
      confidence: 92,
      summary: `Sarah demonstrates exceptional technical knowledge with strong problem-solving abilities. Her responses show deep understanding of JavaScript fundamentals, React ecosystem, and modern development practices. She provides clear explanations with practical examples and shows awareness of performance optimization and scalability concerns.`
    },
    strengths: [
      {
        category: 'Technical Knowledge',
        description: 'Excellent understanding of JavaScript fundamentals including closures, hoisting, and ES6+ features',
        evidence: 'Provided comprehensive explanations with code examples for var/let/const and closures questions',
        impact: 'High'
      },
      {
        category: 'Problem Solving',
        description: 'Strong analytical thinking and ability to break down complex problems',
        evidence: 'Implemented debounce function with clear explanation of use cases and performance benefits',
        impact: 'High'
      },
      {
        category: 'React Expertise',
        description: 'Deep knowledge of React patterns, hooks, and lifecycle methods',
        evidence: 'Accurately mapped class component lifecycle to modern hooks with practical examples',
        impact: 'High'
      },
      {
        category: 'Architecture Thinking',
        description: 'Demonstrates understanding of scalable application design',
        evidence: 'Comprehensive architecture proposal covering state management, routing, and performance',
        impact: 'Medium'
      },
      {
        category: 'Code Quality',
        description: 'Shows awareness of best practices and clean code principles',
        evidence: 'Custom hook implementation follows React patterns with proper error handling',
        impact: 'Medium'
      }
    ],
    weaknesses: [
      {
        category: 'Time Management',
        description: 'Slightly exceeded time limits on complex questions',
        evidence: 'Used 135s for architecture question (120s limit) and 140s for custom hook (120s limit)',
        impact: 'Low',
        suggestion: 'Practice concise explanations while maintaining technical depth'
      },
      {
        category: 'Testing Knowledge',
        description: 'Limited discussion of testing strategies in architecture response',
        evidence: 'Mentioned Jest + Testing Library but could elaborate on testing patterns',
        impact: 'Low',
        suggestion: 'Expand knowledge on testing methodologies and TDD practices'
      },
      {
        category: 'Performance Metrics',
        description: 'Could provide more specific performance optimization examples',
        evidence: 'General mentions of optimization without specific metrics or tools',
        impact: 'Low',
        suggestion: 'Study performance monitoring tools and optimization techniques'
      }
    ],
    technicalCompetency: {
      javascript: {
        score: 90,
        level: 'Expert',
        details: 'Strong grasp of fundamentals, closures, and modern features'
      },
      react: {
        score: 88,
        level: 'Expert',
        details: 'Excellent knowledge of hooks, lifecycle, and component patterns'
      },
      architecture: {
        score: 85,
        level: 'Advanced',
        details: 'Good understanding of scalable design patterns and state management'
      },
      problemSolving: {
        score: 87,
        level: 'Advanced',
        details: 'Systematic approach with clear explanations and practical examples'
      },
      codeQuality: {
        score: 82,
        level: 'Advanced',
        details: 'Follows best practices with room for improvement in testing'
      },
      communication: {
        score: 85,
        level: 'Advanced',
        details: 'Clear explanations with good use of examples and code snippets'
      }
    },
    recommendations: {
      hiring: {
        decision: 'Strong Hire',
        confidence: 92,
        reasoning: `Sarah demonstrates the technical skills and problem-solving abilities required for a Senior Frontend Developer role. Her strong JavaScript and React knowledge, combined with architectural thinking, make her a valuable addition to the team.`
      },
      role: {
        suggested: 'Senior Frontend Developer',
        alternative: 'Lead Frontend Developer (with mentorship)',
        reasoning: 'Technical skills align well with senior role requirements. Could grow into lead position with experience in team management.'
      },
      onboarding: [
        'Pair with senior architect for first project to reinforce scalability patterns',
        'Provide training on advanced testing methodologies and TDD practices',
        'Assign performance optimization project to strengthen monitoring skills',
        'Include in architecture review meetings to expand system design knowledge'
      ],
      development: [
        'Advanced React patterns workshop',
        'Performance optimization certification',
        'System design course for large-scale applications',
        'Leadership and mentoring skills training'
      ]
    },
    comparativeAnalysis: {
      percentile: 85,
      comparison: 'Top 15% of candidates interviewed for similar positions',
      benchmarks: {
        technical: 'Above average compared to senior developer candidates',
        communication: 'Strong compared to peer group',
        problemSolving: 'Excellent compared to similar experience level'
      }
    },
    riskFactors: [
      {
        factor: 'Time Management',
        risk: 'Low',
        description: 'Slight tendency to exceed time limits on complex problems',
        mitigation: 'Provide clear project timelines and regular check-ins'
      },
      {
        factor: 'Testing Experience',
        risk: 'Low',
        description: 'Limited depth in testing methodologies',
        mitigation: 'Assign testing-focused tasks early in onboarding'
      }
    ],
    generatedAt: '2025-09-28T14:15:00Z',
    aiModel: 'Gemini-Pro-1.5',
    processingTime: '2.3s'
  };

  const displaySummary = Object.keys(aiSummary)?.length > 0 ? aiSummary : mockAISummary;

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev?.[section]
    }));
  };

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-success';
    if (score >= 80) return 'text-accent';
    if (score >= 70) return 'text-warning';
    return 'text-error';
  };

  const getGradeColor = (grade) => {
    if (grade?.startsWith('A')) return 'text-success';
    if (grade?.startsWith('B')) return 'text-accent';
    if (grade?.startsWith('C')) return 'text-warning';
    return 'text-error';
  };

  const getRecommendationColor = (recommendation) => {
    if (recommendation === 'Strong Hire') return 'text-success';
    if (recommendation === 'Hire') return 'text-accent';
    if (recommendation === 'Maybe') return 'text-warning';
    return 'text-error';
  };

  const getImpactColor = (impact) => {
    switch (impact) {
      case 'High': return 'text-error';
      case 'Medium': return 'text-warning';
      case 'Low': return 'text-success';
      default: return 'text-muted-foreground';
    }
  };

  const getLevelBadge = (level) => {
    const config = {
      'Expert': { bg: 'bg-success/10', text: 'text-success' },
      'Advanced': { bg: 'bg-accent/10', text: 'text-accent' },
      'Intermediate': { bg: 'bg-warning/10', text: 'text-warning' },
      'Beginner': { bg: 'bg-error/10', text: 'text-error' }
    };

    const { bg, text } = config?.[level] || config?.['Intermediate'];

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${bg} ${text}`}>
        {level}
      </span>
    );
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">AI-Generated Summary</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Powered by {displaySummary?.aiModel} • Generated {new Date(displaySummary.generatedAt)?.toLocaleString()}
          </p>
        </div>
        <Button
          variant="outline"
          iconName="RefreshCw"
          iconPosition="left"
          iconSize={16}
          onClick={onRegenerateInsights}
        >
          Regenerate Insights
        </Button>
      </div>
      {/* Overall Assessment */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-medium text-foreground mb-4 flex items-center">
          <Icon name="Target" size={20} className="mr-2 text-primary" />
          Overall Assessment
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center">
            <div className={`text-3xl font-bold ${getScoreColor(displaySummary?.overallAssessment?.score)}`}>
              {displaySummary?.overallAssessment?.score}
            </div>
            <div className="text-sm text-muted-foreground">Overall Score</div>
          </div>
          <div className="text-center">
            <div className={`text-3xl font-bold ${getGradeColor(displaySummary?.overallAssessment?.grade)}`}>
              {displaySummary?.overallAssessment?.grade}
            </div>
            <div className="text-sm text-muted-foreground">Grade</div>
          </div>
          <div className="text-center">
            <div className={`text-lg font-bold ${getRecommendationColor(displaySummary?.overallAssessment?.recommendation)}`}>
              {displaySummary?.overallAssessment?.recommendation}
            </div>
            <div className="text-sm text-muted-foreground">Recommendation</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary">
              {displaySummary?.overallAssessment?.confidence}%
            </div>
            <div className="text-sm text-muted-foreground">Confidence</div>
          </div>
        </div>

        <div className="bg-muted/30 rounded-lg p-4">
          <p className="text-muted-foreground leading-relaxed">
            {displaySummary?.overallAssessment?.summary}
          </p>
        </div>
      </div>
      {/* Strengths */}
      <div className="bg-card border border-border rounded-lg">
        <button
          onClick={() => toggleSection('strengths')}
          className="w-full flex items-center justify-between p-6 text-left hover:bg-muted/30 transition-colors"
        >
          <h3 className="text-lg font-medium text-foreground flex items-center">
            <Icon name="TrendingUp" size={20} className="mr-2 text-success" />
            Key Strengths ({displaySummary?.strengths?.length})
          </h3>
          <Icon 
            name={expandedSections?.strengths ? 'ChevronUp' : 'ChevronDown'} 
            size={20} 
            className="text-muted-foreground" 
          />
        </button>
        
        {expandedSections?.strengths && (
          <div className="px-6 pb-6 space-y-4">
            {displaySummary?.strengths?.map((strength, index) => (
              <div key={index} className="bg-success/5 border border-success/20 rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-foreground">{strength?.category}</h4>
                  <span className={`text-xs font-medium ${getImpactColor(strength?.impact)}`}>
                    {strength?.impact} Impact
                  </span>
                </div>
                <p className="text-muted-foreground text-sm mb-2">{strength?.description}</p>
                <div className="bg-muted/50 rounded p-2">
                  <p className="text-xs text-muted-foreground">
                    <strong>Evidence:</strong> {strength?.evidence}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* Weaknesses */}
      <div className="bg-card border border-border rounded-lg">
        <button
          onClick={() => toggleSection('weaknesses')}
          className="w-full flex items-center justify-between p-6 text-left hover:bg-muted/30 transition-colors"
        >
          <h3 className="text-lg font-medium text-foreground flex items-center">
            <Icon name="TrendingDown" size={20} className="mr-2 text-warning" />
            Areas for Improvement ({displaySummary?.weaknesses?.length})
          </h3>
          <Icon 
            name={expandedSections?.weaknesses ? 'ChevronUp' : 'ChevronDown'} 
            size={20} 
            className="text-muted-foreground" 
          />
        </button>
        
        {expandedSections?.weaknesses && (
          <div className="px-6 pb-6 space-y-4">
            {displaySummary?.weaknesses?.map((weakness, index) => (
              <div key={index} className="bg-warning/5 border border-warning/20 rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-foreground">{weakness?.category}</h4>
                  <span className={`text-xs font-medium ${getImpactColor(weakness?.impact)}`}>
                    {weakness?.impact} Impact
                  </span>
                </div>
                <p className="text-muted-foreground text-sm mb-2">{weakness?.description}</p>
                <div className="bg-muted/50 rounded p-2 mb-2">
                  <p className="text-xs text-muted-foreground">
                    <strong>Evidence:</strong> {weakness?.evidence}
                  </p>
                </div>
                <div className="bg-accent/10 rounded p-2">
                  <p className="text-xs text-accent">
                    <strong>Suggestion:</strong> {weakness?.suggestion}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* Technical Competency */}
      <div className="bg-card border border-border rounded-lg">
        <button
          onClick={() => toggleSection('technical')}
          className="w-full flex items-center justify-between p-6 text-left hover:bg-muted/30 transition-colors"
        >
          <h3 className="text-lg font-medium text-foreground flex items-center">
            <Icon name="Code" size={20} className="mr-2 text-primary" />
            Technical Competency Breakdown
          </h3>
          <Icon 
            name={expandedSections?.technical ? 'ChevronUp' : 'ChevronDown'} 
            size={20} 
            className="text-muted-foreground" 
          />
        </button>
        
        {expandedSections?.technical && (
          <div className="px-6 pb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(displaySummary?.technicalCompetency)?.map(([skill, data]) => (
                <div key={skill} className="bg-muted/30 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-foreground capitalize">
                      {skill?.replace(/([A-Z])/g, ' $1')?.trim()}
                    </h4>
                    {getLevelBadge(data?.level)}
                  </div>
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="flex-1 bg-muted rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${getScoreColor(data?.score)?.replace('text-', 'bg-')}`}
                        style={{ width: `${data?.score}%` }}
                      />
                    </div>
                    <span className={`text-sm font-medium ${getScoreColor(data?.score)}`}>
                      {data?.score}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">{data?.details}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      {/* Recommendations */}
      <div className="bg-card border border-border rounded-lg">
        <button
          onClick={() => toggleSection('recommendations')}
          className="w-full flex items-center justify-between p-6 text-left hover:bg-muted/30 transition-colors"
        >
          <h3 className="text-lg font-medium text-foreground flex items-center">
            <Icon name="Lightbulb" size={20} className="mr-2 text-accent" />
            Hiring Recommendations
          </h3>
          <Icon 
            name={expandedSections?.recommendations ? 'ChevronUp' : 'ChevronDown'} 
            size={20} 
            className="text-muted-foreground" 
          />
        </button>
        
        {expandedSections?.recommendations && (
          <div className="px-6 pb-6 space-y-6">
            {/* Hiring Decision */}
            <div className="bg-accent/5 border border-accent/20 rounded-lg p-4">
              <h4 className="font-medium text-foreground mb-2">Hiring Decision</h4>
              <div className="flex items-center space-x-4 mb-3">
                <span className={`text-lg font-bold ${getRecommendationColor(displaySummary?.recommendations?.hiring?.decision)}`}>
                  {displaySummary?.recommendations?.hiring?.decision}
                </span>
                <span className="text-sm text-muted-foreground">
                  {displaySummary?.recommendations?.hiring?.confidence}% confidence
                </span>
              </div>
              <p className="text-muted-foreground text-sm">
                {displaySummary?.recommendations?.hiring?.reasoning}
              </p>
            </div>

            {/* Role Recommendation */}
            <div className="bg-muted/30 rounded-lg p-4">
              <h4 className="font-medium text-foreground mb-2">Role Recommendation</h4>
              <div className="space-y-2">
                <div>
                  <span className="text-sm font-medium text-primary">Suggested Role:</span>
                  <span className="ml-2 text-sm text-foreground">
                    {displaySummary?.recommendations?.role?.suggested}
                  </span>
                </div>
                <div>
                  <span className="text-sm font-medium text-accent">Alternative:</span>
                  <span className="ml-2 text-sm text-foreground">
                    {displaySummary?.recommendations?.role?.alternative}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  {displaySummary?.recommendations?.role?.reasoning}
                </p>
              </div>
            </div>

            {/* Onboarding Plan */}
            <div>
              <h4 className="font-medium text-foreground mb-3">Onboarding Recommendations</h4>
              <div className="space-y-2">
                {displaySummary?.recommendations?.onboarding?.map((item, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <Icon name="CheckCircle" size={16} className="text-success mt-0.5" />
                    <span className="text-sm text-muted-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Development Plan */}
            <div>
              <h4 className="font-medium text-foreground mb-3">Professional Development</h4>
              <div className="space-y-2">
                {displaySummary?.recommendations?.development?.map((item, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <Icon name="BookOpen" size={16} className="text-accent mt-0.5" />
                    <span className="text-sm text-muted-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
      {/* Comparative Analysis */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-medium text-foreground mb-4 flex items-center">
          <Icon name="BarChart3" size={20} className="mr-2 text-primary" />
          Comparative Analysis
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">
              {displaySummary?.comparativeAnalysis?.percentile}th
            </div>
            <div className="text-sm text-muted-foreground">Percentile</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-medium text-foreground">Top 15%</div>
            <div className="text-sm text-muted-foreground">of Candidates</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-medium text-success">Above Average</div>
            <div className="text-sm text-muted-foreground">Performance</div>
          </div>
        </div>

        <div className="space-y-2">
          {Object.entries(displaySummary?.comparativeAnalysis?.benchmarks)?.map(([category, comparison]) => (
            <div key={category} className="flex items-center justify-between py-2 border-b border-border last:border-b-0">
              <span className="text-sm font-medium text-foreground capitalize">
                {category}:
              </span>
              <span className="text-sm text-muted-foreground">{comparison}</span>
            </div>
          ))}
        </div>
      </div>
      {/* Risk Factors */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-medium text-foreground mb-4 flex items-center">
          <Icon name="AlertTriangle" size={20} className="mr-2 text-warning" />
          Risk Assessment
        </h3>
        
        <div className="space-y-4">
          {displaySummary?.riskFactors?.map((risk, index) => (
            <div key={index} className="bg-warning/5 border border-warning/20 rounded-lg p-4">
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-medium text-foreground">{risk?.factor}</h4>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  risk?.risk === 'Low' ? 'bg-success/10 text-success' :
                  risk?.risk === 'Medium'? 'bg-warning/10 text-warning' : 'bg-error/10 text-error'
                }`}>
                  {risk?.risk} Risk
                </span>
              </div>
              <p className="text-muted-foreground text-sm mb-2">{risk?.description}</p>
              <div className="bg-accent/10 rounded p-2">
                <p className="text-xs text-accent">
                  <strong>Mitigation:</strong> {risk?.mitigation}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AISummaryTab;