import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';

const CandidateSearchFilters = ({ 
  onSearch = () => {},
  onFilter = () => {},
  onReset = () => {},
  className = ''
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [scoreRange, setScoreRange] = useState('all');
  const [status, setStatus] = useState('all');
  const [dateRange, setDateRange] = useState('all');
  const [position, setPosition] = useState('all');
  const [isExpanded, setIsExpanded] = useState(false);

  const scoreRangeOptions = [
    { value: 'all', label: 'All Scores' },
    { value: '90-100', label: 'Excellent (90-100)' },
    { value: '80-89', label: 'Good (80-89)' },
    { value: '70-79', label: 'Average (70-79)' },
    { value: '60-69', label: 'Below Average (60-69)' },
    { value: '0-59', label: 'Poor (0-59)' }
  ];

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'completed', label: 'Completed' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'scheduled', label: 'Scheduled' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  const dateRangeOptions = [
    { value: 'all', label: 'All Dates' },
    { value: 'today', label: 'Today' },
    { value: 'yesterday', label: 'Yesterday' },
    { value: 'this-week', label: 'This Week' },
    { value: 'last-week', label: 'Last Week' },
    { value: 'this-month', label: 'This Month' },
    { value: 'last-month', label: 'Last Month' }
  ];

  const positionOptions = [
    { value: 'all', label: 'All Positions' },
    { value: 'full-stack', label: 'Full Stack Developer' },
    { value: 'frontend', label: 'Frontend Developer' },
    { value: 'backend', label: 'Backend Developer' },
    { value: 'devops', label: 'DevOps Engineer' },
    { value: 'ui-ux', label: 'UI/UX Designer' }
  ];

  const handleSearch = (value) => {
    setSearchTerm(value);
    onSearch(value);
  };

  const handleFilterChange = (filterType, value) => {
    const filters = { scoreRange, status, dateRange, position };
    filters[filterType] = value;
    
    switch (filterType) {
      case 'scoreRange':
        setScoreRange(value);
        break;
      case 'status':
        setStatus(value);
        break;
      case 'dateRange':
        setDateRange(value);
        break;
      case 'position':
        setPosition(value);
        break;
    }
    
    onFilter(filters);
  };

  const handleReset = () => {
    setSearchTerm('');
    setScoreRange('all');
    setStatus('all');
    setDateRange('all');
    setPosition('all');
    onReset();
  };

  const hasActiveFilters = scoreRange !== 'all' || status !== 'all' || dateRange !== 'all' || position !== 'all' || searchTerm !== '';

  return (
    <div className={`bg-card border border-border rounded-lg shadow-card ${className}`}>
      <div className="p-6">
        {/* Search Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4 mb-4">
          <div className="flex-1 max-w-md">
            <Input
              type="search"
              placeholder="Search candidates by name, email, or position..."
              value={searchTerm}
              onChange={(e) => handleSearch(e?.target?.value)}
              className="w-full"
            />
          </div>
          
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              size="sm"
              iconName={isExpanded ? 'ChevronUp' : 'ChevronDown'}
              iconPosition="left"
              iconSize={16}
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? 'Hide Filters' : 'Show Filters'}
            </Button>
            
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                iconName="X"
                iconPosition="left"
                iconSize={16}
                onClick={handleReset}
                className="text-muted-foreground hover:text-foreground"
              >
                Clear All
              </Button>
            )}
          </div>
        </div>

        {/* Advanced Filters */}
        {isExpanded && (
          <div className="border-t border-border pt-4 animate-slide-in">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Select
                label="Score Range"
                options={scoreRangeOptions}
                value={scoreRange}
                onChange={(value) => handleFilterChange('scoreRange', value)}
                className="w-full"
              />
              
              <Select
                label="Interview Status"
                options={statusOptions}
                value={status}
                onChange={(value) => handleFilterChange('status', value)}
                className="w-full"
              />
              
              <Select
                label="Date Range"
                options={dateRangeOptions}
                value={dateRange}
                onChange={(value) => handleFilterChange('dateRange', value)}
                className="w-full"
              />
              
              <Select
                label="Position"
                options={positionOptions}
                value={position}
                onChange={(value) => handleFilterChange('position', value)}
                className="w-full"
              />
            </div>

            {/* Quick Filter Buttons */}
            <div className="mt-4 pt-4 border-t border-border">
              <div className="flex items-center space-x-2 mb-2">
                <Icon name="Zap" size={16} className="text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">Quick Filters:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleFilterChange('scoreRange', '90-100')}
                  className={scoreRange === '90-100' ? 'bg-success/10 border-success text-success' : ''}
                >
                  Top Performers
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleFilterChange('status', 'completed')}
                  className={status === 'completed' ? 'bg-accent/10 border-accent text-accent' : ''}
                >
                  Completed Today
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleFilterChange('dateRange', 'this-week')}
                  className={dateRange === 'this-week' ? 'bg-primary/10 border-primary text-primary' : ''}
                >
                  This Week
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleFilterChange('status', 'in-progress')}
                  className={status === 'in-progress' ? 'bg-warning/10 border-warning text-warning' : ''}
                >
                  In Progress
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Active Filters Summary */}
        {hasActiveFilters && (
          <div className="mt-4 pt-4 border-t border-border">
            <div className="flex items-center space-x-2 mb-2">
              <Icon name="Filter" size={16} className="text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">Active Filters:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {searchTerm && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                  Search: "{searchTerm}"
                  <button
                    onClick={() => handleSearch('')}
                    className="ml-2 hover:text-primary/80"
                  >
                    <Icon name="X" size={12} />
                  </button>
                </span>
              )}
              {scoreRange !== 'all' && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-success/10 text-success">
                  Score: {scoreRangeOptions?.find(opt => opt?.value === scoreRange)?.label}
                  <button
                    onClick={() => handleFilterChange('scoreRange', 'all')}
                    className="ml-2 hover:text-success/80"
                  >
                    <Icon name="X" size={12} />
                  </button>
                </span>
              )}
              {status !== 'all' && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-accent/10 text-accent">
                  Status: {statusOptions?.find(opt => opt?.value === status)?.label}
                  <button
                    onClick={() => handleFilterChange('status', 'all')}
                    className="ml-2 hover:text-accent/80"
                  >
                    <Icon name="X" size={12} />
                  </button>
                </span>
              )}
              {dateRange !== 'all' && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-warning/10 text-warning">
                  Date: {dateRangeOptions?.find(opt => opt?.value === dateRange)?.label}
                  <button
                    onClick={() => handleFilterChange('dateRange', 'all')}
                    className="ml-2 hover:text-warning/80"
                  >
                    <Icon name="X" size={12} />
                  </button>
                </span>
              )}
              {position !== 'all' && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-secondary/10 text-secondary">
                  Position: {positionOptions?.find(opt => opt?.value === position)?.label}
                  <button
                    onClick={() => handleFilterChange('position', 'all')}
                    className="ml-2 hover:text-secondary/80"
                  >
                    <Icon name="X" size={12} />
                  </button>
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CandidateSearchFilters;