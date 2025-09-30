import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import Input from '../../../components/ui/Input';

const PasswordField = ({ value, onChange, error, placeholder = "Enter your password", label = "Password" }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700">
        {label} <span className="text-red-500">*</span>
      </label>
      
      <div className="relative">
        <Input
          type={showPassword ? 'text' : 'password'}
          name="password"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={`pr-10 ${error ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
        />
        
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700 focus:outline-none"
          tabIndex={-1}
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
      
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default PasswordField;