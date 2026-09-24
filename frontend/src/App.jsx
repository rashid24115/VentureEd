import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import AuthModal from './components/AuthModal';

// Pages
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import CoursesCatalogue from './pages/CoursesCatalogue';
import CourseDetail from './pages/CourseDetail';
import QuizPage from './pages/QuizPage';
import KnowledgeAssessment from './pages/KnowledgeAssessment';
import AiCopilot from './pages/AiCopilot';
import CreateProject from './pages/CreateProject';
import ProjectView from './pages/ProjectView';
import PitchSimulator from './pages/PitchSimulator';

function MainAppShell() {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // If user is not logged in, render the dedicated Login and Registration view first!
  if (!user) {
    return <AuthPage />;
  }

  return (
    <Router>
      <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col selection:bg-indigo-500 selection:text-white">
        <Navbar />
        <AuthModal />

        <div className="flex flex-1 w-full">
          <Sidebar />
          <main className="flex-1 w-full overflow-x-hidden min-h-[calc(100vh-4rem)]">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/courses" element={<CoursesCatalogue />} />
              <Route path="/courses/:id" element={<CourseDetail />} />
              <Route path="/quiz/:courseId" element={<QuizPage />} />
              <Route path="/assessment" element={<KnowledgeAssessment />} />
              <Route path="/copilot" element={<AiCopilot />} />
              <Route path="/create" element={<CreateProject />} />
              <Route path="/project/:id" element={<ProjectView />} />
              <Route path="/pitch-simulator/:projectId" element={<PitchSimulator />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainAppShell />
    </AuthProvider>
  );
}