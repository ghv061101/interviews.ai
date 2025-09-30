import geminiService from './geminiService';

class ResumeParser {
  constructor() {
    this.supportedFormats = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
  }

  async parseResume(file) {
    try {
      if (!this.isValidFormat(file)) {
        throw new Error('Unsupported file format. Please upload PDF or DOCX files only.');
      }

      // Extract text from file
      const text = await this.extractTextFromFile(file);
      
      // Use Gemini AI to extract structured data
      const extractedData = await geminiService.extractResumeData(text);
      
      return {
        success: true,
        data: extractedData,
        rawText: text
      };
    } catch (error) {
      console.error('Resume parsing error:', error);
      return {
        success: false,
        error: error.message,
        data: null
      };
    }
  }

  isValidFormat(file) {
    return this.supportedFormats.includes(file.type);
  }

  async extractTextFromFile(file) {
    // For demo purposes, we'll simulate text extraction
    // In a real application, you would use libraries like:
    // - pdf-parse for PDF files
    // - mammoth for DOCX files
    
    return new Promise((resolve) => {
      setTimeout(() => {
        // Mock resume text for demonstration
        const mockResumeText = `
          Sarah Johnson
          Senior Full Stack Developer
          Email: sarah.johnson@email.com
          Phone: +1 (555) 123-4567
          
          EXPERIENCE
          Senior Full Stack Developer at TechCorp Inc. (2022-Present)
          - Developed scalable web applications using React and Node.js
          - Led a team of 4 developers on multiple projects
          - Implemented microservices architecture
          
          Full Stack Developer at StartupXYZ (2020-2022)
          - Built responsive web applications
          - Worked with React, Express.js, and MongoDB
          - Collaborated with design team on UI/UX improvements
          
          SKILLS
          Frontend: React, JavaScript, TypeScript, HTML5, CSS3, Tailwind CSS
          Backend: Node.js, Express.js, Python, Django
          Database: MongoDB, PostgreSQL, Redis
          Tools: Git, Docker, AWS, Jenkins
          
          EDUCATION
          Bachelor of Science in Computer Science
          University of California, Berkeley (2016-2020)
        `;
        
        resolve(mockResumeText);
      }, 1000);
    });
  }

  validateExtractedData(data) {
    const requiredFields = ['fullName', 'email', 'phone'];
    const missingFields = [];

    requiredFields.forEach(field => {
      if (!data[field] || data[field].trim() === '') {
        missingFields.push(field);
      }
    });

    return {
      isValid: missingFields.length === 0,
      missingFields
    };
  }

  formatPhoneNumber(phone) {
    if (!phone) return '';
    
    // Remove all non-digit characters
    const digits = phone.replace(/\D/g, '');
    
    // Format as (XXX) XXX-XXXX for US numbers
    if (digits.length === 10) {
      return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
    }
    
    // Format as +X (XXX) XXX-XXXX for international numbers
    if (digits.length === 11 && digits.startsWith('1')) {
      return `+1 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
    }
    
    return phone; // Return original if can't format
  }

  validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  validatePhone(phone) {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
    return phoneRegex.test(cleanPhone);
  }
}

export default new ResumeParser();