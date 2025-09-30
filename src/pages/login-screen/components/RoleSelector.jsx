import React from 'react';
import { UserCheck, Briefcase } from 'lucide-react';
import { cn } from '../../../utils/cn';
import Icon from '../../../components/AppIcon';


const RoleSelector = ({ selectedRole, onChange, error }) => {
  const roles = [
    {
      id: 'candidate',
      label: 'Candidate',
      icon: UserCheck,
      description: 'Looking for opportunities'
    },
    {
      id: 'interviewer',
      label: 'Interviewer',
      icon: Briefcase,
      description: 'Conducting interviews'
    }
  ];

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-gray-700">
        I am signing in as: <span className="text-red-500">*</span>
      </label>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {roles?.map(({ id, label, icon: Icon, description }) => (
          <label 
            key={id}
            className={cn(
              "flex items-start p-4 border rounded-lg cursor-pointer transition-all duration-200",
              "hover:shadow-md",
              selectedRole === id 
                ? "border-blue-500 bg-blue-50 shadow-sm" 
                : "border-gray-200 hover:border-gray-300"
            )}
          >
            <input
              type="radio"
              name="role"
              value={id}
              checked={selectedRole === id}
              onChange={onChange}
              className="sr-only"
            />
            
            <div className="flex items-start">
              {/* Radio Button */}
              <div className={cn(
                "w-4 h-4 rounded-full border-2 mr-3 mt-1 flex-shrink-0",
                selectedRole === id
                  ? "border-blue-500 bg-blue-500" :"border-gray-300"
              )}>
                {selectedRole === id && (
                  <div className="w-2 h-2 rounded-full bg-white mx-auto mt-0.5" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1">
                <div className="flex items-center mb-1">
                  <Icon className="w-4 h-4 mr-2 text-gray-600" />
                  <span className="text-sm font-medium text-gray-900">{label}</span>
                </div>
                <p className="text-xs text-gray-500">{description}</p>
              </div>
            </div>
          </label>
        ))}
      </div>
      {error && (
        <p className="text-sm text-red-600 mt-2">{error}</p>
      )}
    </div>
  );
};

export default RoleSelector;