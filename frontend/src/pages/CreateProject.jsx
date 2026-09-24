import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Sparkles, ArrowLeft, Rocket, Lightbulb, Compass, Zap } from 'lucide-react';
import { createProject, generateLeanCanvas } from '../services/api';
import { AuthContext } from '../context/AuthContext';

export default function CreateProject() {
  const navigate = useNavigate();
  const { user, openAuthModal } = useContext(AuthContext);

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('AI / SaaS');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const sampleIdeas = [
    {
      title: 'EduMentor AI',
      category: 'EdTech',
      desc: 'An adaptive AI tutoring assistant for university STEM students that automatically detects conceptual misunderstandings during problem solving.',
    },
    {
      title: 'SupplyLedger',
      category: 'FinTech',
      desc: 'Automated invoice factoring and cashflow forecasting platform for mid-market logistics companies, reducing payment cycle from 60 days to 24 hours.',
    },
    {
      title: 'MediSync Health',
      category: 'HealthTech',
      desc: 'Voice-to-clinical-note ambient AI tool for independent medical practices that automates EHR documentation and insurance coding in real-time.',
    },
  ];

  const handleApplySample = (sample) => {
    setTitle(sample.title);
    setCategory(sample.category);
    setDescription(sample.desc);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // 1. Create project
      const projectRes = await createProject({
        title,
        idea_description: description,
        industry_category: category,
      });

      const newProject = projectRes.data;
      const projId = newProject.id;

      // 2. Generate Lean Canvas
      try {
        await generateLeanCanvas({
          project_id: projId,
          idea_description: description,
        });
      } catch (canvasErr) {
        console.warn('Canvas generation fallback handled:', canvasErr);
      }

      // 3. Navigate to ProjectView
      navigate(`/project/${projId}`);
    } catch (err) {
      console.error('Error creating project:', err);
      setError(
        err.response?.data?.detail ||
          'Failed to create startup project. Please ensure the backend server is running.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-6 animate-fade-in">
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-800 transition"
      >
        <ArrowLeft size={14} /> Back to Dashboard
      </Link>

      {/* Main Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-10 space-y-8">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 border border-indigo-100 text-indigo-700 rounded-full text-xs font-bold">
            <Sparkles size={14} className="text-amber-500" /> AI Incubator Studio
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Launch Your Startup Idea
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Submit your concept. Our AI will automatically construct a 9-box Lean Canvas framework,
            evaluate SWOT market viability, and prepare a pitch simulator session.
          </p>
        </div>

        {/* Quick Sample Ideas Chips */}
        <div className="space-y-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Or test with a sample founder idea:
          </span>
          <div className="flex flex-wrap gap-2">
            {sampleIdeas.map((s) => (
              <button
                key={s.title}
                type="button"
                onClick={() => handleApplySample(s)}
                className="px-3 py-1.5 bg-slate-50 hover:bg-indigo-50 hover:border-indigo-200 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 transition cursor-pointer"
              >
                + {s.title} ({s.category})
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Venture / Product Title
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. EcoTrack AI"
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Industry Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="AI / SaaS">AI / SaaS</option>
                <option value="FinTech">FinTech</option>
                <option value="EdTech">EdTech</option>
                <option value="HealthTech">HealthTech</option>
                <option value="E-Commerce">E-Commerce</option>
                <option value="CleanTech">CleanTech</option>
                <option value="Developer Tools">Developer Tools</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Startup Vision & Core Problem Solved
            </label>
            <textarea
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the urgent problem, who experiences it (ICP), your 10x solution mechanism, and why existing tools fail..."
              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 leading-relaxed"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl shadow-xs transition flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              'Analyzing Idea & Generating Lean Canvas...'
            ) : (
              <>
                <Sparkles size={16} className="text-amber-300" />
                <span>Generate Lean Canvas & Launch Incubator</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}