import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MessageSquare, ArrowLeft, Activity, Sparkles, Compass, Shield } from 'lucide-react';
import { fetchProjectById, fetchLeanCanvas } from '../services/api';
import LeanCanvasGrid from '../components/LeanCanvasGrid';
import SwotCard from '../components/SwotCard';

export default function ProjectView() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [canvas, setCanvas] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetchProjectById(id).catch(() => ({ data: null })),
      fetchLeanCanvas(id).catch(() => ({ data: null })),
    ])
      .then(([projRes, canvasRes]) => {
        setProject(projRes.data);
        setCanvas(canvasRes.data);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="p-8 max-w-7xl mx-auto animate-pulse space-y-6">
        <div className="h-8 bg-slate-200 rounded w-1/4" />
        <div className="h-40 bg-slate-200 rounded-3xl" />
        <div className="h-96 bg-slate-200 rounded-3xl" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="p-12 text-center">
        <p className="text-slate-500">Startup project not found.</p>
        <Link to="/" className="text-indigo-600 font-semibold text-xs hover:underline mt-2 inline-block">
          ← Back to Dashboard
        </Link>
      </div>
    );
  }

  const category = project.industry_category || project.industryCategory || 'Tech';
  const description = project.idea_description || project.ideaDescription || '';
  const swot = project.swot_analysis || project.swotAnalysis;
  const score = project.feasibility_score || project.feasibilityScore || 85;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8 animate-fade-in">
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-800 transition"
      >
        <ArrowLeft size={14} /> Back to Dashboard
      </Link>

      {/* Project Overview Card */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-3xl">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-100">
              {category}
            </span>
            <span className="flex items-center gap-1 text-emerald-600 text-xs font-bold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
              <Activity size={13} /> Feasibility Score: {score}/100
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {project.title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{description}</p>
        </div>

        <div className="shrink-0 flex sm:flex-col gap-2">
          <Link
            to={`/pitch-simulator/${project.id || id}`}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition"
          >
            <MessageSquare size={15} />
            <span>Pitch to AI Investor</span>
          </Link>
        </div>
      </div>

      {/* SWOT Section */}
      {swot && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Shield size={16} className="text-indigo-600" />
            <h2 className="text-base font-bold text-slate-900">SWOT Market & Competitive Analysis</h2>
          </div>
          <SwotCard swot={swot} />
        </div>
      )}

      {/* Lean Canvas Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Compass size={16} className="text-indigo-600" />
            <h2 className="text-base font-bold text-slate-900">9-Box Lean Canvas</h2>
          </div>
          <span className="text-xs text-slate-400 font-medium">Auto-generated via AI</span>
        </div>
        <LeanCanvasGrid canvasData={canvas} />
      </div>
    </div>
  );
}