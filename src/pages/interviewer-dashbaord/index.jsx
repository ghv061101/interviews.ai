import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import interviewService from '../../services/interviewService';
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


  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true);
      
      try {
        // Load completed interviews
        const completedInterviews = interviewService.getCompletedInterviews();
        
        // Transform interview data to candidate format
        const candidateData = completedInterviews.map((interview, index) => {
          const totalScore = interview.evaluations?.reduce((sum, eval) => sum + (eval.score || 0), 0) || 0;
          const maxTotalScore = interview.evaluations?.reduce((sum, eval) => sum + (eval.maxScore || 0), 0) || 100;
          const finalScore = maxTotalScore > 0 ? Math.round((totalScore / maxTotalScore) * 100) : 0;
          
          const start = new Date(interview.startTime);
          const end = new Date(interview.endTime);
          const durationMs = end - start;
          const minutes = Math.floor(durationMs / 60000);
          const duration = `${minutes} min`;
          
          return {
            id: interview.id,
            name: interview.candidateData?.fullName || 'Unknown Candidate',
            email: interview.candidateData?.email || '',
            position: interview.candidateData?.position || 'Full Stack Developer',
            status: interview.status,
            score: finalScore,
            interviewDate: new Date(interview.startTime).toISOString().split('T')[0],
            duration,
            experience: `${interview.candidateData?.experience || 3} years`,
            skills: interview.candidateData?.skills || [],
            avatar: null,
            completedAt: interview.endTime,
            interviewSession: interview // Store full session for detailed view
          };
        });
        
        // Add current session if exists
        const currentSession = interviewService.loadInterviewSession();
        if (currentSession && currentSession.status === 'in-progress') {
          candidateData.push({
            id: currentSession.id,
            name: currentSession.candidateData?.fullName || 'Current Candidate',
            email: currentSession.candidateData?.email || '',
            position: currentSession.candidateData?.position || 'Full Stack Developer',
            status: 'in-progress',
            score: null,
            interviewDate: new Date(currentSession.startTime).toISOString().split('T')[0],
            duration: null,
            experience: `${currentSession.candidateData?.experience || 3} years`,
            skills: currentSession.candidateData?.skills || [],
            avatar: null,
            interviewSession: currentSession
          });
        }
        
        setCandidates(candidateData);
        setFilteredCandidates(candidateData);
        
        // Calculate metrics
        const completed = candidateData.filter(c => c.status === 'completed');
        const totalScore = completed.reduce((sum, c) => sum + (c.score || 0), 0);
        const averageScore = completed.length > 0 ? Math.round(totalScore / completed.length) : 0;
        const completionRate = candidateData.length > 0 ? Math.round((completed.length / candidateData.length) * 100) : 0;
        const pending = candidateData.filter(c => c.status === 'in-progress' || c.status === 'scheduled').length;

        setDashboardMetrics({
          totalCandidates: candidateData.length,
          averageScore,
          completionRate,
          pendingInterviews: pending
        });
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
      
    loadDashboardData();
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
    // Navigate to candidate profile with interview session data
    navigate(`/candidate-profile/${candidate.id}`, { 
      state: { 
        candidate,
        interviewSession: candidate.interviewSession 
      } 
    });
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