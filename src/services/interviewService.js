import geminiService from './geminiService';

class InterviewService {
  constructor() {
    this.difficultyProgression = ['easy', 'easy', 'medium', 'medium', 'hard', 'hard'];
    this.timeLimits = {
      easy: 20,    // 20 seconds
      medium: 60,  // 60 seconds  
      hard: 120    // 120 seconds
    };
  }

  async startInterview(candidateData) {
    const interviewSession = {
      id: `INT-${Date.now()}`,
      candidateData,
      questions: [],
      answers: [],
      evaluations: [],
      currentQuestionIndex: 0,
      status: 'in-progress',
      startTime: new Date().toISOString(),
      endTime: null,
      finalSummary: null
    };

    // Generate first question
    const firstQuestion = await this.generateNextQuestion(interviewSession);
    interviewSession.questions.push(firstQuestion);

    // Save to localStorage
    this.saveInterviewSession(interviewSession);

    return interviewSession;
  }

  async generateNextQuestion(interviewSession) {
    const { candidateData, questions, currentQuestionIndex } = interviewSession;
    const difficulty = this.difficultyProgression[currentQuestionIndex];
    const questionNumber = currentQuestionIndex + 1;

    try {
      const question = await geminiService.generateQuestion(
        difficulty,
        questionNumber,
        candidateData,
        questions
      );

      return {
        ...question,
        id: `Q-${Date.now()}`,
        questionNumber,
        generatedAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error generating question:', error);
      // Fallback to mock question
      return this.getMockQuestion(difficulty, questionNumber);
    }
  }

  async submitAnswer(interviewSession, answer, timeSpent) {
    const currentQuestion = interviewSession.questions[interviewSession.currentQuestionIndex];
    
    // Save answer
    const answerData = {
      questionId: currentQuestion.id,
      answer: answer.trim(),
      timeSpent,
      timeLimit: currentQuestion.timeLimit,
      submittedAt: new Date().toISOString()
    };

    interviewSession.answers.push(answerData);

    // Evaluate answer using AI
    try {
      const evaluation = await geminiService.evaluateAnswer(
        currentQuestion,
        answer,
        interviewSession.candidateData
      );

      evaluation.questionId = currentQuestion.id;
      evaluation.evaluatedAt = new Date().toISOString();
      interviewSession.evaluations.push(evaluation);
    } catch (error) {
      console.error('Error evaluating answer:', error);
      // Add mock evaluation
      interviewSession.evaluations.push(this.getMockEvaluation(currentQuestion, answer));
    }

    // Move to next question or complete interview
    interviewSession.currentQuestionIndex++;

    if (interviewSession.currentQuestionIndex < this.difficultyProgression.length) {
      // Generate next question
      const nextQuestion = await this.generateNextQuestion(interviewSession);
      interviewSession.questions.push(nextQuestion);
    } else {
      // Complete interview
      await this.completeInterview(interviewSession);
    }

    this.saveInterviewSession(interviewSession);
    return interviewSession;
  }

  async completeInterview(interviewSession) {
    interviewSession.status = 'completed';
    interviewSession.endTime = new Date().toISOString();

    // Generate final summary
    const questionsAndAnswers = interviewSession.questions.map((question, index) => ({
      question,
      answer: interviewSession.answers[index]?.answer || '',
      evaluation: interviewSession.evaluations[index]
    }));

    try {
      const finalSummary = await geminiService.generateFinalSummary(
        interviewSession.candidateData,
        questionsAndAnswers
      );

      interviewSession.finalSummary = {
        ...finalSummary,
        generatedAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error generating final summary:', error);
      interviewSession.finalSummary = this.getMockFinalSummary(interviewSession);
    }

    // Save completed interview to results
    this.saveCompletedInterview(interviewSession);
    
    return interviewSession;
  }

  saveInterviewSession(session) {
    localStorage.setItem('current_interview_session', JSON.stringify(session));
  }

  loadInterviewSession() {
    try {
      const session = localStorage.getItem('current_interview_session');
      return session ? JSON.parse(session) : null;
    } catch (error) {
      console.error('Error loading interview session:', error);
      return null;
    }
  }

  clearCurrentSession() {
    localStorage.removeItem('current_interview_session');
  }

  saveCompletedInterview(session) {
    try {
      const completedInterviews = this.getCompletedInterviews();
      completedInterviews.push(session);
      localStorage.setItem('completed_interviews', JSON.stringify(completedInterviews));
      
      // Clear current session
      this.clearCurrentSession();
    } catch (error) {
      console.error('Error saving completed interview:', error);
    }
  }

  getCompletedInterviews() {
    try {
      const interviews = localStorage.getItem('completed_interviews');
      return interviews ? JSON.parse(interviews) : [];
    } catch (error) {
      console.error('Error loading completed interviews:', error);
      return [];
    }
  }

  pauseInterview(session) {
    session.status = 'paused';
    session.pausedAt = new Date().toISOString();
    this.saveInterviewSession(session);
  }

  resumeInterview(session) {
    session.status = 'in-progress';
    session.resumedAt = new Date().toISOString();
    this.saveInterviewSession(session);
  }

  calculateProgress(session) {
    const totalQuestions = this.difficultyProgression.length;
    const completedQuestions = session.answers.length;
    return {
      current: session.currentQuestionIndex + 1,
      total: totalQuestions,
      completed: completedQuestions,
      percentage: Math.round((completedQuestions / totalQuestions) * 100)
    };
  }

  getTimeLimit(difficulty) {
    return this.timeLimits[difficulty] || 60;
  }

  // Mock methods for fallback
  getMockQuestion(difficulty, questionNumber) {
    const questions = {
      easy: [
        {
          id: `Q-${Date.now()}`,
          title: "What is the difference between let, const, and var in JavaScript?",
          description: "Explain the key differences between these variable declaration keywords.",
          requirements: ["Explain scope differences", "Mention hoisting behavior"],
          expectedTime: "2-3 minutes",
          focus: "JavaScript fundamentals",
          difficulty: "easy",
          timeLimit: 20,
          questionNumber,
          generatedAt: new Date().toISOString()
        }
      ],
      medium: [
        {
          id: `Q-${Date.now()}`,
          title: "How would you implement authentication in a React app?",
          description: "Design a complete authentication system with login and protected routes.",
          requirements: ["JWT implementation", "Protected routes", "Security considerations"],
          expectedTime: "4-5 minutes",
          focus: "Authentication and security",
          difficulty: "medium",
          timeLimit: 60,
          questionNumber,
          generatedAt: new Date().toISOString()
        }
      ],
      hard: [
        {
          id: `Q-${Date.now()}`,
          title: "Design a scalable chat application architecture",
          description: "Design the complete architecture for a real-time chat application.",
          requirements: ["Database design", "Real-time communication", "Scalability"],
          expectedTime: "7-10 minutes",
          focus: "System design",
          difficulty: "hard",
          timeLimit: 120,
          questionNumber,
          generatedAt: new Date().toISOString()
        }
      ]
    };

    return questions[difficulty]?.[0] || questions.easy[0];
  }

  getMockEvaluation(question, answer) {
    const baseScore = Math.floor(Math.random() * 30) + 70;
    const maxScore = question.difficulty === 'easy' ? 20 : question.difficulty === 'medium' ? 30 : 40;

    return {
      questionId: question.id,
      score: Math.min(baseScore, maxScore),
      maxScore,
      feedback: "Good understanding demonstrated with room for improvement.",
      strengths: ["Clear explanation", "Good examples"],
      improvements: ["More specific details", "Consider edge cases"],
      technicalAccuracy: 8,
      completeness: 7,
      clarity: 8,
      evaluatedAt: new Date().toISOString()
    };
  }

  getMockFinalSummary(session) {
    const totalScore = session.evaluations.reduce((sum, eval) => sum + eval.score, 0);
    const maxScore = session.evaluations.reduce((sum, eval) => sum + eval.maxScore, 0);
    const percentage = Math.round((totalScore / maxScore) * 100);

    return {
      overallScore: percentage,
      recommendation: percentage >= 85 ? "Strong Hire" : percentage >= 75 ? "Hire" : "Maybe",
      summary: `Strong technical performance with good problem-solving abilities.`,
      technicalStrengths: ["JavaScript fundamentals", "Problem-solving approach"],
      areasForImprovement: ["System design", "More specific examples"],
      skillAssessment: {
        javascript: percentage,
        react: percentage - 5,
        nodejs: percentage - 10,
        problemSolving: percentage,
        communication: percentage + 5
      },
      detailedFeedback: `Consistent performance across difficulty levels with clear communication.`,
      nextSteps: ["Technical team interview", "Cultural fit assessment"],
      interviewerNotes: `Recommended for next round.`,
      generatedAt: new Date().toISOString()
    };
  }
}

export default new InterviewService();