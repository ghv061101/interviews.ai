import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Determine if current route is candidate or interviewer interface
  const isCandidateInterface = ['/resume-upload', '/interview-questions', '/interview-complete', '/welcome-back-modal']?.includes(location?.pathname);
  const isInterviewerInterface = ['/interviewer-dashboard', '/candidate-profile']?.includes(location?.pathname);

  const candidateNavItems = [
    { path: '/resume-upload', label: 'Upload Resume', icon: 'Upload' },
    { path: '/interview-questions', label: 'Interview', icon: 'MessageSquare' },
    { path: '/interview-complete', label: 'Complete', icon: 'CheckCircle' },
  ];

  const interviewerNavItems = [
    { path: '/interviewer-dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
    { path: '/candidate-profile', label: 'Candidates', icon: 'Users' },
  ];

  const secondaryItems = [
    { label: 'Settings', icon: 'Settings', action: () => console.log('Settings') },
    { label: 'Help', icon: 'HelpCircle', action: () => console.log('Help') },
    { label: 'Admin', icon: 'Shield', action: () => console.log('Admin') },
  ];

  const handleNavigation = (path) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const currentNavItems = isCandidateInterface ? candidateNavItems : interviewerNavItems;

  return (
    <header className="fixed top-0 left-0 right-0 z-navigation bg-card border-b border-border shadow-card">
      <div className="flex items-center justify-between h-16 px-6">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-lg">
            <Icon name="Brain" size={20} color="white" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-semibold text-foreground">AI Interview</span>
            <span className="text-xs text-muted-foreground -mt-1">Assistant</span>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          {currentNavItems?.map((item) => (
            <Button
              key={item?.path}
              variant={location?.pathname === item?.path ? 'default' : 'ghost'}
              size="sm"
              iconName={item?.icon}
              iconPosition="left"
              iconSize={16}
              onClick={() => handleNavigation(item?.path)}
              className="transition-micro"
            >
              {item?.label}
            </Button>
          ))}

          {/* More Menu */}
          <div className="relative ml-4">
            <Button
              variant="ghost"
              size="sm"
              iconName="MoreHorizontal"
              iconSize={16}
              onClick={toggleMenu}
              className="transition-micro"
            >
              More
            </Button>

            {isMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-popover border border-border rounded-lg shadow-interactive z-dropdown animate-slide-in">
                <div className="py-2">
                  {secondaryItems?.map((item, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        item?.action();
                        setIsMenuOpen(false);
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-popover-foreground hover:bg-muted transition-micro"
                    >
                      <Icon name={item?.icon} size={16} className="mr-3" />
                      {item?.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </nav>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="sm"
          iconName={isMenuOpen ? 'X' : 'Menu'}
          iconSize={20}
          onClick={toggleMenu}
          className="md:hidden transition-micro"
        />
      </div>
      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-card border-t border-border animate-slide-in">
          <nav className="px-6 py-4 space-y-2">
            {currentNavItems?.map((item) => (
              <button
                key={item?.path}
                onClick={() => handleNavigation(item?.path)}
                className={`flex items-center w-full px-3 py-2 text-sm rounded-md transition-micro ${
                  location?.pathname === item?.path
                    ? 'bg-primary text-primary-foreground'
                    : 'text-foreground hover:bg-muted'
                }`}
              >
                <Icon name={item?.icon} size={16} className="mr-3" />
                {item?.label}
              </button>
            ))}

            <div className="border-t border-border pt-2 mt-4">
              {secondaryItems?.map((item, index) => (
                <button
                  key={index}
                  onClick={() => {
                    item?.action();
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center w-full px-3 py-2 text-sm text-foreground hover:bg-muted rounded-md transition-micro"
                >
                  <Icon name={item?.icon} size={16} className="mr-3" />
                  {item?.label}
                </button>
              ))}
            </div>
          </nav>
        </div>
      )}
      {/* Overlay for mobile menu */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-20 z-[-1] md:hidden"
          onClick={() => setIsMenuOpen(false)}
        />
      )}
    </header>
  );
};

export default Header;