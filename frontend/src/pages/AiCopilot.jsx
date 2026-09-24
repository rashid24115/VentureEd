import React, { useState, useEffect, useContext } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Sparkles,
  TrendingUp,
  Search,
  Layers,
  Compass,
  CheckCircle2,
  Copy,
  Check,
  ArrowRight,
  Lightbulb,
  ShieldCheck,
  Activity,
  Bot,
  MessageSquare,
  AlertCircle
} from 'lucide-react';
import { fetchCopilotAdvice, fetchProjects, fetchUserIntelligence } from '../services/api';
import { AuthContext } from '../context/AuthContext';

export default function AiCopilot() {
  const [searchParams] = useSearchParams();
  const initialMode = searchParams.get('mode') || 'raise_value';
  const initialWeakness = searchParams.get('weakness') || '';

  const { user } = useContext(AuthContext);

  const [mode, setMode] = useState(initialMode);
  const [ideaText, setIdeaText] = useState(
    'EcoTrack AI: An automated carbon footprint and ESG compliance platform for mid-market manufacturing companies.'
  );
  const [industry, setIndustry] = useState('AI / SaaS');
  const [weaknessContext, setWeaknessContext] = useState(initialWeakness);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [advice, setAdvice] = useState(null);
  const [copiedHook, setCopiedHook] = useState(null);
  const [intelligence, setIntelligence] = useState(null);

  // Mode Options
  const modes = [
    {
      id: 'raise_value',
      title: 'Raise Market Value',
      tagline: 'Pricing power & ROI justification',
      icon: TrendingUp,
      color: 'from-emerald-500 to-teal-600',
      badge: 'Revenue & Pricing',
    },
    {
      id: 'market_problems',
      title: 'Research Market Problems',
      tagline: 'Uncover hair-on-fire customer pain',
      icon: Search,
      color: 'from-blue-500 to-indigo-600',
      badge: 'Customer Discovery',
    },
    {
      id: 'unique_feature',
      title: 'Add Unique 10x Feature',
      tagline: 'Build defensibility & anti-copy moats',
      icon: Layers,
      color: 'from-violet-500 to-purple-600',
      badge: 'Defensibility',
    },
    {
      id: 'standout',
      title: 'Make Product Stand Out',
      tagline: 'Beat incumbents & category creation',
      icon: Compass,
      color: 'from-amber-500 to-orange-600',
      badge: 'Differentiation',
    },
  ];

  useEffect(() => {
    // Fetch projects to allow quick idea selection
    fetchProjects()
      .then((res) => {
        if (res.data && res.data.length > 0) {
          setProjects(res.data);
          const first = res.data[0];
          setIdeaText(`${first.title}: ${first.idea_description || first.ideaDescription}`);
          setIndustry(first.industry_category || first.industryCategory || 'AI / SaaS');
        }
      })
      .catch(() => {});

    // Fetch user intelligence for weakness context
    fetchUserIntelligence()
      .then((res) => {
        setIntelligence(res.data);
        if (!initialWeakness && res.data?.weaknesses?.length > 0) {
          setWeaknessContext(res.data.weaknesses[0]);
        }
      })
      .catch(() => {});
  }, [initialWeakness]);

  useEffect(() => {
    // Auto-fetch advice on initial load or mode change
    handleGenerateAdvice(mode);
  }, [mode]);

  const handleGenerateAdvice = async (selectedMode = mode) => {
    if (!ideaText.trim()) return;
    setLoading(true);
    try {
      const res = await fetchCopilotAdvice({
        idea: ideaText,
        mode: selectedMode,
        industry,
        weakness_context: weaknessContext || undefined,
      });
      setAdvice(res.data);
    } catch (err) {
      console.error('Error generating advice:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyHook = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedHook(idx);
    setTimeout(() => setCopiedHook(null), 2500);
  };

  const handleSelectProject = (e) => {
    const selectedId = e.target.value;
    const found = projects.find((p) => String(p.id) === selectedId);
    if (found) {
      setIdeaText(`${found.title}: ${found.idea_description || found.ideaDescription}`);
      setIndustry(found.industry_category || found.industryCategory || 'AI / SaaS');
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8 animate-fade-in">
      {/* Header Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-10 shadow-xl overflow-hidden border border-slate-800">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-bold text-amber-300 border border-white/10">
            <Bot size={15} />
            AI Startup Co-Pilot & Venture Mentor
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
            How Can We Help Your Startup Win?
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Get instant strategic playbooks to raise your product's market value, discover genuine customer pain points,
            invent defensible 10x features, and position your product to stand out from competitors.
          </p>
        </div>
      </div>

      {/* Weakness Alert if provided */}
      {weaknessContext && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <AlertCircle size={18} className="text-amber-600 shrink-0" />
            <p className="text-xs text-amber-900 font-medium">
              <span className="font-bold">Tailoring advice to fix your identified weakness:</span>{' '}
              <span className="bg-white px-2 py-0.5 rounded-md border border-amber-200 font-bold text-amber-800">
                {weaknessContext}
              </span>
            </p>
          </div>
          <button
            onClick={() => setWeaknessContext('')}
            className="text-[11px] font-bold text-amber-700 hover:text-amber-900 hover:underline"
          >
            Clear
          </button>
        </div>
      )}

      {/* Idea Input & Project Quick Pick */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <Lightbulb size={15} className="text-amber-500" /> Your Startup Concept
          </span>

          {projects.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-semibold">Load from Incubator:</span>
              <select
                onChange={handleSelectProject}
                className="px-3 py-1 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 outline-none"
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div className="space-y-3">
          <textarea
            rows={3}
            value={ideaText}
            onChange={(e) => setIdeaText(e.target.value)}
            placeholder="Describe your startup idea or core product concept..."
            className="w-full px-4 py-3 bg-slate-50/70 border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 leading-relaxed font-medium"
          />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500">Industry:</span>
              <input
                type="text"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="px-3 py-1 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <button
              onClick={() => handleGenerateAdvice(mode)}
              disabled={loading}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              <Sparkles size={14} className="text-amber-300" />
              <span>{loading ? 'Consulting AI Co-Pilot...' : 'Generate New Playbook'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Advisor Modes Selector Cards */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
          Select Strategic Focus Area
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {modes.map((m) => {
            const Icon = m.icon;
            const isSelected = mode === m.id;
            return (
              <button
                key={m.id}
                onClick={() => {
                  setMode(m.id);
                  handleGenerateAdvice(m.id);
                }}
                className={`p-5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between space-y-3 group ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50/70 shadow-sm ring-2 ring-indigo-500/20'
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div
                    className={`p-2.5 rounded-xl text-white shadow-xs bg-gradient-to-tr ${m.color}`}
                  >
                    <Icon size={18} />
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {m.badge}
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-slate-900 text-sm group-hover:text-indigo-600 transition">
                    {m.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{m.tagline}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Generated Strategy Advice Card */}
      {loading ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3 animate-pulse">
          <Bot size={36} className="mx-auto text-indigo-400 animate-bounce" />
          <h3 className="text-sm font-bold text-slate-800">Synthesizing Venture Strategy...</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Analyzing pricing elasticity, market discovery angles, and competitive moat opportunities.
          </p>
        </div>
      ) : advice ? (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-8 animate-fade-in">
          {/* Headline & Summary */}
          <div className="space-y-3 pb-6 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-100">
                {advice.mode_label}
              </span>
              <span className="text-xs text-slate-400 font-semibold">· AI Strategy Playbook</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-snug">
              {advice.headline}
            </h2>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium bg-slate-50 p-4 rounded-2xl border border-slate-200/60">
              {advice.summary}
            </p>
          </div>

          {/* Action Steps Checklist */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <CheckCircle2 size={18} className="text-emerald-600" />
              Tactical Execution Steps for Founders
            </h3>
            <div className="space-y-2.5">
              {advice.action_steps?.map((step, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-white border border-slate-200 flex items-start gap-3 hover:border-slate-300 transition"
                >
                  <div className="w-6 h-6 rounded-full bg-indigo-50 text-indigo-700 flex items-center justify-center shrink-0 font-bold text-xs mt-0.5">
                    {idx + 1}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">{step}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Strategic Insights & Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Insights */}
            <div className="bg-indigo-50/60 border border-indigo-100 rounded-2xl p-5 space-y-3">
              <h4 className="text-xs font-bold text-indigo-950 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck size={16} className="text-indigo-600" /> Investor Insights & Rules of Thumb
              </h4>
              <ul className="space-y-2">
                {advice.strategic_insights?.map((ins, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-indigo-900 leading-relaxed">
                    <span className="font-bold text-indigo-600 shrink-0">•</span>
                    <span>{ins}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Metrics to Track */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Activity size={16} className="text-emerald-600" /> Key Metrics to Measure
              </h4>
              <ul className="space-y-2">
                {advice.metrics_to_track?.map((m, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-xs text-slate-700 font-medium">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                    <span>{m}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Copyable Value Proposition & Hook */}
          {advice.suggested_unique_hooks?.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Copyable Value Proposition Hooks & Taglines
              </h4>
              <div className="space-y-2">
                {advice.suggested_unique_hooks.map((hook, hIdx) => (
                  <div
                    key={hIdx}
                    className="p-4 bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-2xl flex items-center justify-between gap-4"
                  >
                    <p className="text-xs sm:text-sm font-medium italic">"{hook}"</p>
                    <button
                      onClick={() => handleCopyHook(hook, hIdx)}
                      className="shrink-0 p-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition text-xs font-semibold flex items-center gap-1 cursor-pointer"
                      title="Copy to clipboard"
                    >
                      {copiedHook === hIdx ? (
                        <>
                          <Check size={14} className="text-emerald-400" />
                          <span className="text-[11px] text-emerald-300">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy size={14} />
                          <span className="text-[11px]">Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Next Step Bridge: Pitch Simulator */}
          <div className="p-5 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h4 className="text-xs font-bold text-emerald-950 uppercase tracking-wider flex items-center gap-1.5">
                <MessageSquare size={16} className="text-emerald-600" />
                Stress-Test This Strategy With an Investor
              </h4>
              <p className="text-xs text-emerald-800 mt-0.5">
                Take these new value propositions into the Pitch Simulator to see how Marc (VC) reacts.
              </p>
            </div>
            <Link
              to="/pitch-simulator/1"
              className="shrink-0 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center gap-1.5"
            >
              <span>Launch Pitch Simulator</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  );
}
