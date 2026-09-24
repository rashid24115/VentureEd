import React, { useState, useContext } from 'react';
import {
  Rocket,
  Sparkles,
  LogIn,
  UserPlus,
  Lock,
  Mail,
  User,
  ShieldCheck,
  CheckCircle2,
  BrainCircuit,
  Bot,
  ArrowRight
} from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

export default function AuthPage() {
  const { login, demoLogin, register } = useContext(AuthContext);

  const [tab, setTab] = useState('login'); // 'login' | 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (tab === 'login') {
        await login(email, password);
      } else {
        await register(name, email, password);
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Authentication failed. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemo = async () => {
    setError(null);
    setLoading(true);
    try {
      await demoLogin();
    } catch (err) {
      setError('Failed to log in with demo account. Ensure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans">
      <div className="max-w-5xl w-full bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        {/* Left Side: Brand & Value Prop */}
        <div className="lg:col-span-6 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white p-8 sm:p-12 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute -right-16 -top-16 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute right-1/4 -bottom-16 w-64 h-64 bg-violet-500/20 rounded-full blur-3xl pointer-events-none" />

          <div className="space-y-6 relative z-10">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-gradient-to-tr from-indigo-600 to-violet-600 rounded-2xl text-white shadow-md shadow-indigo-500/30">
                <Rocket size={22} />
              </div>
              <div>
                <span className="font-extrabold text-2xl tracking-tight text-white">
                  Venture<span className="text-indigo-400">Ed</span>
                </span>
                <span className="block text-[11px] font-bold uppercase tracking-wider text-indigo-300">
                  AI Startup Academy & Incubator
                </span>
              </div>
            </div>

            <div className="space-y-3 pt-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-bold text-amber-300 border border-white/10">
                <Sparkles size={14} /> Founder Acceleration Platform
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight text-white">
                Master Startup Building From Validation to Scale
              </h1>
              <p className="text-sm text-slate-300 leading-relaxed">
                Browse curated entrepreneurship courses, test your decisions with realistic scenario quizzes, diagnose knowledge weaknesses, and workshop with your AI Co-Pilot.
              </p>
            </div>

            {/* Feature Highlights */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-200">
                <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                <span>6 Curated Playbooks (Ideation, Lean MVP, Financials & VC)</span>
              </div>
              <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-200">
                <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                <span>Scenario Quizzes with Instant Investor Insights</span>
              </div>
              <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-200">
                <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                <span>6-Pillar Radar Strength & Blindspot Intelligence</span>
              </div>
              <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-200">
                <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                <span>AI Co-Pilot: Raise Value, Research Market Problems & 10x Moats</span>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-white/10 text-xs text-slate-400 relative z-10 flex items-center justify-between">
            <span>Built for Modern Tech Founders</span>
            <span>v2.0 Platform</span>
          </div>
        </div>

        {/* Right Side: Authentication Form */}
        <div className="lg:col-span-6 p-8 sm:p-12 flex flex-col justify-center space-y-6">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {tab === 'login' ? 'Sign In to VentureEd' : 'Create Founder Account'}
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              {tab === 'login'
                ? 'Access your courses, quiz scores, and AI Startup Co-Pilot.'
                : 'Start your entrepreneurial journey with pre-seeded founder playbooks.'}
            </p>
          </div>

          {/* 1-Click Demo Founder Login Button */}
          <div className="bg-indigo-50/80 border border-indigo-200/80 rounded-2xl p-4 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-900 flex items-center gap-1.5">
                <ShieldCheck size={16} className="text-indigo-600" /> Instant Demo Access
              </span>
              <span className="text-[11px] font-bold bg-indigo-200/70 text-indigo-800 px-2.5 py-0.5 rounded-full">
                Pre-loaded Founder Data
              </span>
            </div>
            <p className="text-xs text-indigo-800 leading-relaxed">
              Explore immediately as <strong>Alex Rivera (Founder)</strong> with pre-populated course progress and diagnostic radar data.
            </p>
            <button
              onClick={handleDemo}
              disabled={loading}
              type="button"
              className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs flex items-center justify-center gap-2 transition cursor-pointer disabled:opacity-50"
            >
              <Sparkles size={16} className="text-amber-300" />
              <span>Continue as Alex Rivera (1-Click Demo)</span>
            </button>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-slate-200 w-full" />
            <span className="bg-white px-3 text-xs text-slate-400 uppercase tracking-wider font-bold absolute">
              or use account credentials
            </span>
          </div>

          {/* Tab Switcher */}
          <div className="flex bg-slate-100 p-1.5 rounded-xl border border-slate-200">
            <button
              type="button"
              onClick={() => { setTab('login'); setError(null); }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition cursor-pointer ${
                tab === 'login'
                  ? 'bg-white text-slate-900 shadow-xs border border-slate-200/60'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setTab('register'); setError(null); }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition cursor-pointer ${
                tab === 'register'
                  ? 'bg-white text-slate-900 shadow-xs border border-slate-200/60'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Create Account
            </button>
          </div>

          {error && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-medium">
              {error}
            </div>
          )}

          {/* Credentials Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {tab === 'register' && (
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <User size={16} className="absolute left-3.5 top-3 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Sarah Connor"
                    className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-3 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="founder@venture.com"
                  className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-3 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold rounded-xl shadow-xs transition flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer pt-2.5"
            >
              {loading ? (
                'Processing...'
              ) : tab === 'login' ? (
                <>
                  <LogIn size={16} /> Sign In to Platform
                </>
              ) : (
                <>
                  <UserPlus size={16} /> Create Account
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
