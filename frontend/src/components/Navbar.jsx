import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Rocket, BookOpen, BrainCircuit, Lightbulb, Flame, Zap, LogIn, LogOut, Bot, Sparkles } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout, openAuthModal } = useContext(AuthContext);
  const location = useLocation();

  const navLinks = [
    { label: 'Dashboard', path: '/', icon: Rocket },
    { label: 'Courses', path: '/courses', icon: BookOpen },
    { label: 'Knowledge Strength', path: '/assessment', icon: BrainCircuit, badge: 'Radar' },
    { label: 'AI Co-Pilot', path: '/copilot', icon: Bot, badge: 'AI Helper', highlight: true },
    { label: 'Idea Studio', path: '/create', icon: Lightbulb },
  ];

  return (
    <header className="h-16 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-40 transition shadow-xs">
      {/* Brand */}
      <div className="flex items-center gap-6">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="p-2 bg-gradient-to-tr from-indigo-600 to-violet-600 rounded-xl text-white shadow-sm shadow-indigo-200 group-hover:scale-105 transition">
            <Rocket size={18} />
          </div>
          <div>
            <span className="font-extrabold text-lg text-slate-900 tracking-tight">
              Venture<span className="text-indigo-600">Ed</span>
            </span>
            <span className="hidden sm:inline-block ml-2 text-[10px] font-semibold uppercase tracking-wider bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full border border-indigo-100">
              AI Startup Academy
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-1 ml-4">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive =
              location.pathname === link.path || (link.path !== '/' && location.pathname.startsWith(link.path));
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-700 border border-indigo-100 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon
                  size={14}
                  className={
                    isActive
                      ? 'text-indigo-600'
                      : link.highlight
                      ? 'text-violet-600'
                      : 'text-slate-400'
                  }
                />
                <span>{link.label}</span>
                {link.badge && (
                  <span
                    className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded ${
                      link.highlight
                        ? 'bg-violet-100 text-violet-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Right User Stats / Auth */}
      <div className="flex items-center gap-3">
        {user ? (
          <div className="flex items-center gap-3">
            {/* Gamification Badges */}
            <div className="hidden sm:flex items-center gap-2">
              <div
                className="flex items-center gap-1 px-2.5 py-1 bg-amber-50 border border-amber-200 text-amber-700 rounded-full text-xs font-bold"
                title="Founder Learning Streak"
              >
                <Flame size={14} className="text-amber-500 fill-amber-500" />
                <span>{user.streak || 1}d Streak</span>
              </div>
              <div
                className="flex items-center gap-1 px-2.5 py-1 bg-violet-50 border border-violet-200 text-violet-700 rounded-full text-xs font-bold"
                title="Founder Experience Points"
              >
                <Zap size={14} className="text-violet-500 fill-violet-500" />
                <span>{user.xp || 100} XP</span>
              </div>
            </div>

            {/* User Profile Pill */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-500 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-xs font-semibold text-slate-800 leading-tight line-clamp-1">{user.name}</p>
                <p className="text-[11px] text-slate-400 font-medium leading-none mt-0.5">
                  {user.archetype || 'Founder'}
                </p>
              </div>
              <button
                onClick={logout}
                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition ml-1 cursor-pointer"
                title="Log Out"
              >
                <LogOut size={16} />
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={openAuthModal}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-4 py-2 rounded-xl shadow-xs transition cursor-pointer"
          >
            <LogIn size={15} />
            <span>Sign In / Demo</span>
          </button>
        )}
      </div>
    </header>
  );
}