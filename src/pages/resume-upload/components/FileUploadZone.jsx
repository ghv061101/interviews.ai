import React, { useState, useRef } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const FileUploadZone = ({ 
  onFileSelect = () => {},
  acceptedFormats = ['.pdf', '.docx'],
  maxSize = 10 * 1024 * 1024, // 10MB
  isUploading = false,
  uploadProgress = 0,
  className = ''
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef(null);

  const validateFile = (file) => {
    const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    
    if (!validTypes?.includes(file?.type)) {
      return 'Please upload a PDF or DOCX file only';
    }
    
    if (file?.size > maxSize) {
      return `File size must be less than ${Math.round(maxSize / (1024 * 1024))}MB`;
    }
    
    return null;
  };

  const handleFileSelect = (files) => {
    const file = files?.[0];
    if (!file) return;

    const error = validateFile(file);
    if (error) {
      setUploadError(error);
      return;
    }

    setUploadError('');
    onFileSelect(file);
  };

  const handleDragOver = (e) => {
    e?.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e?.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e?.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e?.dataTransfer?.files);
    handleFileSelect(files);
  };

  const handleFileInputChange = (e) => {
    const files = Array.from(e?.target?.files);
    handleFileSelect(files);
  };

  const handleBrowseClick = () => {
    fileInputRef?.current?.click();
  };

  return (
    <div className={`w-full ${className}`}>
      {/* Upload Zone */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${
          isDragOver
            ? 'border-primary bg-primary/5 scale-[1.02]'
            : uploadError
            ? 'border-error bg-error/5' :'border-muted-foreground/30 bg-muted/20 hover:border-primary/50 hover:bg-primary/5'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {/* Upload Icon */}
        <div className={`flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full transition-colors ${
          isDragOver ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
        }`}>
          <Icon 
            name={isUploading ? 'Loader2' : 'Upload'} 
            size={24} 
            className={isUploading ? 'animate-spin' : ''} 
          />
        </div>

        {/* Upload Content */}
        {isUploading ? (
          <div className="space-y-3">
            <h3 className="text-lg font-medium text-foreground">Uploading Resume...</h3>
            <div className="w-full max-w-xs mx-auto bg-muted rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <p className="text-sm text-muted-foreground">{uploadProgress}% complete</p>
          </div>
        ) : (
          <div className="space-y-3">
            <h3 className="text-lg font-medium text-foreground">
              {isDragOver ? 'Drop your resume here' : 'Upload Your Resume'}
            </h3>
            <p className="text-muted-foreground">
              Drag and drop your resume file here, or{' '}
              <button
                onClick={handleBrowseClick}
                className="text-primary hover:text-primary/80 font-medium underline"
              >
                browse files
              </button>
            </p>
            
            {/* File Format Info */}
            <div className="flex items-center justify-center space-x-4 text-sm text-muted-foreground">
              <div className="flex items-center space-x-1">
                <Icon name="FileText" size={16} />
                <span>PDF</span>
              </div>
              <div className="w-1 h-1 bg-muted-foreground rounded-full" />
              <div className="flex items-center space-x-1">
                <Icon name="FileText" size={16} />
                <span>DOCX</span>
              </div>
              <div className="w-1 h-1 bg-muted-foreground rounded-full" />
              <span>Max 10MB</span>
            </div>
          </div>
        )}

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.docx"
          onChange={handleFileInputChange}
          className="hidden"
        />
      </div>

      {/* Mobile Upload Button */}
      <div className="md:hidden mt-4">
        <Button
          variant="outline"
          iconName="Upload"
          iconPosition="left"
          iconSize={16}
          onClick={handleBrowseClick}
          disabled={isUploading}
          fullWidth
        >
          {isUploading ? 'Uploading...' : 'Choose File'}
        </Button>
      </div>

      {/* Error Message */}
      {uploadError && (
        <div className="mt-4 p-3 bg-error/10 border border-error/20 rounded-lg">
          <div className="flex items-center space-x-2">
            <Icon name="AlertCircle" size={16} className="text-error" />
            <span className="text-sm font-medium text-error">{uploadError}</span>
          </div>
        </div>
      )}

      {/* Upload Tips */}
      <div className="mt-6 p-4 bg-accent/10 border border-accent/20 rounded-lg">
        <h4 className="flex items-center space-x-2 text-sm font-medium text-accent mb-2">
          <Icon name="Lightbulb" size={16} />
          <span>Upload Tips</span>
        </h4>
        <ul className="text-sm text-accent/80 space-y-1">
          <li>• Ensure your resume includes your full name, email, and phone number</li>
          <li>• Use a clear, professional format for better AI extraction</li>
          <li>• PDF format is preferred for best compatibility</li>
        </ul>
      </div>
    </div>
  );
};

export default FileUploadZone;