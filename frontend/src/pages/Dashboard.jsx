import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  BrainCircuit,
  Award,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Search,
  Layers,
  Compass,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Zap,
  Plus,
  ArrowUpRight,
  Bot,
  MessageSquare,
  Activity,
  ShieldCheck
} from 'lucide-react';
import { fetchProjects, fetchCourses, fetchUserIntelligence } from '../services/api';
import { AuthContext } from '../context/AuthContext';

export default function Dashboard() {
  const { user } = useContext(AuthContext);

  const [projects, setProjects] = useState([]);
  const [courses, setCourses] = useState([]);
  const [intelligence, setIntelligence] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetchProjects().catch(() => ({ data: [] })),
      fetchCourses().catch(() => ({ data: [] })),
      fetchUserIntelligence().catch(() => ({ data: null })),
    ])
      .then(([projRes, courseRes, intelRes]) => {
        setProjects(projRes.data || []);
        setCourses(courseRes.data || []);
        setIntelligence(intelRes.data);
      })
      .finally(() => setLoading(false));
  }, []);

  const enrolledCourses = courses.filter((c) => c.is_enrolled);

  const copilotShortcuts = [
    {
      title: 'Raise Market Value',
      desc: 'How to 3x-5x pricing power, command premium tiers, and quantify ROI.',
      mode: 'raise_value',
      icon: TrendingUp,
      badge: 'Pricing & Value',
      badgeColor: 'bg-emerald-100 text-emerald-800',
      iconColor: 'bg-emerald-600 text-white',
    },
    {
      title: 'Research Market Problems',
      desc: 'Uncover acute hair-on-fire customer pain and conduct Mom-Test interviews.',
      mode: 'market_problems',
      icon: Search,
      badge: 'Discovery',
      badgeColor: 'bg-blue-100 text-blue-800',
      iconColor: 'bg-blue-600 text-white',
    },
    {
      title: 'Add Unique 10x Feature',
      desc: 'Brainstorm proprietary data flywheels, ambient workflows, and anti-copy moats.',
      mode: 'unique_feature',
      icon: Layers,
      badge: 'Defensibility',
      badgeColor: 'bg-violet-100 text-violet-800',
      iconColor: 'bg-violet-600 text-white',
    },
    {
      title: 'Make Product Stand Out',
      desc: 'Category creation, positioning against incumbents, and copyable hooks.',
      mode: 'standout',
      icon: Compass,
      badge: 'Positioning',
      badgeColor: 'bg-amber-100 text-amber-800',
      iconColor: 'bg-amber-600 text-white',
    },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-10 animate-fade-in font-sans">
      {/* 1. Hero Section: Welcome & Guided 4-Step Founder Roadmap */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 lg:p-10 shadow-xl border border-slate-800 space-y-8 relative overflow-hidden">
        <div className="absolute -right-12 -top-12 w-80 h-80 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-1/3 -bottom-12 w-64 h-64 bg-violet-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Hero Top Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white/10 backdrop-blur-md rounded-full text-xs font-bold text-amber-300 border border-white/10">
              <Sparkles size={14} className="text-amber-400" />
              <span>Founder Acceleration Roadmap</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight">
              Welcome back, {user?.name || 'Founder'}!
            </h1>
            <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
              Your step-by-step startup journey: Learn essential playbooks, test your decisions with scenario quizzes,
              diagnose critical blindspots, and workshop your product with the AI Co-Pilot.
            </p>
          </div>

          {/* Gamified Badges */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-2xl border border-white/15 text-xs font-bold text-white flex items-center gap-2 shadow-xs">
              <Flame size={16} className="text-amber-400 fill-amber-400" />
              <span>{user?.streak || 4}d Streak</span>
            </div>
            <div className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-2xl border border-white/15 text-xs font-bold text-white flex items-center gap-2 shadow-xs">
              <Zap size={16} className="text-violet-400 fill-violet-400" />
              <span>{user?.xp || 775} Founder XP</span>
            </div>
          </div>
        </div>

        {/* 4-Step Interactive Stepper */}
        <div className="relative z-10 pt-2 border-t border-white/10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Step 1 */}
            <Link
              to="/courses"
              className="p-4 bg-white/10 hover:bg-white/15 rounded-2xl border border-white/15 transition-all duration-200 flex items-center justify-between group shadow-xs cursor-pointer"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-500/40 text-white flex items-center justify-center font-extrabold text-sm shrink-0 group-hover:scale-105 transition">
                  1
                </div>
                <div>
                  <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider block">Step 1</span>
                  <span className="text-sm font-bold text-white group-hover:text-amber-300 transition block">
                    Explore Courses
                  </span>
                  <span className="text-xs text-slate-300">Ideation, MVP & Finance</span>
                </div>
              </div>
              <ArrowRight size={16} className="text-slate-400 group-hover:text-white transition group-hover:translate-x-0.5" />
            </Link>

            {/* Step 2 */}
            <Link
              to="/courses/1"
              className="p-4 bg-white/10 hover:bg-white/15 rounded-2xl border border-white/15 transition-all duration-200 flex items-center justify-between group shadow-xs cursor-pointer"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500/40 text-white flex items-center justify-center font-extrabold text-sm shrink-0 group-hover:scale-105 transition">
                  2
                </div>
                <div>
                  <span className="text-xs font-bold text-amber-300 uppercase tracking-wider block">Step 2</span>
                  <span className="text-sm font-bold text-white group-hover:text-amber-300 transition block">
                    Take Quizzes
                  </span>
                  <span className="text-xs text-slate-300">Scenario decision tests</span>
                </div>
              </div>
              <ArrowRight size={16} className="text-slate-400 group-hover:text-white transition group-hover:translate-x-0.5" />
            </Link>

            {/* Step 3 */}
            <Link
              to="/assessment"
              className="p-4 bg-white/10 hover:bg-white/15 rounded-2xl border border-white/15 transition-all duration-200 flex items-center justify-between group shadow-xs cursor-pointer"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/40 text-white flex items-center justify-center font-extrabold text-sm shrink-0 group-hover:scale-105 transition">
                  3
                </div>
                <div>
                  <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider block">Step 3</span>
                  <span className="text-sm font-bold text-white group-hover:text-amber-300 transition block">
                    Track Weaknesses
                  </span>
                  <span className="text-xs text-slate-300">6-pillar radar score</span>
                </div>
              </div>
              <ArrowRight size={16} className="text-slate-400 group-hover:text-white transition group-hover:translate-x-0.5" />
            </Link>

            {/* Step 4 */}
            <Link
              to="/copilot"
              className="p-4 bg-white/10 hover:bg-white/15 rounded-2xl border border-white/15 transition-all duration-200 flex items-center justify-between group shadow-xs cursor-pointer"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-violet-500/40 text-white flex items-center justify-center font-extrabold text-sm shrink-0 group-hover:scale-105 transition">
                  4
                </div>
                <div>
                  <span className="text-xs font-bold text-violet-300 uppercase tracking-wider block">Step 4</span>
                  <span className="text-sm font-bold text-white group-hover:text-amber-300 transition block">
                    AI Co-Pilot
                  </span>
                  <span className="text-xs text-slate-300">Raise value & stand out</span>
                </div>
              </div>
              <ArrowRight size={16} className="text-slate-400 group-hover:text-white transition group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Balanced Section: Founder Readiness & Knowledge Strengths & Blindspots */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Card: Founder Readiness Score & Archetype */}
        <div className="lg:col-span-5 bg-white p-6 sm:p-7 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                <Award size={16} className="text-indigo-600" />
                Founder Readiness Status
              </span>
              <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                High Readiness
              </span>
            </div>

            {/* Readiness Index Metric Card */}
            <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl flex items-center justify-between gap-4">
              <div>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                  Overall Readiness Index
                </span>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-3xl sm:text-4xl font-black text-slate-900">
                    {intelligence?.overall_readiness || 100}%
                  </span>
                  <span className="text-xs font-bold text-indigo-600">Venture Scale</span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                  Pillars Evaluated
                </span>
                <span className="text-sm font-bold text-slate-800">6 of 6 Pillars</span>
              </div>
            </div>

            {/* Archetype Description */}
            <div className="p-4 bg-indigo-50/70 border border-indigo-100 rounded-2xl space-y-1.5">
              <span className="text-xs font-bold text-indigo-900 uppercase tracking-wider flex items-center gap-1.5">
                <Compass size={15} className="text-indigo-600" />
                Verified Archetype: {intelligence?.archetype || 'The Renaissance Founder'}
              </span>
              <p className="text-xs text-indigo-950 leading-relaxed font-medium">
                Strong balanced intuition across market discovery, product development, unit economics, and venture storytelling.
              </p>
            </div>
          </div>

          <Link
            to="/assessment"
            className="w-full py-3 px-4 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-bold text-xs sm:text-sm rounded-xl shadow-2xs flex items-center justify-center gap-2 transition"
          >
            <span>View 6-Pillar Radar Diagnostic</span>
            <ArrowUpRight size={15} />
          </Link>
        </div>

        {/* Right Card: Knowledge Strengths & Blindspots */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-7 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">Knowledge Strengths & Blindspots</h3>
                <p className="text-xs text-slate-600 mt-0.5">
                  Continuously updated from your quiz decisions and diagnostic evaluations
                </p>
              </div>
              <Link
                to={`/copilot?weakness=${encodeURIComponent(intelligence?.weaknesses?.[0] || 'Unit Economics & Pricing Power')}`}
                className="shrink-0 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 transition cursor-pointer"
              >
                <Bot size={15} />
                <span>Fix Blindspots with AI Co-Pilot</span>
              </Link>
            </div>

            {/* Strengths & Weaknesses 2-Column Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Confirmed Strengths */}
              <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
                    <CheckCircle2 size={16} className="text-emerald-600" />
                    Confirmed Strengths
                  </span>
                  <span className="text-[11px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                    {intelligence?.strengths?.length || 2} Validated
                  </span>
                </div>
                <ul className="space-y-2 text-xs text-emerald-950 font-medium leading-relaxed">
                  {intelligence?.strengths?.slice(0, 3).map((s, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold shrink-0">•</span>
                      <span>{s}</span>
                    </li>
                  )) || (
                    <>
                      <li className="flex items-start gap-2">
                        <span className="text-emerald-600 font-bold">•</span>
                        <span>Market Problem Validation & Customer Discovery</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-emerald-600 font-bold">•</span>
                        <span>Rapid MVP Prototyping & Build-Measure-Learn</span>
                      </li>
                    </>
                  )}
                </ul>
              </div>

              {/* Focus Areas / Blindspots */}
              <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
                    <AlertTriangle size={16} className="text-amber-600" />
                    Focus Areas / Blindspots
                  </span>
                  <span className="text-[11px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                    {intelligence?.weaknesses?.length || 1} To Improve
                  </span>
                </div>
                <ul className="space-y-2 text-xs text-amber-950 font-medium leading-relaxed">
                  {intelligence?.weaknesses?.slice(0, 3).map((w, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-amber-600 font-bold shrink-0">•</span>
                      <span>{w}</span>
                    </li>
                  )) || (
                    <li className="flex items-start gap-2">
                      <span className="text-amber-600 font-bold">•</span>
                      <span>Unit Economics & Pricing Power Optimization</span>
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Quizzes completed: {intelligence?.quizzes_taken || 1}</span>
            <Link to="/courses" className="text-indigo-600 font-bold hover:underline">
              Take another quiz →
            </Link>
          </div>
        </div>
      </div>

      {/* 3. AI Startup Co-Pilot Quick Launcher */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider flex items-center gap-1.5">
              <Bot size={15} />
              AI Venture Co-Pilot
            </span>
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 mt-0.5">
              Workshop Your Startup with AI
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
              Select any strategic challenge to generate tailored tactical playbooks for your venture
            </p>
          </div>
          <Link
            to="/copilot"
            className="text-xs sm:text-sm font-bold text-indigo-600 hover:text-indigo-700 hover:underline flex items-center gap-1"
          >
            <span>Open Co-Pilot Workspace</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {copilotShortcuts.map((sc) => {
            const Icon = sc.icon;
            return (
              <Link
                key={sc.mode}
                to={`/copilot?mode=${sc.mode}`}
                className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col justify-between space-y-4 group cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div className={`p-2.5 rounded-xl ${sc.iconColor} shadow-xs`}>
                    <Icon size={18} />
                  </div>
                  <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${sc.badgeColor}`}>
                    {sc.badge}
                  </span>
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition">
                    {sc.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{sc.desc}</p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-indigo-600">
                  <span>Generate Strategy</span>
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* 4. Startup Academy Courses Shelf */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">Curated Startup Playbooks</h2>
            <p className="text-xs sm:text-sm text-slate-600">6 actionable entrepreneurship courses with scenario quizzes</p>
          </div>
          <Link
            to="/courses"
            className="text-xs sm:text-sm font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
          >
            <span>View All Courses</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {courses.slice(0, 3).map((c) => (
            <div
              key={c.id}
              className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col justify-between space-y-4 hover:shadow-md transition"
            >
              <div className="space-y-2.5">
                <div className="flex justify-between items-start">
                  <span className="text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 px-2.5 py-1 rounded-lg">
                    {c.category} · {c.difficulty}
                  </span>
                  {c.is_enrolled && (
                    <span className="text-xs font-extrabold text-indigo-600">
                      {c.progress_percent}% Complete
                    </span>
                  )}
                </div>
                <h3 className="text-base font-bold text-slate-900 leading-snug">{c.title}</h3>
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">{c.description}</p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <Link
                  to={`/quiz/${c.id}`}
                  className="text-xs font-bold text-amber-600 hover:text-amber-700 hover:underline"
                >
                  Take Quiz
                </Link>
                <Link
                  to={`/courses/${c.id}`}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition"
                >
                  <span>{c.is_enrolled ? 'Continue' : 'Start Course'}</span>
                  <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Incubator Startups & Pitch Practice */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">Your Incubator Startups</h2>
            <p className="text-xs sm:text-sm text-slate-600">Auto-generated Lean Canvases and AI Investor Pitch Simulator</p>
          </div>
          <Link
            to="/create"
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 transition"
          >
            <Plus size={14} />
            <span>Launch New Startup Idea</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {projects.map((p) => {
            const pId = p.id || p._id;
            return (
              <div
                key={pId}
                className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md transition flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <h3 className="font-extrabold text-slate-900 text-lg">{p.title}</h3>
                    <span className="text-xs bg-indigo-50 text-indigo-700 border border-indigo-100 px-3 py-0.5 rounded-full font-bold">
                      {p.industry_category || p.industryCategory || 'Tech'}
                    </span>
                  </div>
                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                    {p.idea_description || p.ideaDescription}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <Link
                    to={`/copilot?mode=standout`}
                    className="text-xs font-bold text-violet-700 hover:text-violet-900 hover:underline flex items-center gap-1"
                  >
                    <Bot size={14} />
                    <span>Workshop in AI Co-Pilot</span>
                  </Link>

                  <div className="flex items-center gap-2">
                    <Link
                      to={`/pitch-simulator/${pId}`}
                      className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl hover:bg-emerald-100 transition flex items-center gap-1"
                    >
                      <MessageSquare size={13} />
                      <span>Pitch to VC</span>
                    </Link>
                    <Link
                      to={`/project/${pId}`}
                      className="text-xs font-bold text-indigo-600 hover:underline px-2 py-1.5"
                    >
                      View Canvas →
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}