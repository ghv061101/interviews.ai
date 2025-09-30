import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, Check } from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import RoleSelector from '../login-screen/components/RoleSelector';
import PasswordField from '../login-screen/components/PasswordField';
import { cn } from '../../utils/cn';

// Local storage keys
const STORAGE_KEYS = {
  USERS: 'interview_app_users'
};

const SignupScreen = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    role: 'candidate',
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    linkedIn: '',
    company: '',
    department: '',
    acceptTerms: false
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    feedback: []
  });

  const validatePassword = (password) => {
    const strength = {
      score: 0,
      feedback: []
    };

    if (password?.length >= 8) {
      strength.score += 1;
    } else {
      strength?.feedback?.push('At least 8 characters');
    }

    if (/[A-Z]/?.test(password)) {
      strength.score += 1;
    } else {
      strength?.feedback?.push('One uppercase letter');
    }

    if (/[a-z]/?.test(password)) {
      strength.score += 1;
    } else {
      strength?.feedback?.push('One lowercase letter');
    }

    if (/\d/?.test(password)) {
      strength.score += 1;
    } else {
      strength?.feedback?.push('One number');
    }

    if (/[!@#$%^&*(),.?":{}|<>]/?.test(password)) {
      strength.score += 1;
    } else {
      strength?.feedback?.push('One special character');
    }

    return strength;
  };

  const validateForm = () => {
    const newErrors = {};

    // Full name validation
    if (!formData?.fullName?.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (formData?.fullName?.trim()?.length < 2) {
      newErrors.fullName = 'Full name must be at least 2 characters';
    }

    // Email validation
    if (!formData?.email?.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/?.test(formData?.email)) {
      newErrors.email = 'Please enter a valid email address';
    } else {
      // Check if email already exists
      const existingUsers = JSON.parse(localStorage.getItem(STORAGE_KEYS?.USERS) || '[]');
      if (existingUsers?.find(user => user?.email === formData?.email)) {
        newErrors.email = 'An account with this email already exists';
      }
    }

    // Password validation
    if (!formData?.password) {
      newErrors.password = 'Password is required';
    } else if (passwordStrength?.score < 3) {
      newErrors.password = 'Password is too weak. Please strengthen it.';
    }

    // Confirm password validation
    if (!formData?.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData?.password !== formData?.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // Role-specific validation
    if (formData?.role === 'candidate') {
      if (!formData?.phone?.trim()) {
        newErrors.phone = 'Phone number is required for candidates';
      } else if (!/^\+?[\d\s-()]+$/?.test(formData?.phone)) {
        newErrors.phone = 'Please enter a valid phone number';
      }
    } else if (formData?.role === 'interviewer') {
      if (!formData?.company?.trim()) {
        newErrors.company = 'Company name is required for interviewers';
      }
      if (!formData?.department?.trim()) {
        newErrors.department = 'Department is required for interviewers';
      }
    }

    // Terms acceptance
    if (!formData?.acceptTerms) {
      newErrors.acceptTerms = 'You must accept the terms of service';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e?.target;
    const newValue = type === 'checkbox' ? checked : value;

    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));

    // Update password strength for password field
    if (name === 'password') {
      setPasswordStrength(validatePassword(value));
    }

    // Clear error when user starts typing
    if (errors?.[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Get existing users
      const existingUsers = JSON.parse(localStorage.getItem(STORAGE_KEYS?.USERS) || '[]');

      // Create new user object
      const newUser = {
        id: `user_${Date.now()}`,
        fullName: formData?.fullName?.trim(),
        email: formData?.email?.trim()?.toLowerCase(),
        password: formData?.password, // In real app, this would be hashed
        role: formData?.role,
        phone: formData?.phone?.trim() || null,
        linkedIn: formData?.linkedIn?.trim() || null,
        company: formData?.company?.trim() || null,
        department: formData?.department?.trim() || null,
        createdAt: new Date()?.toISOString(),
        isActive: true
      };

      // Add to users array
      const updatedUsers = [...existingUsers, newUser];
      localStorage.setItem(STORAGE_KEYS?.USERS, JSON.stringify(updatedUsers));

      // Show success message and redirect
      alert(`Account created successfully! Welcome ${newUser?.fullName}. You can now sign in.`);
      navigate('/login-screen');
      
    } catch (error) {
      console.error('Signup error:', error);
      setErrors({ general: 'An error occurred during signup. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const getPasswordStrengthColor = (score) => {
    if (score < 2) return 'bg-red-500';
    if (score < 4) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getPasswordStrengthText = (score) => {
    if (score < 2) return 'Weak';
    if (score < 4) return 'Medium';
    return 'Strong';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="bg-white rounded-lg shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <UserPlus className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Create Account</h1>
            <p className="text-gray-600">Join our interview platform today</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* General Error */}
            {errors?.general && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3">
                <p className="text-sm text-red-600">{errors?.general}</p>
              </div>
            )}

            {/* Role Selection */}
            <RoleSelector
              selectedRole={formData?.role}
              onChange={handleInputChange}
              error={errors?.role}
            />

            {/* Role Feature Highlights */}
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
              <h3 className="text-sm font-medium text-blue-800 mb-2">
                {formData?.role === 'candidate' ? 'As a Candidate, you can:' : 'As an Interviewer, you can:'}
              </h3>
              <ul className="text-sm text-blue-700 space-y-1">
                {formData?.role === 'candidate' ? (
                  <>
                    <li>• Upload and manage your resume</li>
                    <li>• Take AI-powered interviews</li>
                    <li>• Track your interview progress</li>
                    <li>• Receive detailed feedback</li>
                  </>
                ) : (
                  <>
                    <li>• Manage candidate interviews</li>
                    <li>• Access real-time monitoring dashboard</li>
                    <li>• Review AI-generated summaries</li>
                    <li>• Track interview analytics</li>
                  </>
                )}
              </ul>
            </div>

            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                type="text"
                name="fullName"
                label="Full Name"
                placeholder="Enter your full name"
                value={formData?.fullName}
                onChange={handleInputChange}
                error={errors?.fullName}
                required
              />

              <Input
                type="email"
                name="email"
                label="Email Address"
                placeholder="Enter your email"
                value={formData?.email}
                onChange={handleInputChange}
                error={errors?.email}
                required
              />
            </div>

            {/* Password Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <PasswordField
                  value={formData?.password}
                  onChange={handleInputChange}
                  error={errors?.password}
                  placeholder="Create a strong password"
                />
                
                {/* Password Strength Indicator */}
                {formData?.password && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-600">Password strength:</span>
                      <span className={cn(
                        "text-xs font-medium",
                        passwordStrength?.score < 2 ? "text-red-600" :
                        passwordStrength?.score < 4 ? "text-yellow-600" : "text-green-600"
                      )}>
                        {getPasswordStrengthText(passwordStrength?.score)}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={cn(
                          "h-2 rounded-full transition-all duration-300",
                          getPasswordStrengthColor(passwordStrength?.score)
                        )}
                        style={{ width: `${(passwordStrength?.score / 5) * 100}%` }}
                      />
                    </div>
                    {passwordStrength?.feedback?.length > 0 && (
                      <div className="text-xs text-gray-600">
                        Missing: {passwordStrength?.feedback?.join(', ')}
                      </div>
                    )}
                  </div>
                )}
              </div>

              <PasswordField
                value={formData?.confirmPassword}
                onChange={handleInputChange}
                error={errors?.confirmPassword}
                placeholder="Confirm your password"
                label="Confirm Password"
              />
            </div>

            {/* Role-specific Fields */}
            {formData?.role === 'candidate' && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Candidate Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    type="tel"
                    name="phone"
                    label="Phone Number"
                    placeholder="Your phone number"
                    value={formData?.phone}
                    onChange={handleInputChange}
                    error={errors?.phone}
                    required
                  />

                  <Input
                    type="url"
                    name="linkedIn"
                    label="LinkedIn Profile"
                    placeholder="https://linkedin.com/in/yourprofile (optional)"
                    value={formData?.linkedIn}
                    onChange={handleInputChange}
                    error={errors?.linkedIn}
                  />
                </div>
              </div>
            )}

            {formData?.role === 'interviewer' && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Interviewer Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    type="text"
                    name="company"
                    label="Company Name"
                    placeholder="Your company name"
                    value={formData?.company}
                    onChange={handleInputChange}
                    error={errors?.company}
                    required
                  />

                  <Input
                    type="text"
                    name="department"
                    label="Department"
                    placeholder="Your department"
                    value={formData?.department}
                    onChange={handleInputChange}
                    error={errors?.department}
                    required
                  />
                </div>
              </div>
            )}

            {/* Terms and Conditions */}
            <div className="space-y-4">
              <label className="flex items-start space-x-3">
                <Input
                  type="checkbox"
                  name="acceptTerms"
                  checked={formData?.acceptTerms}
                  onChange={handleInputChange}
                  className="mt-1"
                />
                <div className="text-sm">
                  <span className="text-gray-700">
                    I agree to the{' '}
                    <button
                      type="button"
                      onClick={() => setShowTermsModal(true)}
                      className="text-blue-600 hover:text-blue-800 underline"
                    >
                      Terms of Service
                    </button>
                    {' '}and{' '}
                    <button
                      type="button"
                      onClick={() => alert('Privacy Policy would be shown here')}
                      className="text-blue-600 hover:text-blue-800 underline"
                    >
                      Privacy Policy
                    </button>
                  </span>
                  <span className="text-red-500 ml-1">*</span>
                </div>
              </label>
              {errors?.acceptTerms && (
                <p className="text-sm text-red-600">{errors?.acceptTerms}</p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              loading={isLoading}
              disabled={isLoading}
              fullWidth
              className="h-12"
              iconName="UserPlus"
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link 
                to="/login-screen" 
                className="font-medium text-blue-600 hover:text-blue-800"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
      {/* Terms Modal */}
      {showTermsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Terms of Service</h2>
            </div>
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <div className="prose prose-sm max-w-none">
                <h3>1. Account Creation</h3>
                <p>By creating an account, you agree to provide accurate information and maintain the security of your account.</p>
                
                <h3>2. User Responsibilities</h3>
                <p>Users are responsible for their conduct on the platform and must not engage in any harmful or illegal activities.</p>
                
                <h3>3. Data Usage</h3>
                <p>We collect and use your data in accordance with our Privacy Policy to provide and improve our services.</p>
                
                <h3>4. Interview Platform</h3>
                <p>Our platform is designed to facilitate interviews between candidates and interviewers. All users must conduct themselves professionally.</p>
                
                <h3>5. Termination</h3>
                <p>We reserve the right to terminate accounts that violate these terms or engage in inappropriate behavior.</p>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowTermsModal(false)}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SignupScreen;