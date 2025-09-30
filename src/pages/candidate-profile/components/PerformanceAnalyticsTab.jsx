import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const PerformanceAnalyticsTab = ({ 
  performanceData = {},
  onExportAnalytics = () => {},
  className = ''
}) => {
  const [selectedMetric, setSelectedMetric] = useState('score');
  const [comparisonView, setComparisonView] = useState('difficulty');

  const mockPerformanceData = {
    questionBreakdown: [
      {
        question: 'Q1: var/let/const',
        difficulty: 'Easy',
        score: 18,
        maxScore: 20,
        timeUsed: 45,
        timeLimit: 20,
        category: 'JavaScript Fundamentals'
      },
      {
        question: 'Q2: Closures',
        difficulty: 'Easy',
        score: 17,
        maxScore: 20,
        timeUsed: 50,
        timeLimit: 20,
        category: 'JavaScript Fundamentals'
      },
      {
        question: 'Q3: Debounce Function',
        difficulty: 'Medium',
        score: 25,
        maxScore: 30,
        timeUsed: 75,
        timeLimit: 60,
        category: 'Problem Solving'
      },
      {
        question: 'Q4: React Lifecycle',
        difficulty: 'Medium',
        score: 27,
        maxScore: 30,
        timeUsed: 70,
        timeLimit: 60,
        category: 'React'
      },
      {
        question: 'Q5: Architecture Design',
        difficulty: 'Hard',
        score: 32,
        maxScore: 40,
        timeUsed: 135,
        timeLimit: 120,
        category: 'System Design'
      },
      {
        question: 'Q6: Custom Hook',
        difficulty: 'Hard',
        score: 35,
        maxScore: 40,
        timeUsed: 140,
        timeLimit: 120,
        category: 'React'
      }
    ],
    difficultyAnalysis: [
      {
        difficulty: 'Easy',
        averageScore: 87.5,
        totalQuestions: 2,
        timeEfficiency: 62.5,
        strengths: ['Clear explanations', 'Good examples'],
        weaknesses: ['Time management']
      },
      {
        difficulty: 'Medium',
        averageScore: 86.7,
        totalQuestions: 2,
        timeEfficiency: 83.3,
        strengths: ['Practical solutions', 'Best practices'],
        weaknesses: ['Could be more concise']
      },
      {
        difficulty: 'Hard',
        averageScore: 83.8,
        totalQuestions: 2,
        timeEfficiency: 85.4,
        strengths: ['Comprehensive approach', 'Architecture thinking'],
        weaknesses: ['Time exceeded', 'Testing depth']
      }
    ],
    categoryAnalysis: [
      {
        category: 'JavaScript Fundamentals',
        score: 87.5,
        questions: 2,
        timeEfficiency: 62.5
      },
      {
        category: 'React',
        score: 86.1,
        questions: 2,
        timeEfficiency: 84.4
      },
      {
        category: 'Problem Solving',
        score: 83.3,
        questions: 1,
        timeEfficiency: 80.0
      },
      {
        category: 'System Design',
        score: 80.0,
        questions: 1,
        timeEfficiency: 88.9
      }
    ],
    timeAnalysis: [
      {
        question: 'Q1',
        timeUsed: 45,
        timeLimit: 20,
        efficiency: 44.4
      },
      {
        question: 'Q2',
        timeUsed: 50,
        timeLimit: 20,
        efficiency: 40.0
      },
      {
        question: 'Q3',
        timeUsed: 75,
        timeLimit: 60,
        efficiency: 80.0
      },
      {
        question: 'Q4',
        timeUsed: 70,
        timeLimit: 60,
        efficiency: 85.7
      },
      {
        question: 'Q5',
        timeUsed: 135,
        timeLimit: 120,
        efficiency: 88.9
      },
      {
        question: 'Q6',
        timeUsed: 140,
        timeLimit: 120,
        efficiency: 85.7
      }
    ],
    skillRadar: [
      {
        skill: 'JavaScript',
        score: 90,
        fullMark: 100
      },
      {
        skill: 'React',
        score: 88,
        fullMark: 100
      },
      {
        skill: 'Problem Solving',
        score: 87,
        fullMark: 100
      },
      {
        skill: 'Architecture',
        score: 85,
        fullMark: 100
      },
      {
        skill: 'Code Quality',
        score: 82,
        fullMark: 100
      },
      {
        skill: 'Communication',
        score: 85,
        fullMark: 100
      }
    ],
    benchmarkComparison: [
      {
        metric: 'Overall Score',
        candidate: 85,
        average: 72,
        top10: 88
      },
      {
        metric: 'JavaScript',
        candidate: 90,
        average: 75,
        top10: 92
      },
      {
        metric: 'React',
        candidate: 88,
        average: 70,
        top10: 90
      },
      {
        metric: 'Problem Solving',
        candidate: 87,
        average: 68,
        top10: 85
      },
      {
        metric: 'Time Efficiency',
        candidate: 71,
        average: 78,
        top10: 85
      }
    ]
  };

  const displayData = Object.keys(performanceData)?.length > 0 ? performanceData : mockPerformanceData;

  const COLORS = ['#2563EB', '#059669', '#D97706', '#DC2626', '#7C3AED', '#0EA5E9'];

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return '#059669';
      case 'Medium': return '#D97706';
      case 'Hard': return '#DC2626';
      default: return '#64748B';
    }
  };

  const getScoreColor = (score, maxScore) => {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 90) return '#059669';
    if (percentage >= 80) return '#0EA5E9';
    if (percentage >= 70) return '#D97706';
    return '#DC2626';
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="bg-card border border-border rounded-lg shadow-lg p-3">
          <p className="font-medium text-foreground">{label}</p>
          {payload?.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry?.color }}>
              {entry?.name}: {entry?.value}
              {entry?.name?.includes('Score') && entry?.payload?.maxScore && ` / ${entry?.payload?.maxScore}`}
              {entry?.name?.includes('Time') && 's'}
              {entry?.name?.includes('Efficiency') && '%'}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Performance Analytics</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Detailed breakdown of interview performance and benchmarking
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={selectedMetric}
            onChange={(e) => setSelectedMetric(e?.target?.value)}
            className="px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="score">Score Analysis</option>
            <option value="time">Time Analysis</option>
            <option value="efficiency">Efficiency Analysis</option>
          </select>
          <Button
            variant="outline"
            iconName="Download"
            iconPosition="left"
            iconSize={16}
            onClick={onExportAnalytics}
          >
            Export Analytics
          </Button>
        </div>
      </div>
      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-success">85</div>
          <div className="text-sm text-muted-foreground">Overall Score</div>
          <div className="text-xs text-success mt-1">+13 above average</div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-primary">6/6</div>
          <div className="text-sm text-muted-foreground">Questions Completed</div>
          <div className="text-xs text-success mt-1">100% completion</div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-warning">71%</div>
          <div className="text-sm text-muted-foreground">Time Efficiency</div>
          <div className="text-xs text-error mt-1">-7% below average</div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-accent">85th</div>
          <div className="text-sm text-muted-foreground">Percentile</div>
          <div className="text-xs text-success mt-1">Top 15%</div>
        </div>
      </div>
      {/* Question-by-Question Breakdown */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-medium text-foreground mb-4 flex items-center">
          <Icon name="BarChart3" size={20} className="mr-2 text-primary" />
          Question Performance Breakdown
        </h3>
        
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={displayData?.questionBreakdown} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis 
                dataKey="question" 
                stroke="#64748B"
                fontSize={12}
              />
              <YAxis stroke="#64748B" fontSize={12} />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="score" 
                fill="#2563EB"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Question Details Table */}
        <div className="mt-6 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-4 py-2 text-left font-medium text-foreground">Question</th>
                <th className="px-4 py-2 text-left font-medium text-foreground">Difficulty</th>
                <th className="px-4 py-2 text-left font-medium text-foreground">Score</th>
                <th className="px-4 py-2 text-left font-medium text-foreground">Time Used</th>
                <th className="px-4 py-2 text-left font-medium text-foreground">Category</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {displayData?.questionBreakdown?.map((question, index) => (
                <tr key={index} className="hover:bg-muted/30">
                  <td className="px-4 py-2 font-medium text-foreground">{question?.question}</td>
                  <td className="px-4 py-2">
                    <span 
                      className="px-2 py-1 rounded-full text-xs font-medium text-white"
                      style={{ backgroundColor: getDifficultyColor(question?.difficulty) }}
                    >
                      {question?.difficulty}
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    <span 
                      className="font-medium"
                      style={{ color: getScoreColor(question?.score, question?.maxScore) }}
                    >
                      {question?.score}/{question?.maxScore}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-muted-foreground">
                    {question?.timeUsed}s / {question?.timeLimit}s
                  </td>
                  <td className="px-4 py-2 text-muted-foreground">{question?.category}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* Difficulty Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-medium text-foreground mb-4 flex items-center">
            <Icon name="TrendingUp" size={20} className="mr-2 text-primary" />
            Performance by Difficulty
          </h3>
          
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={displayData?.difficultyAnalysis}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="difficulty" stroke="#64748B" fontSize={12} />
                <YAxis stroke="#64748B" fontSize={12} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="averageScore" fill="#2563EB" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 space-y-3">
            {displayData?.difficultyAnalysis?.map((level, index) => (
              <div key={index} className="bg-muted/30 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-foreground">{level?.difficulty}</span>
                  <span className="text-sm text-muted-foreground">
                    {level?.averageScore?.toFixed(1)}% avg
                  </span>
                </div>
                <div className="text-xs text-muted-foreground">
                  <span className="text-success">Strengths:</span> {level?.strengths?.join(', ')}
                </div>
                <div className="text-xs text-muted-foreground">
                  <span className="text-warning">Areas to improve:</span> {level?.weaknesses?.join(', ')}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-medium text-foreground mb-4 flex items-center">
            <Icon name="PieChart" size={20} className="mr-2 text-primary" />
            Category Distribution
          </h3>
          
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={displayData?.categoryAnalysis}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="score"
                  label={({ category, score }) => `${category}: ${score?.toFixed(0)}%`}
                >
                  {displayData?.categoryAnalysis?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS?.[index % COLORS?.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 space-y-2">
            {displayData?.categoryAnalysis?.map((category, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: COLORS?.[index % COLORS?.length] }}
                  />
                  <span className="text-sm text-foreground">{category?.category}</span>
                </div>
                <span className="text-sm font-medium text-muted-foreground">
                  {category?.score?.toFixed(1)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Time Analysis */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-medium text-foreground mb-4 flex items-center">
          <Icon name="Clock" size={20} className="mr-2 text-primary" />
          Time Management Analysis
        </h3>
        
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={displayData?.timeAnalysis}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="question" stroke="#64748B" fontSize={12} />
              <YAxis stroke="#64748B" fontSize={12} />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="timeUsed" 
                stroke="#2563EB" 
                strokeWidth={2}
                dot={{ fill: '#2563EB', strokeWidth: 2, r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="timeLimit" 
                stroke="#DC2626" 
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ fill: '#DC2626', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4 flex items-center justify-center space-x-6 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-primary rounded-full" />
            <span className="text-muted-foreground">Time Used</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-0.5 bg-error" />
            <span className="text-muted-foreground">Time Limit</span>
          </div>
        </div>
      </div>
      {/* Skills Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-medium text-foreground mb-4 flex items-center">
            <Icon name="Radar" size={20} className="mr-2 text-primary" />
            Skills Assessment Radar
          </h3>
          
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={displayData?.skillRadar}>
                <PolarGrid stroke="#E2E8F0" />
                <PolarAngleAxis dataKey="skill" tick={{ fontSize: 12, fill: '#64748B' }} />
                <PolarRadiusAxis 
                  angle={90} 
                  domain={[0, 100]} 
                  tick={{ fontSize: 10, fill: '#64748B' }}
                />
                <Radar
                  name="Score"
                  dataKey="score"
                  stroke="#2563EB"
                  fill="#2563EB"
                  fillOpacity={0.1}
                  strokeWidth={2}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-medium text-foreground mb-4 flex items-center">
            <Icon name="Users" size={20} className="mr-2 text-primary" />
            Benchmark Comparison
          </h3>
          
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={displayData?.benchmarkComparison} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis type="number" stroke="#64748B" fontSize={12} />
                <YAxis dataKey="metric" type="category" stroke="#64748B" fontSize={12} width={100} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="candidate" fill="#2563EB" name="Candidate" />
                <Bar dataKey="average" fill="#64748B" name="Average" />
                <Bar dataKey="top10" fill="#059669" name="Top 10%" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 flex items-center justify-center space-x-6 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-primary rounded-full" />
              <span className="text-muted-foreground">Candidate</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-muted-foreground rounded-full" />
              <span className="text-muted-foreground">Average</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-success rounded-full" />
              <span className="text-muted-foreground">Top 10%</span>
            </div>
          </div>
        </div>
      </div>
      {/* Performance Insights */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-medium text-foreground mb-4 flex items-center">
          <Icon name="Lightbulb" size={20} className="mr-2 text-accent" />
          Performance Insights
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-success mb-3">Key Strengths</h4>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Icon name="CheckCircle" size={16} className="text-success" />
                <span className="text-sm text-muted-foreground">
                  Excellent JavaScript fundamentals (87.5% average)
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name="CheckCircle" size={16} className="text-success" />
                <span className="text-sm text-muted-foreground">
                  Strong React knowledge and best practices
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name="CheckCircle" size={16} className="text-success" />
                <span className="text-sm text-muted-foreground">
                  Comprehensive approach to complex problems
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name="CheckCircle" size={16} className="text-success" />
                <span className="text-sm text-muted-foreground">
                  Above-average performance across all categories
                </span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-medium text-warning mb-3">Areas for Improvement</h4>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Icon name="AlertCircle" size={16} className="text-warning" />
                <span className="text-sm text-muted-foreground">
                  Time management on easy questions (62.5% efficiency)
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name="AlertCircle" size={16} className="text-warning" />
                <span className="text-sm text-muted-foreground">
                  Could be more concise in explanations
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name="AlertCircle" size={16} className="text-warning" />
                <span className="text-sm text-muted-foreground">
                  Testing methodology knowledge needs development
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name="AlertCircle" size={16} className="text-warning" />
                <span className="text-sm text-muted-foreground">
                  Performance optimization specifics could be deeper
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceAnalyticsTab;