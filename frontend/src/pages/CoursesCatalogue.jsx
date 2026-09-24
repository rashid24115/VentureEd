import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  BookOpen,
  Clock,
  Star,
  Users,
  CheckCircle2,
  Sparkles,
  Layers,
  TrendingUp,
  DollarSign,
  Shield,
  Lightbulb,
  Rocket,
  HelpCircle,
  ArrowRight
} from 'lucide-react';
import { fetchCourses } from '../services/api';

export default function CoursesCatalogue() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [difficulty, setDifficulty] = useState('All');

  const categories = ['All', 'Ideation', 'Product', 'Growth', 'Finance', 'Fundraising'];
  const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced'];

  useEffect(() => {
    setLoading(true);
    fetchCourses({
      category: category !== 'All' ? category : undefined,
      difficulty: difficulty !== 'All' ? difficulty : undefined,
      search: search.trim() || undefined,
    })
      .then((res) => {
        setCourses(res.data || []);
      })
      .catch((err) => console.error('Error fetching courses:', err))
      .finally(() => setLoading(false));
  }, [category, difficulty, search]);

  const getDifficultyColor = (diff) => {
    switch (diff) {
      case 'Beginner':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Intermediate':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Advanced':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const getCategoryIcon = (cat) => {
    switch (cat) {
      case 'Ideation':
        return Lightbulb;
      case 'Product':
        return Layers;
      case 'Finance':
        return TrendingUp;
      case 'Growth':
        return Rocket;
      case 'Fundraising':
        return DollarSign;
      default:
        return BookOpen;
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8 animate-fade-in">
      {/* Header Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-10 overflow-hidden shadow-xl border border-slate-800">
        <div className="absolute -right-12 -top-12 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-1/3 -bottom-12 w-64 h-64 bg-violet-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-2xl relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-semibold text-indigo-300 border border-white/10">
            <Sparkles size={14} className="text-amber-400" />
            Curated Entrepreneurship Playbooks
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
            Learn Startup Building from Seed to Scale
          </h1>
          <p className="text-sm sm:text-base text-slate-300">
            Actionable, battle-tested courses covering ideation, rapid MVP prototyping, unit economics,
            growth loops, and investor pitching with interactive quizzes.
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row gap-3 justify-between items-stretch md:items-center">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search size={18} className="absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search startup concepts (e.g. CAC, MVP, SAFEs, Pitch)..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-2xs"
            />
          </div>

          {/* Difficulty Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">Level:</span>
            <div className="flex bg-slate-100 p-1 rounded-xl">
              {difficulties.map((diff) => (
                <button
                  key={diff}
                  onClick={() => setDifficulty(diff)}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg transition ${
                    difficulty === diff
                      ? 'bg-white text-slate-900 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                category === cat
                  ? 'bg-indigo-600 text-white shadow-xs shadow-indigo-200'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Course Cards Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="bg-white rounded-2xl border border-slate-200 p-6 h-80 animate-pulse space-y-4">
              <div className="h-6 bg-slate-100 rounded w-1/3" />
              <div className="h-8 bg-slate-100 rounded w-3/4" />
              <div className="h-20 bg-slate-100 rounded" />
              <div className="h-10 bg-slate-100 rounded mt-auto" />
            </div>
          ))}
        </div>
      ) : courses.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center space-y-3">
          <BookOpen size={36} className="mx-auto text-slate-400" />
          <h3 className="text-base font-bold text-slate-800">No courses match your filter</h3>
          <p className="text-xs text-slate-500">Try adjusting your search keywords or switching category filters.</p>
          <button
            onClick={() => { setCategory('All'); setDifficulty('All'); setSearch(''); }}
            className="px-4 py-2 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-xl hover:bg-indigo-100 transition"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => {
            const Icon = getCategoryIcon(course.category);
            return (
              <div
                key={course.id}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group overflow-hidden"
              >
                <div className="p-6 space-y-4">
                  {/* Top Badges */}
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg">
                      <Icon size={14} className="text-indigo-600" />
                      {course.category}
                    </span>
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${getDifficultyColor(
                        course.difficulty
                      )}`}
                    >
                      {course.difficulty}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition leading-snug">
                      {course.title}
                    </h3>
                    <p className="text-xs text-slate-600 line-clamp-3 mt-2 leading-relaxed">
                      {course.description}
                    </p>
                  </div>

                  {/* Metadata Stats */}
                  <div className="grid grid-cols-3 gap-2 py-3 border-y border-slate-100 text-[11px] text-slate-500">
                    <div className="flex items-center gap-1">
                      <Clock size={13} className="text-slate-400" />
                      <span>{course.duration}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <BookOpen size={13} className="text-slate-400" />
                      <span>{course.lessons_count} lessons</span>
                    </div>
                    <div className="flex items-center gap-1 text-amber-600 font-semibold">
                      <Star size={13} className="fill-amber-400 text-amber-400" />
                      <span>{course.rating}</span>
                    </div>
                  </div>

                  {/* Progress bar if enrolled */}
                  {course.is_enrolled && (
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-slate-600">Course Progress</span>
                        <span className="text-indigo-600 font-bold">{course.progress_percent}%</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-indigo-600 rounded-full transition-all duration-300"
                          style={{ width: `${course.progress_percent}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer Action */}
                <div className="p-4 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-1 text-xs text-slate-500">
                    <Users size={14} className="text-slate-400" />
                    <span>{course.students_count?.toLocaleString()} founders</span>
                  </div>

                  <Link
                    to={`/courses/${course.id}`}
                    className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition"
                  >
                    <span>{course.is_enrolled ? 'Continue' : 'Start Course'}</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
