import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { cn } from '../../utils/cn';

// Local storage keys
const STORAGE_KEYS = {
  USERS: 'interview_app_users',
  CURRENT_USER: 'interview_app_current_user',
  REMEMBER_ME: 'interview_app_remember_me'
};

const LoginScreen = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'candidate',
    rememberMe: false
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [attemptCount, setAttemptCount] = useState(0);

  // Load remembered email on component mount
  useEffect(() => {
    const rememberedData = localStorage.getItem(STORAGE_KEYS?.REMEMBER_ME);
    if (rememberedData) {
      try {
        const parsed = JSON.parse(rememberedData);
        setFormData(prev => ({
          ...prev,
          email: parsed?.email || '',
          role: parsed?.role || 'candidate',
          rememberMe: true
        }));
      } catch (error) {
        console.error('Error parsing remembered data:', error);
      }
    }
  }, []);

  // Check if user is already logged in
  useEffect(() => {
    const currentUser = localStorage.getItem(STORAGE_KEYS?.CURRENT_USER);
    if (currentUser) {
      try {
        const user = JSON.parse(currentUser);
        // Check token expiration (simulate 24 hours)
        const loginTime = new Date(user?.loginTime || 0);
        const now = new Date();
        const hoursDiff = (now - loginTime) / (1000 * 60 * 60);
        
        if (hoursDiff < 24) {
          // User session is still valid, redirect based on role
          if (user?.role === 'interviewer') {
            navigate('/interviewer-dashboard');
          } else {
            navigate('/resume-upload');
          }
          return;
        } else {
          // Session expired, clear storage
          localStorage.removeItem(STORAGE_KEYS?.CURRENT_USER);
        }
      } catch (error) {
        console.error('Error checking current user:', error);
        localStorage.removeItem(STORAGE_KEYS?.CURRENT_USER);
      }
    }
  }, [navigate]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData?.email?.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/?.test(formData?.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData?.password?.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData?.password?.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData?.role) {
      newErrors.role = 'Please select a role';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e?.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear error when user starts typing
    if (errors?.[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const authenticateUser = (email, password, role) => {
    const users = JSON.parse(localStorage.getItem(STORAGE_KEYS?.USERS) || '[]');
    return users?.find(user => 
      user?.email === email && 
      user?.password === password && 
      user?.role === role
    );
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    // Prevent brute force attacks
    if (attemptCount >= 5) {
      setErrors({ general: 'Too many failed attempts. Please try again later.' });
      return;
    }

    if (!validateForm()) return;

    setIsLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      const user = authenticateUser(formData?.email, formData?.password, formData?.role);
      
      if (user) {
        // Store current user session
        const sessionData = {
          ...user,
          loginTime: new Date()?.toISOString(),
          sessionId: `SES-${Date.now()}`
        };
        
        localStorage.setItem(STORAGE_KEYS?.CURRENT_USER, JSON.stringify(sessionData));

        // Handle remember me
        if (formData?.rememberMe) {
          localStorage.setItem(STORAGE_KEYS?.REMEMBER_ME, JSON.stringify({
            email: formData?.email,
            role: formData?.role
          }));
        } else {
          localStorage.removeItem(STORAGE_KEYS?.REMEMBER_ME);
        }

        // Reset attempt count on successful login
        setAttemptCount(0);

        // Role-based navigation
        if (formData?.role === 'interviewer') {
          navigate('/interviewer-dashboard');
        } else {
          navigate('/resume-upload');
        }
      } else {
        setAttemptCount(prev => prev + 1);
        setErrors({ 
          general: 'Invalid email, password, or role. Please check your credentials.' 
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrors({ general: 'An error occurred during login. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = formData?.email?.trim() && 
                     formData?.password?.trim() && 
                     formData?.role && 
                     Object.keys(errors)?.length === 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <LogIn className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Sign In</h1>
            <p className="text-gray-600">Access your interview platform</p>
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
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-700">
                I am signing in as: <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className={cn(
                  "flex items-center p-4 border rounded-lg cursor-pointer transition-colors",
                  formData?.role === 'candidate' 
                    ? "border-blue-500 bg-blue-50" :"border-gray-200 hover:border-gray-300"
                )}>
                  <Input
                    type="radio"
                    name="role"
                    value="candidate"
                    checked={formData?.role === 'candidate'}
                    onChange={handleInputChange}
                    className="sr-only"
                  />
                  <div className="flex items-center">
                    <div className={cn(
                      "w-4 h-4 rounded-full border-2 mr-3",
                      formData?.role === 'candidate'
                        ? "border-blue-500 bg-blue-500" :"border-gray-300"
                    )}>
                      {formData?.role === 'candidate' && (
                        <div className="w-2 h-2 rounded-full bg-white mx-auto mt-0.5" />
                      )}
                    </div>
                    <span className="text-sm font-medium">Candidate</span>
                  </div>
                </label>

                <label className={cn(
                  "flex items-center p-4 border rounded-lg cursor-pointer transition-colors",
                  formData?.role === 'interviewer' 
                    ? "border-blue-500 bg-blue-50" :"border-gray-200 hover:border-gray-300"
                )}>
                  <Input
                    type="radio"
                    name="role"
                    value="interviewer"
                    checked={formData?.role === 'interviewer'}
                    onChange={handleInputChange}
                    className="sr-only"
                  />
                  <div className="flex items-center">
                    <div className={cn(
                      "w-4 h-4 rounded-full border-2 mr-3",
                      formData?.role === 'interviewer'
                        ? "border-blue-500 bg-blue-500" :"border-gray-300"
                    )}>
                      {formData?.role === 'interviewer' && (
                        <div className="w-2 h-2 rounded-full bg-white mx-auto mt-0.5" />
                      )}
                    </div>
                    <span className="text-sm font-medium">Interviewer</span>
                  </div>
                </label>
              </div>
              {errors?.role && (
                <p className="text-sm text-red-600">{errors?.role}</p>
              )}
            </div>

            {/* Email Input */}
            <Input
              type="email"
              name="email"
              label="Email Address"
              placeholder="Enter your email"
              value={formData?.email}
              onChange={handleInputChange}
              error={errors?.email}
              required
              className="w-full"
            />

            {/* Password Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Enter your password"
                  value={formData?.password}
                  onChange={handleInputChange}
                  error={errors?.password}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors?.password && (
                <p className="text-sm text-red-600">{errors?.password}</p>
              )}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <Input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData?.rememberMe}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                <span className="text-sm text-gray-600">Remember me</span>
              </label>
              <button
                type="button"
                className="text-sm text-blue-600 hover:text-blue-800"
                onClick={() => {
                  alert('Forgot password functionality would be implemented here');
                }}
              >
                Forgot Password?
              </button>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              loading={isLoading}
              disabled={!isFormValid || isLoading}
              fullWidth
              className="h-12"
              iconName="LogIn"
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Button>

            {/* Attempt Warning */}
            {attemptCount > 0 && attemptCount < 5 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
                <p className="text-sm text-yellow-700">
                  Failed attempts: {attemptCount}/5
                </p>
              </div>
            )}
          </form>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link 
                to="/signup-screen" 
                className="font-medium text-blue-600 hover:text-blue-800"
              >
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;