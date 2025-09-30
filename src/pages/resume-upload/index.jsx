import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import CandidateProgressIndicator from '../../components/ui/CandidateProgressIndicator';
import FileUploadZone from './components/FileUploadZone';
import CandidateInfoForm from './components/CandidateInfoForm';
import AIChatbot from './components/AIChatbot';
import StartInterviewButton from './components/StartInterviewButton';

const ResumeUpload = () => {
  const navigate = useNavigate();
  
  // State management
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractedData, setExtractedData] = useState({});
  const [candidateData, setCandidateData] = useState({
    fullName: '',
    email: '',
    phone: ''
  });
  const [isFormValid, setIsFormValid] = useState(false);
  const [showChatbot, setShowChatbot] = useState(false);
  const [missingFields, setMissingFields] = useState([]);
  const [isStartingInterview, setIsStartingInterview] = useState(false);

  // Mock extracted data for demonstration
  const mockExtractedData = {
    fullName: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    phone: "+1 (555) 123-4567"
  };

  useEffect(() => {
    // Check for missing fields and show chatbot if needed
    const missing = [];
    if (!candidateData?.fullName) missing?.push('fullName');
    if (!candidateData?.email) missing?.push('email');
    if (!candidateData?.phone) missing?.push('phone');
    
    setMissingFields(missing);
    
    // Show chatbot if there are missing fields and we have uploaded a file
    if (missing?.length > 0 && uploadedFile && !isExtracting) {
      setShowChatbot(true);
    } else {
      setShowChatbot(false);
    }
  }, [candidateData, uploadedFile, isExtracting]);

  const simulateFileUpload = (file) => {
    setIsUploading(true);
    setUploadProgress(0);
    
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          simulateDataExtraction();
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const simulateDataExtraction = () => {
    setIsExtracting(true);
    
    setTimeout(() => {
      setExtractedData(mockExtractedData);
      setCandidateData(mockExtractedData);
      setIsExtracting(false);
    }, 3000);
  };

  const handleFileSelect = (file) => {
    setUploadedFile(file);
    simulateFileUpload(file);
  };

  const handleCandidateDataChange = (data) => {
    setCandidateData(data);
  };

  const handleFormValidationChange = (isValid) => {
    setIsFormValid(isValid);
  };

  const handleChatbotFieldProvided = (field, value) => {
    setCandidateData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleStartInterview = () => {
    if (!isFormValid || !uploadedFile) return;
    
    setIsStartingInterview(true);
    
    // Save session data to localStorage
    const sessionData = {
      candidateData,
      resumeFile: uploadedFile?.name,
      startTime: new Date()?.toISOString(),
      currentStep: 1
    };
    
    localStorage.setItem('interview_session', JSON.stringify(sessionData));
    
    // Simulate interview preparation
    setTimeout(() => {
      navigate('/interview-questions');
    }, 2000);
  };

  const getValidationStatus = () => {
    return {
      resume: !!uploadedFile,
      fullName: !!candidateData?.fullName && candidateData?.fullName?.length >= 2,
      email: !!candidateData?.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/?.test(candidateData?.email),
      phone: !!candidateData?.phone && /^[\+]?[1-9][\d]{0,15}$/?.test(candidateData?.phone?.replace(/[\s\-\(\)]/g, ''))
    };
  };

  const validationStatus = getValidationStatus();
  const allValid = Object.values(validationStatus)?.every(Boolean);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <CandidateProgressIndicator 
        currentStep={1}
        totalSteps={3}
        completionStatus="in-progress"
        stepLabels={['Upload Resume', 'Interview Questions', 'Complete']}
      />
      
      <main className="pt-32 pb-12">
        <div className="max-w-4xl mx-auto px-6">
          {/* Page Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-semibold text-foreground mb-3">
              Welcome to Your AI Interview
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Upload your resume and provide your contact information to begin your personalized interview experience.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* File Upload */}
              <FileUploadZone
                onFileSelect={handleFileSelect}
                isUploading={isUploading}
                uploadProgress={uploadProgress}
              />

              {/* Candidate Information Form */}
              {uploadedFile && (
                <CandidateInfoForm
                  extractedData={extractedData}
                  onDataChange={handleCandidateDataChange}
                  onValidationChange={handleFormValidationChange}
                  isExtracting={isExtracting}
                />
              )}

              {/* Start Interview Button */}
              {uploadedFile && (
                <StartInterviewButton
                  isEnabled={allValid}
                  isLoading={isStartingInterview}
                  onStartInterview={handleStartInterview}
                  validationStatus={validationStatus}
                />
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              {/* AI Chatbot */}
              {showChatbot && (
                <AIChatbot
                  isVisible={showChatbot}
                  missingFields={missingFields}
                  onFieldProvided={handleChatbotFieldProvided}
                  onClose={() => setShowChatbot(false)}
                  className="sticky top-32"
                />
              )}

              {/* Help Section */}
              {!showChatbot && (
                <div className="bg-card border border-border rounded-lg p-6 sticky top-32">
                  <h3 className="text-lg font-medium text-foreground mb-4">Need Help?</h3>
                  <div className="space-y-4 text-sm">
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-medium text-accent">1</span>
                      </div>
                      <div>
                        <p className="font-medium text-foreground">Upload Resume</p>
                        <p className="text-muted-foreground">Upload your PDF or DOCX resume file</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-medium text-accent">2</span>
                      </div>
                      <div>
                        <p className="font-medium text-foreground">Verify Information</p>
                        <p className="text-muted-foreground">Check and complete your contact details</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-medium text-accent">3</span>
                      </div>
                      <div>
                        <p className="font-medium text-foreground">Start Interview</p>
                        <p className="text-muted-foreground">Begin your AI-powered interview session</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ResumeUpload;