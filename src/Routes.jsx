import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import ErrorBoundary from "./components/ErrorBoundary";
import NotFound from "./pages/NotFound";
import CandidateProfile from './pages/candidate-profile';
import InterviewQuestions from './pages/interview-questions';
import InterviewerDashboard from './pages/interviewer-dashbaord';
import InterviewComplete from './pages/interview-complete';
import WelcomeBackModal from './pages/welcome-back-modal';
import ResumeUpload from './pages/resume-upload';

const Routes = () => {
  return (
    <BrowserRouter>
      <div className="w-full min-h-screen flex flex-col bg-background text-foreground">
        <ErrorBoundary>
          <ScrollToTop />
          <RouterRoutes>
            <Route path="/" element={<ResumeUpload />} />
            <Route path="/candidate-profile" element={<CandidateProfile />} />
            <Route path="/interview-questions" element={<InterviewQuestions />} />
            <Route path="/interviewer-dashboard" element={<InterviewerDashboard />} />
            <Route path="/interview-complete" element={<InterviewComplete />} />
            <Route path="/welcome-back-modal" element={<WelcomeBackModal />} />
            <Route path="/resume-upload" element={<ResumeUpload />} />
            <Route path="*" element={<NotFound />} />
          </RouterRoutes>
        </ErrorBoundary>
      </div>
    </BrowserRouter>
  );
};

export default Routes;
