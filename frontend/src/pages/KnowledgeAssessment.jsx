import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import {
  BrainCircuit,
  Award,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  RotateCcw,
  BookOpen,
  Zap,
  ShieldCheck,
  TrendingUp,
  Layers,
  Lightbulb,
  Compass,
  ArrowUpRight
} from 'lucide-react';
import { Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import {
  fetchDiagnosticQuestions,
  fetchLatestAssessment,
  submitDiagnostic,
} from '../services/api';
import { AuthContext } from '../context/AuthContext';

// Register Chart.js components
ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

export default function KnowledgeAssessment() {
  const { user, refreshUser, openAuthModal } = useContext(AuthContext);

  const [mode, setMode] = useState('loading'); // 'report' | 'test' | 'loading'
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [report, setReport] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    // 1. Fetch latest assessment report if user has one
    fetchLatestAssessment()
      .then((res) => {
        if (res.data) {
          setReport(res.data);
          setMode('report');
        } else {
          loadQuestions();
        }
      })
      .catch(() => {
        loadQuestions();
      });
  }, []);

  const loadQuestions = () => {
    fetchDiagnosticQuestions()
      .then((res) => {
        setQuestions(res.data || []);
        setMode('test');
      })
      .catch((err) => console.error('Error fetching questions:', err));
  };

  const handleSelectOption = (qId, optionIdx) => {
    setAnswers((prev) => ({
      ...prev,
      [qId]: optionIdx,
    }));
  };

  const handleSubmit = async () => {
    if (!user) {
      openAuthModal();
      return;
    }
    setSubmitting(true);
    try {
      const res = await submitDiagnostic({ answers });
      setReport(res.data);
      setMode('report');
      refreshUser();
    } catch (err) {
      console.error('Failed to submit diagnostic:', err);
    } finally {
      setSubmitting(false);
    }
  };

  // Build Radar Chart Data
  const radarChartData = report?.radar_data
    ? {
        labels: report.radar_data.map((d) => d.label),
        datasets: [
          {
            label: 'Your Founder Strength (%)',
            data: report.radar_data.map((d) => d.score),
            backgroundColor: 'rgba(99, 102, 241, 0.25)',
            borderColor: 'rgba(79, 70, 229, 1)',
            borderWidth: 2.5,
            pointBackgroundColor: 'rgba(79, 70, 229, 1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(79, 70, 229, 1)',
            pointRadius: 4,
          },
        ],
      }
    : null;

  const radarOptions = {
    scales: {
      r: {
        angleLines: { color: 'rgba(148, 163, 184, 0.2)' },
        grid: { color: 'rgba(148, 163, 184, 0.2)' },
        pointLabels: {
          font: { size: 11, weight: '600', family: 'system-ui' },
          color: '#334155',
        },
        suggestedMin: 0,
        suggestedMax: 100,
        ticks: { stepSize: 25, backdropColor: 'transparent', color: '#94a3b8', font: { size: 10 } },
      },
    },
    plugins: {
      legend: { display: false },
    },
    maintainAspectRatio: false,
  };

  if (mode === 'loading') {
    return (
      <div className="p-8 max-w-6xl mx-auto space-y-6 animate-pulse">
        <div className="h-10 bg-slate-200 rounded w-1/3" />
        <div className="h-96 bg-slate-200 rounded-3xl" />
      </div>
    );
  }

  // ================= REPORT VIEW =================
  if (mode === 'report' && report) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8 animate-fade-in">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold rounded-full mb-2">
              <BrainCircuit size={14} /> Founder Strength Diagnostic
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Your Entrepreneurial Strength Profile
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Multi-dimensional evaluation across the 6 core pillars of venture building.
            </p>
          </div>

          <button
            onClick={() => {
              setAnswers({});
              loadQuestions();
            }}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl shadow-2xs transition cursor-pointer"
          >
            <RotateCcw size={14} /> Retake Diagnostic
          </button>
        </div>

        {/* Hero Cards Grid: Overall Score + Archetype + Radar Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Overall Readiness & Archetype */}
          <div className="lg:col-span-5 space-y-6">
            {/* Readiness Index */}
            <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-indigo-950 text-white p-6 sm:p-8 rounded-3xl shadow-lg border border-indigo-800 relative overflow-hidden">
              <div className="absolute -right-8 -top-8 w-40 h-40 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none" />

              <span className="text-xs font-bold uppercase tracking-wider text-indigo-300 block">
                Overall Founder Readiness
              </span>
              <div className="flex items-baseline gap-3 mt-1">
                <span className="text-5xl font-extrabold tracking-tight">{report.overall_score}%</span>
                <span className="text-xs font-bold text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-800">
                  {report.readiness_level}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-3 leading-relaxed">
                Evaluated across Market Validation, Product Velocity, Unit Economics, Growth Loops,
                Fundraising, and Execution Resilience.
              </p>
            </div>

            {/* Founder Archetype Card */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-indigo-600 text-xs font-bold uppercase tracking-wider">
                <Compass size={16} /> Identified Founder Archetype
              </div>
              <h3 className="text-xl font-extrabold text-slate-900">{report.archetype}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{report.archetype_summary}</p>
            </div>
          </div>

          {/* Right Column: Interactive Radar Spider Chart */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Sparkles size={16} className="text-amber-500" /> 6-Pillar Strength Radar
              </h3>
              <span className="text-xs text-slate-400 font-semibold">Scale: 0 - 100%</span>
            </div>

            <div className="h-72 sm:h-80 w-full relative">
              {radarChartData && <Radar data={radarChartData} options={radarOptions} />}
            </div>
          </div>
        </div>

        {/* 6 Dimension Mastery Cards */}
        <div className="space-y-4">
          <h3 className="text-base font-bold text-slate-900">Dimension Score Breakdown</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {report.radar_data?.map((dim) => (
              <div
                key={dim.key}
                className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-2 text-center"
              >
                <span className="text-[11px] font-bold text-slate-500 line-clamp-1">{dim.label}</span>
                <p className="text-2xl font-extrabold text-slate-900">{dim.score}%</p>
                <span
                  className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    dim.status === 'Excellent'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : dim.status === 'Proficient'
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}
                >
                  {dim.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Strengths & Blindspots Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Strengths */}
          <div className="bg-white p-6 rounded-3xl border border-emerald-200/80 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-emerald-700 text-xs font-bold uppercase tracking-wider">
              <ShieldCheck size={18} /> Verified Superpowers
            </div>
            <ul className="space-y-2">
              {report.strengths?.length > 0 ? (
                report.strengths.map((s, idx) => (
                  <li key={idx} className="flex items-center gap-2.5 text-xs text-slate-700 font-medium">
                    <CheckCircle2 size={15} className="text-emerald-500 shrink-0" />
                    <span>{s}</span>
                  </li>
                ))
              ) : (
                <p className="text-xs text-slate-500">Continue building experience across early pillars.</p>
              )}
            </ul>
          </div>

          {/* Blindspots */}
          <div className="bg-white p-6 rounded-3xl border border-amber-200/80 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-amber-700 text-xs font-bold uppercase tracking-wider">
              <AlertTriangle size={18} /> Critical Growth Areas (Blindspots)
            </div>
            <ul className="space-y-2">
              {report.blindspots?.length > 0 ? (
                report.blindspots.map((b, idx) => (
                  <li key={idx} className="flex items-center gap-2.5 text-xs text-slate-700 font-medium">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                    <span>{b}</span>
                  </li>
                ))
              ) : (
                <li className="text-xs text-emerald-600 font-medium">
                  No acute blindspots identified! Ready for venture execution.
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Tailored Course Recommendations */}
        {report.recommended_courses && report.recommended_courses.length > 0 && (
          <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles size={14} className="text-amber-400" /> Targeted Recommendation
                </span>
                <h3 className="text-lg sm:text-xl font-bold mt-1">
                  Tailored Courses to Boost Your Lowest-Scoring Pillars
                </h3>
              </div>
              <Link
                to="/courses"
                className="text-xs font-bold text-indigo-300 hover:text-white flex items-center gap-1 transition"
              >
                Browse all courses <ArrowRight size={14} />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {report.recommended_courses.map((rc) => (
                <div
                  key={rc.id}
                  className="bg-white/10 border border-white/15 rounded-2xl p-5 flex items-center justify-between gap-4 hover:bg-white/15 transition"
                >
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-indigo-500/40 text-indigo-200 px-2 py-0.5 rounded">
                      {rc.category} · {rc.difficulty}
                    </span>
                    <h4 className="text-sm font-bold text-white line-clamp-1">{rc.title}</h4>
                    <p className="text-[11px] text-slate-300">{rc.duration} · ⭐ {rc.rating}</p>
                  </div>
                  <Link
                    to={`/courses/${rc.id}`}
                    className="shrink-0 px-3.5 py-2 bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center gap-1"
                  >
                    <span>Take Course</span>
                    <ArrowUpRight size={14} />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // ================= ACTIVE TEST VIEW =================
  const answeredCount = Object.keys(answers).length;
  const isReadyToSubmit = answeredCount === questions.length;

  return (
    <div className="p-4 sm:p-8 max-w-4xl mx-auto space-y-8 animate-fade-in">
      {/* Header Banner */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex p-3 bg-indigo-50 text-indigo-600 rounded-2xl mb-1">
          <BrainCircuit size={28} />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Entrepreneurial Knowledge Strength Diagnostic
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">
          Answer 12 real-world startup dilemma scenarios across 6 core pillars to discover your Founder
          Archetype, radar dimensions, and blindspots.
        </p>
      </div>

      {/* Progress Counter */}
      <div className="sticky top-20 z-30 bg-white/90 backdrop-blur-md p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-700">Questions Answered:</span>
          <span className="text-xs font-extrabold text-indigo-600">
            {answeredCount} of {questions.length}
          </span>
        </div>

        <div className="w-48 h-2.5 bg-slate-100 rounded-full overflow-hidden hidden sm:block">
          <div
            className="h-full bg-indigo-600 rounded-full transition-all duration-300"
            style={{ width: `${(answeredCount / (questions.length || 1)) * 100}%` }}
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={submitting || !isReadyToSubmit}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition disabled:opacity-40 cursor-pointer"
        >
          {submitting ? 'Generating Report...' : 'Calculate Strengths'}
        </button>
      </div>

      {/* Questions List */}
      <div className="space-y-6">
        {questions.map((q, qIdx) => {
          const selectedOption = answers[q.id];
          return (
            <div
              key={q.id}
              className="bg-white rounded-3xl border border-slate-200 shadow-2xs p-6 sm:p-8 space-y-4"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-100">
                  Pillar: {q.pillar}
                </span>
                <span className="text-xs font-semibold text-slate-400">
                  Scenario {qIdx + 1} of {questions.length}
                </span>
              </div>

              <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                {q.question}
              </h3>

              <div className="space-y-2.5">
                {q.options?.map((opt, optIdx) => {
                  const isSelected = selectedOption === optIdx;
                  return (
                    <button
                      key={optIdx}
                      onClick={() => handleSelectOption(q.id, optIdx)}
                      className={`w-full text-left p-3.5 rounded-xl border text-xs sm:text-sm font-medium transition cursor-pointer flex items-start gap-3 ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-50/80 text-indigo-950 font-semibold shadow-xs'
                          : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
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
            </div>
          );
        })}
      </div>

      {/* Bottom Submit Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 text-center space-y-3">
        <h3 className="text-lg font-bold">Ready to reveal your Founder Strength Radar?</h3>
        <p className="text-xs text-slate-300 max-w-md mx-auto">
          {isReadyToSubmit
            ? 'All scenarios completed! Click below to compute your scores and archetype.'
            : `Please complete all questions (${questions.length - answeredCount} remaining) to generate your report.`}
        </p>
        <button
          onClick={handleSubmit}
          disabled={submitting || !isReadyToSubmit}
          className="px-6 py-3 bg-indigo-500 hover:bg-indigo-600 text-white text-xs sm:text-sm font-bold rounded-xl shadow-lg transition disabled:opacity-40 cursor-pointer"
        >
          {submitting ? 'Generating Diagnosis...' : 'View My Strength Profile & Radar (+200 XP)'}
        </button>
      </div>
    </div>
  );
}
