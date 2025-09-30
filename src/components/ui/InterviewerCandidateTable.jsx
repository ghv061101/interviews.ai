import React, { useState, useMemo } from 'react';
import Icon from '../AppIcon';
import Button from './Button';
import Input from './Input';
import Select from './Select';
import { Checkbox } from './Checkbox';

const InterviewerCandidateTable = ({ 
  candidates = [],
  onCandidateSelect = () => {},
  onBulkAction = () => {},
  onSort = () => {},
  onFilter = () => {},
  loading = false,
  className = ''
}) => {
  const [selectedCandidates, setSelectedCandidates] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [scoreFilter, setScoreFilter] = useState('all');

  // Mock data if no candidates provided
  const mockCandidates = [
    {
      id: 1,
      name: 'Sarah Johnson',
      email: 'sarah.johnson@email.com',
      position: 'Senior Frontend Developer',
      status: 'completed',
      score: 85,
      interviewDate: '2025-09-28',
      duration: '45 min',
      experience: '5 years',
      skills: ['React', 'TypeScript', 'Node.js'],
      avatar: null
    },
    {
      id: 2,
      name: 'Michael Chen',
      email: 'michael.chen@email.com',
      position: 'Full Stack Developer',
      status: 'in-progress',
      score: null,
      interviewDate: '2025-09-29',
      duration: '30 min',
      experience: '3 years',
      skills: ['Vue.js', 'Python', 'PostgreSQL'],
      avatar: null
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
      avatar: null
    },
    {
      id: 4,
      name: 'David Kim',
      email: 'david.kim@email.com',
      position: 'DevOps Engineer',
      status: 'completed',
      score: 92,
      interviewDate: '2025-09-27',
      duration: '50 min',
      experience: '6 years',
      skills: ['AWS', 'Docker', 'Kubernetes'],
      avatar: null
    },
    {
      id: 5,
      name: 'Lisa Thompson',
      email: 'lisa.thompson@email.com',
      position: 'UI/UX Designer',
      status: 'cancelled',
      score: null,
      interviewDate: '2025-09-26',
      duration: null,
      experience: '4 years',
      skills: ['Figma', 'Adobe XD', 'Prototyping'],
      avatar: null
    }
  ];

  const displayCandidates = candidates?.length > 0 ? candidates : mockCandidates;

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'scheduled', label: 'Scheduled' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  const scoreOptions = [
    { value: 'all', label: 'All Scores' },
    { value: 'excellent', label: '90-100' },
    { value: 'good', label: '80-89' },
    { value: 'average', label: '70-79' },
    { value: 'below-average', label: 'Below 70' }
  ];

  // Filter and sort candidates
  const filteredAndSortedCandidates = useMemo(() => {
    let filtered = displayCandidates?.filter(candidate => {
      const matchesSearch = candidate?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
                           candidate?.email?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
                           candidate?.position?.toLowerCase()?.includes(searchTerm?.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || candidate?.status === statusFilter;
      
      const matchesScore = scoreFilter === 'all' || 
        (scoreFilter === 'excellent' && candidate?.score >= 90) ||
        (scoreFilter === 'good' && candidate?.score >= 80 && candidate?.score < 90) ||
        (scoreFilter === 'average' && candidate?.score >= 70 && candidate?.score < 80) ||
        (scoreFilter === 'below-average' && candidate?.score < 70);

      return matchesSearch && matchesStatus && matchesScore;
    });

    // Sort candidates
    filtered?.sort((a, b) => {
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

    return filtered;
  }, [displayCandidates, searchTerm, statusFilter, scoreFilter, sortConfig]);

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig?.key === key && sortConfig?.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
    onSort({ key, direction });
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedCandidates(filteredAndSortedCandidates?.map(c => c?.id));
    } else {
      setSelectedCandidates([]);
    }
  };

  const handleSelectCandidate = (candidateId, checked) => {
    if (checked) {
      setSelectedCandidates([...selectedCandidates, candidateId]);
    } else {
      setSelectedCandidates(selectedCandidates?.filter(id => id !== candidateId));
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      scheduled: { bg: 'bg-accent/10', text: 'text-accent', icon: 'Calendar' },
      'in-progress': { bg: 'bg-warning/10', text: 'text-warning', icon: 'Clock' },
      completed: { bg: 'bg-success/10', text: 'text-success', icon: 'CheckCircle' },
      cancelled: { bg: 'bg-error/10', text: 'text-error', icon: 'XCircle' }
    };

    const config = statusConfig?.[status] || statusConfig?.scheduled;

    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config?.bg} ${config?.text}`}>
        <Icon name={config?.icon} size={12} className="mr-1" />
        {status?.charAt(0)?.toUpperCase() + status?.slice(1)?.replace('-', ' ')}
      </span>
    );
  };

  const getScoreBadge = (score) => {
    if (score === null || score === undefined) {
      return <span className="text-muted-foreground text-sm">-</span>;
    }

    let colorClass = 'text-muted-foreground';
    if (score >= 90) colorClass = 'text-success';
    else if (score >= 80) colorClass = 'text-accent';
    else if (score >= 70) colorClass = 'text-warning';
    else colorClass = 'text-error';

    return (
      <span className={`font-mono font-medium ${colorClass}`}>
        {score}
      </span>
    );
  };

  return (
    <div className={`bg-card rounded-lg border border-border shadow-card ${className}`}>
      {/* Header with Search and Filters */}
      <div className="p-6 border-b border-border">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Candidates</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Manage and review candidate interviews
            </p>
          </div>

          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
            <Input
              type="search"
              placeholder="Search candidates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e?.target?.value)}
              className="sm:w-64"
            />
            
            <Select
              options={statusOptions}
              value={statusFilter}
              onChange={setStatusFilter}
              placeholder="Filter by status"
              className="sm:w-40"
            />
            
            <Select
              options={scoreOptions}
              value={scoreFilter}
              onChange={setScoreFilter}
              placeholder="Filter by score"
              className="sm:w-40"
            />
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedCandidates?.length > 0 && (
          <div className="mt-4 p-3 bg-accent/10 border border-accent/20 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-accent">
                {selectedCandidates?.length} candidate{selectedCandidates?.length > 1 ? 's' : ''} selected
              </span>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  iconName="Download"
                  iconPosition="left"
                  iconSize={14}
                  onClick={() => onBulkAction('export', selectedCandidates)}
                >
                  Export
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  iconName="Mail"
                  iconPosition="left"
                  iconSize={14}
                  onClick={() => onBulkAction('email', selectedCandidates)}
                >
                  Email
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="w-12 px-6 py-3 text-left">
                <Checkbox
                  checked={selectedCandidates?.length === filteredAndSortedCandidates?.length && filteredAndSortedCandidates?.length > 0}
                  onChange={(e) => handleSelectAll(e?.target?.checked)}
                />
              </th>
              <th className="px-6 py-3 text-left">
                <button
                  onClick={() => handleSort('name')}
                  className="flex items-center space-x-1 text-sm font-medium text-foreground hover:text-primary transition-colors"
                >
                  <span>Candidate</span>
                  <Icon 
                    name={sortConfig?.key === 'name' && sortConfig?.direction === 'desc' ? 'ChevronDown' : 'ChevronUp'} 
                    size={14} 
                  />
                </button>
              </th>
              <th className="px-6 py-3 text-left">
                <button
                  onClick={() => handleSort('position')}
                  className="flex items-center space-x-1 text-sm font-medium text-foreground hover:text-primary transition-colors"
                >
                  <span>Position</span>
                  <Icon 
                    name={sortConfig?.key === 'position' && sortConfig?.direction === 'desc' ? 'ChevronDown' : 'ChevronUp'} 
                    size={14} 
                  />
                </button>
              </th>
              <th className="px-6 py-3 text-left">
                <button
                  onClick={() => handleSort('status')}
                  className="flex items-center space-x-1 text-sm font-medium text-foreground hover:text-primary transition-colors"
                >
                  <span>Status</span>
                  <Icon 
                    name={sortConfig?.key === 'status' && sortConfig?.direction === 'desc' ? 'ChevronDown' : 'ChevronUp'} 
                    size={14} 
                  />
                </button>
              </th>
              <th className="px-6 py-3 text-left">
                <button
                  onClick={() => handleSort('score')}
                  className="flex items-center space-x-1 text-sm font-medium text-foreground hover:text-primary transition-colors"
                >
                  <span>Score</span>
                  <Icon 
                    name={sortConfig?.key === 'score' && sortConfig?.direction === 'desc' ? 'ChevronDown' : 'ChevronUp'} 
                    size={14} 
                  />
                </button>
              </th>
              <th className="px-6 py-3 text-left">
                <button
                  onClick={() => handleSort('interviewDate')}
                  className="flex items-center space-x-1 text-sm font-medium text-foreground hover:text-primary transition-colors"
                >
                  <span>Interview Date</span>
                  <Icon 
                    name={sortConfig?.key === 'interviewDate' && sortConfig?.direction === 'desc' ? 'ChevronDown' : 'ChevronUp'} 
                    size={14} 
                  />
                </button>
              </th>
              <th className="px-6 py-3 text-left">
                <span className="text-sm font-medium text-foreground">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {loading ? (
              <tr>
                <td colSpan="7" className="px-6 py-12 text-center">
                  <div className="flex items-center justify-center space-x-2">
                    <Icon name="Loader2" size={20} className="animate-spin text-muted-foreground" />
                    <span className="text-muted-foreground">Loading candidates...</span>
                  </div>
                </td>
              </tr>
            ) : filteredAndSortedCandidates?.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center space-y-2">
                    <Icon name="Users" size={48} className="text-muted-foreground" />
                    <span className="text-muted-foreground">No candidates found</span>
                    <p className="text-sm text-muted-foreground">Try adjusting your search or filters</p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredAndSortedCandidates?.map((candidate) => (
                <tr key={candidate?.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4">
                    <Checkbox
                      checked={selectedCandidates?.includes(candidate?.id)}
                      onChange={(e) => handleSelectCandidate(candidate?.id, e?.target?.checked)}
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-primary">
                          {candidate?.name?.split(' ')?.map(n => n?.[0])?.join('')}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium text-foreground">{candidate?.name}</div>
                        <div className="text-sm text-muted-foreground">{candidate?.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium text-foreground">{candidate?.position}</div>
                      <div className="text-sm text-muted-foreground">{candidate?.experience} experience</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(candidate?.status)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-lg">
                      {getScoreBadge(candidate?.score)}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm text-foreground">{candidate?.interviewDate}</div>
                      {candidate?.duration && (
                        <div className="text-sm text-muted-foreground">{candidate?.duration}</div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        iconName="Eye"
                        iconSize={14}
                        onClick={() => onCandidateSelect(candidate)}
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        iconName="Download"
                        iconSize={14}
                        onClick={() => console.log('Download report', candidate?.id)}
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        iconName="MoreHorizontal"
                        iconSize={14}
                        onClick={() => console.log('More actions', candidate?.id)}
                      />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {/* Footer with Pagination Info */}
      <div className="px-6 py-4 border-t border-border">
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {filteredAndSortedCandidates?.length} of {displayCandidates?.length} candidates
          </div>
          <div className="text-sm text-muted-foreground">
            {selectedCandidates?.length > 0 && `${selectedCandidates?.length} selected`}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewerCandidateTable;