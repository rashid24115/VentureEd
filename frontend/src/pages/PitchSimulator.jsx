import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MessageSquare, Bot, Sparkles, UserCheck, ShieldAlert, Landmark } from 'lucide-react';
import { startPitchSession } from '../services/api';
import PitchChatBox from '../components/PitchChatBox';

export default function PitchSimulator() {
  const { projectId } = useParams();
  const [sessionId, setSessionId] = useState(null);
  const [persona, setPersona] = useState('aggressive_vc');
  const [initialHistory, setInitialHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const personaDetails = {
    aggressive_vc: {
      name: 'Marc (Aggressive VC)',
      desc: 'Silicon Valley Partner focused on 100x scale, CAC/LTV, defensible moats, and unit economics.',
      icon: ShieldAlert,
      tag: 'High Stress Test',
    },
    friendly_angel: {
      name: 'Sarah (Angel Investor)',
      desc: 'Founder-friendly early backer testing founder-market fit, product vision, and user empathy.',
      icon: UserCheck,
      tag: 'Founder Fit',
    },
    conservative_banker: {
      name: 'Mr. Henderson (Banker)',
      desc: 'Risk-averse debt officer scrutinizing cashflow breakeven, downside risks, and fixed costs.',
      icon: Landmark,
      tag: 'Risk & Runway',
    },
  };

  const startSession = async (selectedPersona) => {
    setPersona(selectedPersona);
    setLoading(true);
    try {
      const pId = parseInt(projectId, 10) || 1;
      const res = await startPitchSession({ project_id: pId, persona: selectedPersona });
      const sessionData = res.data;
      const sid = sessionData.id || sessionData._id || (sessionData.data && sessionData.data.id);
      setSessionId(sid);
      setInitialHistory(sessionData.chat_history || sessionData.chatHistory || []);
    } catch (err) {
      console.error('Failed to start pitch session:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    startSession('aggressive_vc');
  }, [projectId]);

  const CurrentIcon = personaDetails[persona]?.icon || Bot;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-6 animate-fade-in">
      <Link
        to={projectId ? `/project/${projectId}` : '/'}
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-800 transition"
      >
        <ArrowLeft size={14} /> Back to Project Canvas
      </Link>

      {/* Header & Persona Selector */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-bold rounded-full">
            <Bot size={14} /> AI Pitch Simulator
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Stress-Test Your Startup Pitch
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-xl">
            Pitch your business model, value proposition, and customer acquisition strategy to distinct
            investor personas with live critique scores.
          </p>
        </div>

        {/* Persona Selector Dropdown */}
        <div className="shrink-0 space-y-1.5">
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
            Select Investor Persona
          </label>
          <select
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer shadow-2xs"
            value={persona}
            onChange={(e) => startSession(e.target.value)}
          >
            <option value="aggressive_vc">Marc · Aggressive Silicon Valley VC</option>
            <option value="friendly_angel">Sarah · Supportive Angel Investor</option>
            <option value="conservative_banker">Mr. Henderson · Conservative Banker</option>
          </select>
        </div>
      </div>

      {/* Active Persona Banner */}
      <div className="p-4 bg-indigo-50/70 border border-indigo-100 rounded-2xl flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-600 text-white rounded-xl shadow-xs">
            <CurrentIcon size={18} />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-900">{personaDetails[persona]?.name}</span>
            <p className="text-[11px] text-slate-600 line-clamp-1">{personaDetails[persona]?.desc}</p>
          </div>
        </div>
        <span className="shrink-0 text-[11px] font-bold bg-white text-indigo-700 border border-indigo-200 px-2.5 py-1 rounded-full shadow-2xs">
          {personaDetails[persona]?.tag}
        </span>
      </div>

      {/* Pitch Chat Box */}
      {loading ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center text-xs text-slate-400">
          Initializing simulator persona session...
        </div>
      ) : sessionId ? (
        <PitchChatBox key={sessionId} sessionId={sessionId} initialHistory={initialHistory} />
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center text-xs text-slate-400">
          Unable to connect to pitch session. Ensure backend is running.
        </div>
      )}
    </div>
  );
}