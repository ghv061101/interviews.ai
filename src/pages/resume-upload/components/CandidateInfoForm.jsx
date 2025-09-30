import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';


const CandidateInfoForm = ({ 
  extractedData = {},
  onDataChange = () => {},
  onValidationChange = () => {},
  isExtracting = false,
  className = ''
}) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    ...extractedData
  });
  
  const [errors, setErrors] = useState({});
  const [isEdited, setIsEdited] = useState(false);

  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      ...extractedData
    }));
  }, [extractedData]);

  const validateField = (name, value) => {
    switch (name) {
      case 'fullName':
        if (!value?.trim()) return 'Full name is required';
        if (value?.trim()?.length < 2) return 'Name must be at least 2 characters';
        return '';
      
      case 'email':
        if (!value?.trim()) return 'Email address is required';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex?.test(value)) return 'Please enter a valid email address';
        return '';
      
      case 'phone':
        if (!value?.trim()) return 'Phone number is required';
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        if (!phoneRegex?.test(value?.replace(/[\s\-\(\)]/g, ''))) {
          return 'Please enter a valid phone number';
        }
        return '';
      
      default:
        return '';
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    setIsEdited(true);
    
    // Validate field
    const error = validateField(field, value);
    setErrors(prev => ({
      ...prev,
      [field]: error
    }));
    
    // Update parent component
    const updatedData = { ...formData, [field]: value };
    onDataChange(updatedData);
    
    // Check overall validation
    const allErrors = { ...errors, [field]: error };
    const hasErrors = Object.values(allErrors)?.some(err => err !== '');
    const hasAllFields = updatedData?.fullName && updatedData?.email && updatedData?.phone;
    onValidationChange(!hasErrors && hasAllFields);
  };

  const handleBlur = (field) => {
    const error = validateField(field, formData?.[field]);
    setErrors(prev => ({
      ...prev,
      [field]: error
    }));
  };

  const getFieldStatus = (field) => {
    if (isExtracting) return 'extracting';
    if (extractedData?.[field] && !isEdited) return 'extracted';
    if (formData?.[field] && !errors?.[field]) return 'valid';
    if (errors?.[field]) return 'error';
    return 'empty';
  };

  const getFieldIcon = (status) => {
    switch (status) {
      case 'extracting': return 'Loader2';
      case 'extracted': return 'Sparkles';
      case 'valid': return 'CheckCircle';
      case 'error': return 'AlertCircle';
      default: return 'User';
    }
  };

  const getFieldIconColor = (status) => {
    switch (status) {
      case 'extracting': return 'text-muted-foreground animate-spin';
      case 'extracted': return 'text-accent';
      case 'valid': return 'text-success';
      case 'error': return 'text-error';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <div className={`bg-card border border-border rounded-lg p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Candidate Information</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {isExtracting ? 'Extracting information from your resume...' : 'Verify and complete your details'}
          </p>
        </div>
        
        {extractedData?.fullName && !isExtracting && (
          <div className="flex items-center space-x-2 text-sm text-accent">
            <Icon name="Sparkles" size={16} />
            <span>AI Extracted</span>
          </div>
        )}
      </div>
      {/* Form Fields */}
      <div className="space-y-6">
        {/* Full Name */}
        <div className="relative">
          <Input
            label="Full Name"
            type="text"
            placeholder="Enter your full name"
            value={formData?.fullName}
            onChange={(e) => handleInputChange('fullName', e?.target?.value)}
            onBlur={() => handleBlur('fullName')}
            error={errors?.fullName}
            disabled={isExtracting}
            required
            className="pr-10"
          />
          <div className="absolute right-3 top-9">
            <Icon 
              name={getFieldIcon(getFieldStatus('fullName'))} 
              size={16} 
              className={getFieldIconColor(getFieldStatus('fullName'))}
            />
          </div>
        </div>

        {/* Email */}
        <div className="relative">
          <Input
            label="Email Address"
            type="email"
            placeholder="Enter your email address"
            value={formData?.email}
            onChange={(e) => handleInputChange('email', e?.target?.value)}
            onBlur={() => handleBlur('email')}
            error={errors?.email}
            disabled={isExtracting}
            required
            className="pr-10"
          />
          <div className="absolute right-3 top-9">
            <Icon 
              name={getFieldIcon(getFieldStatus('email'))} 
              size={16} 
              className={getFieldIconColor(getFieldStatus('email'))}
            />
          </div>
        </div>

        {/* Phone */}
        <div className="relative">
          <Input
            label="Phone Number"
            type="tel"
            placeholder="Enter your phone number"
            value={formData?.phone}
            onChange={(e) => handleInputChange('phone', e?.target?.value)}
            onBlur={() => handleBlur('phone')}
            error={errors?.phone}
            disabled={isExtracting}
            required
            className="pr-10"
          />
          <div className="absolute right-3 top-9">
            <Icon 
              name={getFieldIcon(getFieldStatus('phone'))} 
              size={16} 
              className={getFieldIconColor(getFieldStatus('phone'))}
            />
          </div>
        </div>
      </div>
      {/* Extraction Status */}
      {isExtracting && (
        <div className="mt-6 p-4 bg-accent/10 border border-accent/20 rounded-lg">
          <div className="flex items-center space-x-3">
            <Icon name="Brain" size={20} className="text-accent animate-pulse" />
            <div>
              <p className="text-sm font-medium text-accent">AI Processing Resume</p>
              <p className="text-xs text-accent/80">Extracting candidate information automatically...</p>
            </div>
          </div>
        </div>
      )}
      {/* Validation Summary */}
      {!isExtracting && (
        <div className="mt-6 p-4 bg-muted/30 rounded-lg">
          <div className="flex items-start space-x-3">
            <Icon name="Info" size={16} className="text-muted-foreground mt-0.5" />
            <div className="text-sm text-muted-foreground">
              <p className="font-medium mb-1">Information Requirements</p>
              <ul className="space-y-1">
                <li className="flex items-center space-x-2">
                  <Icon 
                    name={formData?.fullName && !errors?.fullName ? 'CheckCircle' : 'Circle'} 
                    size={12} 
                    className={formData?.fullName && !errors?.fullName ? 'text-success' : 'text-muted-foreground'} 
                  />
                  <span>Full name (required)</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Icon 
                    name={formData?.email && !errors?.email ? 'CheckCircle' : 'Circle'} 
                    size={12} 
                    className={formData?.email && !errors?.email ? 'text-success' : 'text-muted-foreground'} 
                  />
                  <span>Valid email address (required)</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Icon 
                    name={formData?.phone && !errors?.phone ? 'CheckCircle' : 'Circle'} 
                    size={12} 
                    className={formData?.phone && !errors?.phone ? 'text-success' : 'text-muted-foreground'} 
                  />
                  <span>Phone number (required)</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CandidateInfoForm;