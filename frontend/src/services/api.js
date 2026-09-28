import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1',
});

// Pass token dynamically with every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth
export const loginUser = (credentials) => API.post('/auth/login', credentials);
export const registerUser = (userData) => API.post('/auth/register', userData);
export const fetchCurrentUser = () => API.get('/auth/me');

// Courses
export const fetchCourses = (params) => API.get('/courses/', { params });
export const fetchCourseById = (id) => API.get(`/courses/${id}`);
export const enrollInCourse = (id) => API.post(`/courses/${id}/enroll`);
export const updateLessonProgress = (courseId, data) => API.post(`/courses/${courseId}/progress`, data);

// Quizzes
export const fetchQuizByCourseId = (courseId) => API.get(`/quizzes/${courseId}`);
export const submitCourseQuiz = (courseId, data) => API.post(`/quizzes/${courseId}/submit`, data);

// Knowledge Strength Diagnostic Assessment
export const fetchDiagnosticQuestions = () => API.get('/assessment/questions');
export const fetchLatestAssessment = () => API.get('/assessment/latest');
export const submitDiagnostic = (data) => API.post('/assessment/submit', data);

// AI Startup Co-Pilot (Raise Value, Market Problems, Unique Feature, Standout)
export const fetchCopilotAdvice = (data) => API.post('/copilot/advice', data);
export const fetchUserIntelligence = () => API.get('/copilot/user-intelligence');

// Projects & Incubator
export const fetchProjects = () => API.get('/projects/');
export const fetchProjectById = (id) => API.get(`/projects/${id}`);
export const createProject = (data) => API.post('/projects/', data);
export const fetchLeanCanvas = (projectId) => API.get(`/ai/canvas/${projectId}`);
export const generateLeanCanvas = (data) => API.post('/ai/generate-canvas', data);

// Pitch Simulator
export const startPitchSession = (data) => API.post('/pitch/session/start', data);
export const sendPitchMessage = (sessionId, data) => API.post(`/pitch/session/${sessionId}/chat`, data);

export default API;