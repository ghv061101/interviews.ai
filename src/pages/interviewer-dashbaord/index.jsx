import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import InterviewerCandidateTable from '../../components/ui/InterviewerCandidateTable';
import DashboardMetrics from './components/DashboardMetrics';
import ActiveInterviewMonitor from './components/ActiveInterviewMonitor';
import CandidateSearchFilters from './components/CandidateSearchFilters';
import Button from '../../components/ui/Button';


const InterviewerDashboard = () => {
  const navigate = useNavigate();
  const [candidates, setCandidates] = useState([]);
  const [filteredCandidates, setFilteredCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dashboardMetrics, setDashboardMetrics] = useState({
    totalCandidates: 0,
    averageScore: 0,
    completionRate: 0,
    pendingInterviews: 0
  });

  // Mock candidates data
  const mockCandidates = [
    {
      id: 1,
      name: 'Sarah Johnson',
      email: 'sarah.johnson@email.com',
      position: 'Senior Frontend Developer',
      status: 'completed',
      score: 92,
      interviewDate: '2025-09-29',
      duration: '45 min',
      experience: '5 years',
      skills: ['React', 'TypeScript', 'Node.js'],
      avatar: null,
      completedAt: '2025-09-29 12:30:00'
    },
    {
      id: 2,
      name: 'Michael Chen',
      email: 'michael.chen@email.com',
      position: 'Full Stack Developer',
      status: 'completed',
      score: 88,
      interviewDate: '2025-09-29',
      duration: '42 min',
      experience: '3 years',
      skills: ['Vue.js', 'Python', 'PostgreSQL'],
      avatar: null,
      completedAt: '2025-09-29 11:15:00'
    },
    {
      id: 3,
      name: 'Emily Rodriguez',
      email: 'emily.rodriguez@email.com',
      position: 'Backend Developer',
      status: 'scheduled',
      score: null,
      interviewDate: '2025-09-30',
      duration: null,
      experience: '4 years',
      skills: ['Java', 'Spring Boot', 'MongoDB'],
      avatar: null,
      scheduledAt: '2025-09-30 14:00:00'
    },
    {
      id: 4,
      name: 'David Kim',
      email: 'david.kim@email.com',
      position: 'DevOps Engineer',
      status: 'completed',
      score: 95,
      interviewDate: '2025-09-28',
      duration: '50 min',
      experience: '6 years',
      skills: ['AWS', 'Docker', 'Kubernetes'],
      avatar: null,
      completedAt: '2025-09-28 16:45:00'
    },
    {
      id: 5,
      name: 'Lisa Thompson',
      email: 'lisa.thompson@email.com',
      position: 'UI/UX Designer',
      status: 'cancelled',
      score: null,
      interviewDate: '2025-09-27',
      duration: null,
      experience: '4 years',
      skills: ['Figma', 'Adobe XD', 'Prototyping'],
      avatar: null,
      cancelledAt: '2025-09-27 10:00:00'
    },
    {
      id: 6,
      name: 'Robert Wilson',
      email: 'robert.wilson@email.com',
      position: 'Full Stack Developer',
      status: 'completed',
      score: 76,
      interviewDate: '2025-09-28',
      duration: '38 min',
      experience: '2 years',
      skills: ['React', 'Express.js', 'MySQL'],
      avatar: null,
      completedAt: '2025-09-28 14:20:00'
    },
    {
      id: 7,
      name: 'Jennifer Davis',
      email: 'jennifer.davis@email.com',
      position: 'Frontend Developer',
      status: 'completed',
      score: 84,
      interviewDate: '2025-09-29',
      duration: '41 min',
      experience: '3 years',
      skills: ['Angular', 'TypeScript', 'SCSS'],
      avatar: null,
      completedAt: '2025-09-29 09:45:00'
    },
    {
      id: 8,
      name: 'James Martinez',
      email: 'james.martinez@email.com',
      position: 'Backend Developer',
      status: 'scheduled',
      score: null,
      interviewDate: '2025-09-30',
      duration: null,
      experience: '5 years',
      skills: ['Python', 'Django', 'Redis'],
      avatar: null,
      scheduledAt: '2025-09-30 10:30:00'
    }
  ];

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setCandidates(mockCandidates);
      setFilteredCandidates(mockCandidates);
      
      // Calculate metrics
      const completed = mockCandidates?.filter(c => c?.status === 'completed');
      const totalScore = completed?.reduce((sum, c) => sum + (c?.score || 0), 0);
      const averageScore = completed?.length > 0 ? Math.round(totalScore / completed?.length) : 0;
      const completionRate = Math.round((completed?.length / mockCandidates?.length) * 100);
      const pending = mockCandidates?.filter(c => c?.status === 'scheduled')?.length;

      setDashboardMetrics({
        totalCandidates: mockCandidates?.length,
        averageScore,
        completionRate,
        pendingInterviews: pending
      });
      
      setLoading(false);
    }, 1000);
  }, []);

  const handleSearch = (searchTerm) => {
    if (!searchTerm?.trim()) {
      setFilteredCandidates(candidates);
      return;
    }

    let filtered = candidates?.filter(candidate =>
      candidate?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
      candidate?.email?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
      candidate?.position?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
      candidate?.skills?.some(skill => skill?.toLowerCase()?.includes(searchTerm?.toLowerCase()))
    );
    
    setFilteredCandidates(filtered);
  };

  const handleFilter = (filters) => {
    let filtered = [...candidates];

    // Apply score range filter
    if (filters?.scoreRange !== 'all') {
      const [min, max] = filters?.scoreRange?.split('-')?.map(Number);
      filtered = filtered?.filter(candidate => {
        if (candidate?.score === null) return false;
        return candidate?.score >= min && candidate?.score <= max;
      });
    }

    // Apply status filter
    if (filters?.status !== 'all') {
      filtered = filtered?.filter(candidate => candidate?.status === filters?.status);
    }

    // Apply date range filter
    if (filters?.dateRange !== 'all') {
      const today = new Date();
      const filterDate = new Date(today);
      
      switch (filters?.dateRange) {
        case 'today':
          filtered = filtered?.filter(candidate => 
            candidate?.interviewDate === today?.toISOString()?.split('T')?.[0]
          );
          break;
        case 'yesterday':
          filterDate?.setDate(today?.getDate() - 1);
          filtered = filtered?.filter(candidate => 
            candidate?.interviewDate === filterDate?.toISOString()?.split('T')?.[0]
          );
          break;
        case 'this-week':
          const weekStart = new Date(today);
          weekStart?.setDate(today?.getDate() - today?.getDay());
          filtered = filtered?.filter(candidate => 
            new Date(candidate.interviewDate) >= weekStart
          );
          break;
        // Add more date range cases as needed
      }
    }

    // Apply position filter
    if (filters?.position !== 'all') {
      const positionMap = {
        'full-stack': 'Full Stack Developer',
        'frontend': 'Frontend Developer',
        'backend': 'Backend Developer',
        'devops': 'DevOps Engineer',
        'ui-ux': 'UI/UX Designer'
      };
      
      filtered = filtered?.filter(candidate => 
        candidate?.position?.includes(positionMap?.[filters?.position])
      );
    }

    setFilteredCandidates(filtered);
  };

  const handleResetFilters = () => {
    setFilteredCandidates(candidates);
  };

  const handleCandidateSelect = (candidate) => {
    navigate('/candidate-profile', { state: { candidate } });
  };

  const handleBulkAction = (action, selectedIds) => {
    console.log(`Bulk action: ${action}`, selectedIds);
    // Implement bulk actions like export, email, etc.
  };

  const handleSort = (sortConfig) => {
    const sorted = [...filteredCandidates]?.sort((a, b) => {
      let aValue = a?.[sortConfig?.key];
      let bValue = b?.[sortConfig?.key];

      if (aValue === null || aValue === undefined) aValue = '';
      if (bValue === null || bValue === undefined) bValue = '';

      if (typeof aValue === 'string') {
        aValue = aValue?.toLowerCase();
        bValue = bValue?.toLowerCase();
      }

      if (aValue < bValue) {
        return sortConfig?.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig?.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });

    setFilteredCandidates(sorted);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Page Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Interviewer Dashboard</h1>
              <p className="text-muted-foreground">
                Monitor, evaluate, and manage candidate interviews with comprehensive analytics
              </p>
            </div>
            
            <div className="flex items-center space-x-3 mt-4 lg:mt-0">
              <Button
                variant="outline"
                iconName="Download"
                iconPosition="left"
                iconSize={16}
                onClick={() => console.log('Export all data')}
              >
                Export Data
              </Button>
              <Button
                variant="default"
                iconName="Plus"
                iconPosition="left"
                iconSize={16}
                onClick={() => navigate('/resume-upload')}
              >
                New Interview
              </Button>
            </div>
          </div>

          {/* Dashboard Metrics */}
          <DashboardMetrics
            totalCandidates={dashboardMetrics?.totalCandidates}
            averageScore={dashboardMetrics?.averageScore}
            completionRate={dashboardMetrics?.completionRate}
            pendingInterviews={dashboardMetrics?.pendingInterviews}
            className="mb-8"
          />

          {/* Active Interviews Monitor */}
          <ActiveInterviewMonitor className="mb-8" />

          {/* Search and Filters */}
          <CandidateSearchFilters
            onSearch={handleSearch}
            onFilter={handleFilter}
            onReset={handleResetFilters}
            className="mb-6"
          />

          {/* Candidates Table */}
          <InterviewerCandidateTable
            candidates={filteredCandidates}
            onCandidateSelect={handleCandidateSelect}
            onBulkAction={handleBulkAction}
            onSort={handleSort}
            loading={loading}
            className="mb-8"
          />

          {/* Quick Actions */}
          <div className="bg-card border border-border rounded-lg p-6 shadow-card">
            <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button
                variant="outline"
                iconName="FileText"
                iconPosition="left"
                iconSize={16}
                onClick={() => console.log('Generate report')}
                fullWidth
              >
                Generate Report
              </Button>
              <Button
                variant="outline"
                iconName="Mail"
                iconPosition="left"
                iconSize={16}
                onClick={() => console.log('Send bulk emails')}
                fullWidth
              >
                Send Bulk Emails
              </Button>
              <Button
                variant="outline"
                iconName="Settings"
                iconPosition="left"
                iconSize={16}
                onClick={() => console.log('Interview settings')}
                fullWidth
              >
                Interview Settings
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default InterviewerDashboard;