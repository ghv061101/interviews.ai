import React from 'react';
import { Check, X } from 'lucide-react';
import { cn } from '../../../utils/cn';

const PasswordStrengthMeter = ({ password, strength }) => {
  const requirements = [
    { id: 'length', label: 'At least 8 characters', test: (pwd) => pwd?.length >= 8 },
    { id: 'uppercase', label: 'One uppercase letter', test: (pwd) => /[A-Z]/?.test(pwd) },
    { id: 'lowercase', label: 'One lowercase letter', test: (pwd) => /[a-z]/?.test(pwd) },
    { id: 'number', label: 'One number', test: (pwd) => /\d/?.test(pwd) },
    { id: 'special', label: 'One special character', test: (pwd) => /[!@#$%^&*(),.?":{}|<>]/?.test(pwd) }
  ];

  if (!password) return null;

  const getStrengthColor = (score) => {
    if (score < 2) return 'bg-red-500';
    if (score < 4) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getStrengthText = (score) => {
    if (score < 2) return 'Weak';
    if (score < 4) return 'Medium';
    return 'Strong';
  };

  return (
    <div className="space-y-3">
      {/* Strength Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-600">Password strength:</span>
          <span className={cn(
            "text-xs font-medium",
            strength?.score < 2 ? "text-red-600" :
            strength?.score < 4 ? "text-yellow-600" : "text-green-600"
          )}>
            {getStrengthText(strength?.score)}
          </span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={cn(
              "h-2 rounded-full transition-all duration-300",
              getStrengthColor(strength?.score)
            )}
            style={{ width: `${(strength?.score / 5) * 100}%` }}
          />
        </div>
      </div>
      {/* Requirements Checklist */}
      <div className="space-y-2">
        <p className="text-xs text-gray-600">Password must contain:</p>
        <div className="grid grid-cols-1 gap-1">
          {requirements?.map(({ id, label, test }) => {
            const isMet = test(password);
            return (
              <div key={id} className="flex items-center space-x-2">
                <div className={cn(
                  "flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center",
                  isMet ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-400"
                )}>
                  {isMet ? (
                    <Check className="w-3 h-3" />
                  ) : (
                    <X className="w-3 h-3" />
                  )}
                </div>
                <span className={cn(
                  "text-xs",
                  isMet ? "text-green-600" : "text-gray-500"
                )}>
                  {label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PasswordStrengthMeter;