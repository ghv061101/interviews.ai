import OpenAI from 'openai';

class OpenAIService {
  constructor() {
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    if (!apiKey) {
      console.warn('OpenAI API key not found. Using mock responses.');
      this.useMock = true;
      return;
    }

    this.client = new OpenAI({
      apiKey: apiKey,
      dangerouslyAllowBrowser: true
    });
    this.useMock = false;
  }

  async extractResumeData(resumeText) {
    if (this.useMock) {
      return this.getMockResumeData();
    }

    try {
      const prompt = `Extract the following information from this resume text and return it as a JSON object:
- fullName: The candidate's full name
- email: Email address
- phone: Phone number
- skills: Array of technical skills
- experience: Years of experience (as a number)
- position: Most recent job title or desired position

Resume text:
${resumeText}

Return only valid JSON without any markdown formatting or additional text.`;

      const response = await this.client.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are a helpful assistant that extracts structured data from resumes. Always respond with valid JSON only.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.3,
      });

      const text = response.choices[0].message.content.trim();

      try {
        const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        return JSON.parse(cleaned);
      } catch (parseError) {
        console.error('Failed to parse AI response:', text);
        return this.getMockResumeData();
      }
    } catch (error) {
      console.error('Error extracting resume data:', error);
      return this.getMockResumeData();
    }
  }

  async generateQuestion(difficulty, questionNumber, candidateData, previousQuestions = []) {
    if (this.useMock) {
      return this.getMockQuestion(difficulty, questionNumber);
    }

    try {
      const skillsContext = candidateData.skills ? candidateData.skills.join(', ') : 'React, Node.js, JavaScript';
      const experienceContext = candidateData.experience || '3-5 years';

      const prompt = `Generate a ${difficulty} level technical interview question for a Full Stack Developer position.

Candidate context:
- Skills: ${skillsContext}
- Experience: ${experienceContext}
- Position: ${candidateData.position || 'Full Stack Developer'}

Question number: ${questionNumber} of 6
Difficulty: ${difficulty}

Previous questions asked: ${previousQuestions.map(q => q.title).join('; ')}

Requirements:
- Question should be relevant to full stack development
- ${difficulty === 'easy' ? 'Focus on fundamentals and basic concepts' :
   difficulty === 'medium' ? 'Focus on practical application and problem-solving' :
   'Focus on system design, architecture, and advanced concepts'}
- Avoid repeating previous questions
- Include specific requirements or constraints

Return a JSON object with:
{
  "title": "Question title/prompt",
  "description": "Detailed question description with context",
  "requirements": ["requirement 1", "requirement 2", "requirement 3"],
  "expectedTime": "Expected time to answer",
  "focus": "Main focus area of the question",
  "difficulty": "${difficulty}",
  "timeLimit": ${difficulty === 'easy' ? 20 : difficulty === 'medium' ? 60 : 120}
}

Return only valid JSON without markdown formatting.`;

      const response = await this.client.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are an expert technical interviewer. Always respond with valid JSON only.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
      });

      const text = response.choices[0].message.content.trim();

      try {
        const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        return JSON.parse(cleaned);
      } catch (parseError) {
        console.error('Failed to parse question response:', text);
        return this.getMockQuestion(difficulty, questionNumber);
      }
    } catch (error) {
      console.error('Error generating question:', error);
      return this.getMockQuestion(difficulty, questionNumber);
    }
  }

  async evaluateAnswer(question, answer, candidateData) {
    if (this.useMock) {
      return this.getMockEvaluation(question, answer);
    }

    try {
      const prompt = `Evaluate this interview answer for a Full Stack Developer position.

Question: ${question.title}
Question Description: ${question.description}
Difficulty: ${question.difficulty}

Candidate's Answer: ${answer}

Candidate Context:
- Skills: ${candidateData.skills ? candidateData.skills.join(', ') : 'Not specified'}
- Experience: ${candidateData.experience || 'Not specified'}

Evaluate based on:
1. Technical accuracy
2. Completeness of answer
3. Problem-solving approach
4. Communication clarity
5. Practical understanding

Return a JSON object with:
{
  "score": number (0-100),
  "maxScore": ${question.difficulty === 'easy' ? 20 : question.difficulty === 'medium' ? 30 : 40},
  "feedback": "Detailed feedback explaining the score",
  "strengths": ["strength 1", "strength 2"],
  "improvements": ["improvement 1", "improvement 2"],
  "technicalAccuracy": number (0-10),
  "completeness": number (0-10),
  "clarity": number (0-10)
}

Return only valid JSON without markdown formatting.`;

      const response = await this.client.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are an expert technical interviewer evaluating candidate responses. Always respond with valid JSON only.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.5,
      });

      const text = response.choices[0].message.content.trim();

      try {
        const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        return JSON.parse(cleaned);
      } catch (parseError) {
        console.error('Failed to parse evaluation response:', text);
        return this.getMockEvaluation(question, answer);
      }
    } catch (error) {
      console.error('Error evaluating answer:', error);
      return this.getMockEvaluation(question, answer);
    }
  }

  async generateFinalSummary(candidateData, questionsAndAnswers) {
    if (this.useMock) {
      return this.getMockFinalSummary(candidateData, questionsAndAnswers);
    }

    try {
      const totalScore = questionsAndAnswers.reduce((sum, qa) => sum + (qa.evaluation?.score || 0), 0);
      const maxTotalScore = questionsAndAnswers.reduce((sum, qa) => sum + (qa.evaluation?.maxScore || 0), 0);
      const averageScore = maxTotalScore > 0 ? Math.round((totalScore / maxTotalScore) * 100) : 0;

      const prompt = `Generate a comprehensive interview summary for a Full Stack Developer candidate.

Candidate Information:
- Name: ${candidateData.fullName}
- Position: ${candidateData.position || 'Full Stack Developer'}
- Experience: ${candidateData.experience || 'Not specified'}
- Skills: ${candidateData.skills ? candidateData.skills.join(', ') : 'Not specified'}

Interview Performance:
- Total Score: ${totalScore}/${maxTotalScore} (${averageScore}%)
- Questions Answered: ${questionsAndAnswers.length}

Question Details:
${questionsAndAnswers.map((qa, index) => `
Q${index + 1} (${qa.question.difficulty}): ${qa.question.title}
Answer: ${qa.answer.substring(0, 200)}...
Score: ${qa.evaluation?.score || 0}/${qa.evaluation?.maxScore || 0}
`).join('\n')}

Generate a comprehensive summary with:
{
  "overallScore": ${averageScore},
  "recommendation": "Strong Hire|Hire|Maybe|No Hire",
  "summary": "2-3 sentence overall assessment",
  "technicalStrengths": ["strength 1", "strength 2", "strength 3"],
  "areasForImprovement": ["area 1", "area 2"],
  "skillAssessment": {
    "javascript": number (0-100),
    "react": number (0-100),
    "nodejs": number (0-100),
    "problemSolving": number (0-100),
    "communication": number (0-100)
  },
  "detailedFeedback": "Detailed paragraph about performance",
  "nextSteps": ["recommendation 1", "recommendation 2"],
  "interviewerNotes": "Key points for hiring manager"
}

Return only valid JSON without markdown formatting.`;

      const response = await this.client.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are an expert technical interviewer providing comprehensive candidate assessments. Always respond with valid JSON only.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.6,
      });

      const text = response.choices[0].message.content.trim();

      try {
        const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        return JSON.parse(cleaned);
      } catch (parseError) {
        console.error('Failed to parse summary response:', text);
        return this.getMockFinalSummary(candidateData, questionsAndAnswers);
      }
    } catch (error) {
      console.error('Error generating final summary:', error);
      return this.getMockFinalSummary(candidateData, questionsAndAnswers);
    }
  }

  getMockResumeData() {
    return {
      fullName: "Sarah Johnson",
      email: "sarah.johnson@email.com",
      phone: "+1 (555) 123-4567",
      skills: ["React", "Node.js", "JavaScript", "TypeScript", "MongoDB"],
      experience: 5,
      position: "Senior Full Stack Developer"
    };
  }

  getMockQuestion(difficulty, questionNumber) {
    const questions = {
      easy: [
        {
          title: "What is the difference between let, const, and var in JavaScript?",
          description: "Explain the key differences between these three variable declaration keywords in JavaScript. Include information about scope behavior, hoisting characteristics, and when to use each one.",
          requirements: [
            "Explain scope differences clearly",
            "Mention hoisting behavior for each",
            "Provide simple code examples",
            "Discuss when to use each one"
          ],
          expectedTime: "2-3 minutes",
          focus: "JavaScript fundamentals",
          difficulty: "easy",
          timeLimit: 20
        },
        {
          title: "Explain the concept of React components and JSX",
          description: "Describe what React components are and how JSX works. Explain the difference between functional and class components.",
          requirements: [
            "Define React components",
            "Explain JSX syntax",
            "Compare functional vs class components",
            "Provide a simple example"
          ],
          expectedTime: "2-3 minutes",
          focus: "React fundamentals",
          difficulty: "easy",
          timeLimit: 20
        }
      ],
      medium: [
        {
          title: "How would you implement user authentication in a React/Node.js application?",
          description: "Design and explain a complete authentication system including login, registration, and protected routes. Consider security best practices.",
          requirements: [
            "Explain JWT token implementation",
            "Describe password hashing",
            "Show protected route implementation",
            "Discuss security considerations"
          ],
          expectedTime: "4-5 minutes",
          focus: "Full stack authentication",
          difficulty: "medium",
          timeLimit: 60
        },
        {
          title: "Implement a custom React hook for API data fetching",
          description: "Create a reusable custom hook that handles API calls with loading states, error handling, and caching.",
          requirements: [
            "Implement loading and error states",
            "Handle API call lifecycle",
            "Add basic caching mechanism",
            "Make it reusable across components"
          ],
          expectedTime: "4-5 minutes",
          focus: "React hooks and API integration",
          difficulty: "medium",
          timeLimit: 60
        }
      ],
      hard: [
        {
          title: "Design a scalable real-time chat application architecture",
          description: "Design the complete architecture for a real-time chat application that can handle thousands of concurrent users. Include database design, real-time communication, and scalability considerations.",
          requirements: [
            "Design database schema",
            "Explain real-time communication strategy",
            "Address scalability and performance",
            "Consider security and data privacy",
            "Discuss deployment and monitoring"
          ],
          expectedTime: "7-10 minutes",
          focus: "System design and architecture",
          difficulty: "hard",
          timeLimit: 120
        },
        {
          title: "Optimize a React application with performance bottlenecks",
          description: "You have a React application with slow rendering, large bundle size, and memory leaks. Identify potential issues and provide optimization strategies.",
          requirements: [
            "Identify common performance bottlenecks",
            "Explain React optimization techniques",
            "Discuss bundle optimization strategies",
            "Address memory leak prevention",
            "Mention monitoring and profiling tools"
          ],
          expectedTime: "7-10 minutes",
          focus: "Performance optimization",
          difficulty: "hard",
          timeLimit: 120
        }
      ]
    };

    const difficultyQuestions = questions[difficulty] || questions.easy;
    return difficultyQuestions[(questionNumber - 1) % difficultyQuestions.length];
  }

  getMockEvaluation(question, answer) {
    const baseScore = Math.floor(Math.random() * 30) + 70;
    const maxScore = question.difficulty === 'easy' ? 20 : question.difficulty === 'medium' ? 30 : 40;
    const actualScore = Math.min(baseScore, maxScore);

    return {
      score: actualScore,
      maxScore: maxScore,
      feedback: `Good understanding demonstrated. Your answer shows solid grasp of the concepts with room for improvement in specific areas.`,
      strengths: [
        "Clear explanation of core concepts",
        "Good use of examples",
        "Logical structure in response"
      ],
      improvements: [
        "Could provide more specific examples",
        "Consider edge cases in the solution"
      ],
      technicalAccuracy: Math.floor(actualScore / 10),
      completeness: Math.floor(actualScore / 10),
      clarity: Math.floor(actualScore / 10)
    };
  }

  getMockFinalSummary(candidateData, questionsAndAnswers) {
    const totalScore = questionsAndAnswers.reduce((sum, qa) => sum + (qa.evaluation?.score || 75), 0);
    const maxTotalScore = questionsAndAnswers.reduce((sum, qa) => sum + (qa.evaluation?.maxScore || 30), 0);
    const averageScore = maxTotalScore > 0 ? Math.round((totalScore / maxTotalScore) * 100) : 85;

    return {
      overallScore: averageScore,
      recommendation: averageScore >= 85 ? "Strong Hire" : averageScore >= 75 ? "Hire" : averageScore >= 65 ? "Maybe" : "No Hire",
      summary: `${candidateData.fullName} demonstrated strong technical knowledge with good problem-solving abilities. Shows solid understanding of full stack development concepts.`,
      technicalStrengths: [
        "Strong JavaScript fundamentals",
        "Good React component architecture understanding",
        "Solid problem-solving approach"
      ],
      areasForImprovement: [
        "Could improve system design thinking",
        "More specific examples in explanations"
      ],
      skillAssessment: {
        javascript: Math.min(averageScore + 5, 100),
        react: averageScore,
        nodejs: Math.max(averageScore - 5, 0),
        problemSolving: averageScore,
        communication: Math.min(averageScore + 3, 100)
      },
      detailedFeedback: `The candidate showed consistent performance across different difficulty levels. Technical explanations were clear and demonstrated practical understanding. With some additional experience in system design, they would be well-suited for senior-level responsibilities.`,
      nextSteps: [
        "Consider for technical team interview",
        "Discuss specific project experience",
        "Evaluate cultural fit"
      ],
      interviewerNotes: `Strong technical foundation with good communication skills. Recommended for next round.`
    };
  }
}

export default new OpenAIService();
