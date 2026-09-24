import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  HelpCircle,
  CheckCircle2,
  XCircle,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Award,
  Zap,
  BookOpen,
  BrainCircuit,
  Sparkles,
  Bot,
  AlertTriangle,
  ShieldCheck
} from 'lucide-react';
import { fetchQuizByCourseId, submitCourseQuiz } from '../services/api';
import { AuthContext } from '../context/AuthContext';

export default function QuizPage() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user, refreshUser, openAuthModal } = useContext(AuthContext);

  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState({});
  const [currentIdx, setCurrentIdx] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchQuizByCourseId(courseId)
      .then((res) => {
        setQuiz(res.data);
      })
      .catch((err) => console.error('Error fetching quiz:', err))
      .finally(() => setLoading(false));
  }, [courseId]);

  const questions = quiz?.questions || [];
  const currentQuestion = questions[currentIdx];

  const handleSelectOption = (idx) => {
    if (submitted) return;
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: idx,
    }));
  };

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(currentIdx + 1);
    }
  };

  const handlePrev = () => {
    if (currentIdx > 0) {
      setCurrentIdx(currentIdx - 1);
    }
  };

  const handleSubmitQuiz = async () => {
    if (!user) {
      openAuthModal();
      return;
    }
    setSubmitting(true);
    try {
      const res = await submitCourseQuiz(courseId, { answers });
      setResults(res.data);
      setSubmitted(true);
      refreshUser();
    } catch (err) {
      console.error('Failed to submit quiz:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleRetake = () => {
    setAnswers({});
    setSubmitted(false);
    setResults(null);
    setCurrentIdx(0);
  };

  if (loading) {
    return (
      <div className="p-8 max-w-3xl mx-auto space-y-6 animate-pulse">
        <div className="h-8 bg-slate-200 rounded w-1/3" />
        <div className="h-64 bg-slate-200 rounded-2xl" />
      </div>
    );
  }

  if (!quiz || questions.length === 0) {
    return (
      <div className="p-12 text-center max-w-lg mx-auto">
        <HelpCircle size={40} className="mx-auto text-slate-400 mb-3" />
        <h2 className="text-lg font-bold text-slate-800">No Quiz Found</h2>
        <p className="text-xs text-slate-500 mt-1">There are no quiz questions available for this course yet.</p>
        <Link
          to={`/courses/${courseId}`}
          className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:underline"
        >
          ← Return to Course
        </Link>
      </div>
    );
  }

  // Submitted Scorecard View
  if (submitted && results) {
    const correctQuestions = results.results?.filter((r) => r.is_correct) || [];
    const incorrectQuestions = results.results?.filter((r) => !r.is_correct) || [];

    return (
      <div className="p-4 sm:p-8 max-w-3xl mx-auto space-y-8 animate-fade-in">
        {/* Scorecard Hero */}
        <div
          className={`rounded-3xl p-6 sm:p-10 text-center border relative overflow-hidden ${
            results.passed
              ? 'bg-gradient-to-b from-emerald-900 to-slate-900 text-white border-emerald-800'
              : 'bg-gradient-to-b from-amber-900 to-slate-900 text-white border-amber-800'
          }`}
        >
          <div className="inline-flex p-3 bg-white/10 rounded-2xl backdrop-blur-md mb-3">
            <Award size={32} className={results.passed ? 'text-emerald-400' : 'text-amber-400'} />
          </div>

          <span className="block text-xs font-bold uppercase tracking-wider text-slate-300">
            {results.passed ? 'Knowledge Verified 🎉' : 'Needs Review'}
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mt-1">{results.percentage}%</h1>
          <p className="text-sm text-slate-300 mt-2 max-w-md mx-auto">
            {results.passed
              ? `Great job! You scored ${results.score} out of ${results.total} correct. Your mastery progress has been updated.`
              : `You scored ${results.score} out of ${results.total}. Review your weaknesses below and use the AI Co-Pilot to strengthen your startup concept.`}
          </p>

          <div className="inline-flex items-center gap-2 mt-4 px-3.5 py-1.5 bg-white/10 backdrop-blur-md rounded-full text-xs font-bold text-amber-300">
            <Zap size={15} /> +{results.xp_earned} Founder XP Earned
          </div>
        </div>

        {/* Immediate Strengths & Weaknesses Intelligence Card */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Your Knowledge Strengths & Weaknesses</h3>
              <p className="text-xs text-slate-500">Based on your decision-making in this scenario quiz</p>
            </div>
            <Link
              to={`/copilot?weakness=${encodeURIComponent(
                incorrectQuestions.length > 0 ? 'Scenario Decision Mistakes' : 'Pricing & Scaling'
              )}`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition"
            >
              <Bot size={14} />
              <span>Workshop in AI Co-Pilot</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Strengths */}
            <div className="p-4 bg-emerald-50/60 border border-emerald-200/80 rounded-2xl space-y-2">
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck size={16} className="text-emerald-600" /> Confirmed Strengths ({correctQuestions.length})
              </span>
              <ul className="space-y-1.5 text-xs text-emerald-950 font-medium">
                {correctQuestions.length > 0 ? (
                  correctQuestions.map((q, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <CheckCircle2 size={13} className="text-emerald-500 shrink-0 mt-0.5" />
                      <span className="line-clamp-2">{q.question}</span>
                    </li>
                  ))
                ) : (
                  <p className="text-xs text-slate-500">Review lesson modules to build core strength.</p>
                )}
              </ul>
            </div>

            {/* Weaknesses */}
            <div className="p-4 bg-amber-50/60 border border-amber-200/80 rounded-2xl space-y-2">
              <span className="text-xs font-bold text-amber-800 uppercase tracking-wider flex items-center gap-1.5">
                <AlertTriangle size={16} className="text-amber-600" /> Identified Weaknesses ({incorrectQuestions.length})
              </span>
              <ul className="space-y-1.5 text-xs text-amber-950 font-medium">
                {incorrectQuestions.length > 0 ? (
                  incorrectQuestions.map((q, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0 mt-1.5" />
                      <span className="line-clamp-2">{q.question}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-xs text-emerald-700 font-bold">
                    Zero mistakes! You demonstrated complete mastery of this topic.
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>

        {/* Question by Question Detailed Explanations */}
        <div className="space-y-4">
          <h3 className="text-base font-bold text-slate-900">Investor Insights & Question Teardown</h3>
          {results.results?.map((res, idx) => (
            <div
              key={res.id}
              className={`p-5 rounded-2xl border transition ${
                res.is_correct ? 'bg-white border-emerald-200' : 'bg-white border-rose-200'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  {res.is_correct ? (
                    <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
                  ) : (
                    <XCircle size={18} className="text-rose-600 shrink-0" />
                  )}
                </div>
                <div className="space-y-2 flex-1">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Question {idx + 1}
                  </p>
                  <p className="text-sm font-semibold text-slate-900">{res.question}</p>

                  <div className="p-3.5 bg-slate-50 rounded-xl text-xs space-y-1">
                    <p className="font-medium text-slate-700 leading-relaxed">
                      <span className="font-bold text-indigo-900">Investor Insight:</span> {res.explanation}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Actions Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-200">
          <button
            onClick={handleRetake}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition cursor-pointer"
          >
            <RotateCcw size={15} /> Retake Quiz
          </button>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Link
              to={`/courses/${courseId}`}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl transition"
            >
              <BookOpen size={15} /> Back to Course
            </Link>
            <Link
              to="/copilot"
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition"
            >
              <Bot size={15} /> AI Co-Pilot
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Active Taking Quiz View
  const answeredCount = Object.keys(answers).length;
  const isAllAnswered = answeredCount === questions.length;
  const selectedOptionIndex = answers[currentQuestion.id];

  return (
    <div className="p-4 sm:p-8 max-w-3xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link
          to={`/courses/${courseId}`}
          className="flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-800 transition"
        >
          <ArrowLeft size={14} /> Back to Course
        </Link>
        <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-100">
          {quiz.course_title}
        </span>
      </div>

      {/* Progress Counter */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex items-center justify-between">
        <div>
          <span className="text-xs text-slate-400 font-semibold block uppercase tracking-wider">Progress</span>
          <span className="text-sm font-bold text-slate-800">
            Question {currentIdx + 1} of {questions.length}
          </span>
        </div>
        <div className="text-right">
          <span className="text-xs text-slate-400 font-semibold block uppercase tracking-wider">Answered</span>
          <span className="text-sm font-bold text-indigo-600">
            {answeredCount} / {questions.length}
          </span>
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-6">
        <div className="space-y-2">
          <span className="inline-block text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
            Scenario Challenge
          </span>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
            {currentQuestion.question}
          </h2>
        </div>

        {/* Options List */}
        <div className="space-y-3">
          {currentQuestion.options?.map((opt, optIdx) => {
            const isSelected = selectedOptionIndex === optIdx;
            return (
              <button
                key={optIdx}
                onClick={() => handleSelectOption(optIdx)}
                className={`w-full text-left p-4 rounded-2xl border text-xs sm:text-sm font-medium transition cursor-pointer flex items-start gap-3 ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50/70 text-indigo-950 font-semibold shadow-xs'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                    isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {String.fromCharCode(65 + optIdx)}
                </div>
                <span className="pt-0.5 leading-relaxed">{opt}</span>
              </button>
            );
          })}
        </div>

        {/* Bottom Question Controls */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <button
            onClick={handlePrev}
            disabled={currentIdx === 0}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 disabled:opacity-30 disabled:pointer-events-none px-3 py-2 rounded-xl transition cursor-pointer"
          >
            <ArrowLeft size={14} /> Previous
          </button>

          {currentIdx < questions.length - 1 ? (
            <button
              onClick={handleNext}
              className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition cursor-pointer"
            >
              <span>Next Question</span> <ArrowRight size={14} />
            </button>
          ) : (
            <button
              onClick={handleSubmitQuiz}
              disabled={submitting || !isAllAnswered}
              className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition disabled:opacity-40 cursor-pointer"
            >
              <Award size={15} />
              <span>{submitting ? 'Evaluating...' : 'Submit & View Strengths'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
