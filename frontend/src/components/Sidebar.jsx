import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  BookOpen,
  BrainCircuit,
  Bot,
  PlusCircle,
  MessageSquare,
  Award,
  Sparkles,
  ArrowUpRight
} from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

export default function Sidebar() {
  const { user } = useContext(AuthContext);

  const mainNav = [
    { label: 'Dashboard', path: '/', icon: LayoutDashboard },
    { label: 'Startup Courses', path: '/courses', icon: BookOpen },
    { label: 'Knowledge Strength', path: '/assessment', icon: BrainCircuit },
    { label: 'AI Startup Co-Pilot', path: '/copilot', icon: Bot, highlight: true },
    { label: 'Launch Idea Studio', path: '/create', icon: PlusCircle },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 min-h-[calc(100vh-4rem)] p-4 hidden md:flex flex-col justify-between shrink-0">
      <div className="space-y-6">
        <div>
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2 block">
            Founder Journey
          </span>
          <nav className="space-y-1">
            {mainNav.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === '/'}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold transition ${
                      isActive
                        ? 'bg-indigo-600 text-white shadow-xs shadow-indigo-200'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <div className="flex items-center gap-3">
                        <Icon size={18} className={isActive ? 'text-white' : item.highlight ? 'text-violet-600' : 'text-slate-400'} />
                        <span>{item.label}</span>
                      </div>
                      {item.highlight && !isActive && (
                        <span className="text-[10px] bg-violet-100 text-violet-700 font-extrabold px-1.5 py-0.5 rounded">
                          AI
                        </span>
                      )}
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Quick Tools */}
        <div>
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2 block">
            Simulation & Practice
          </span>
          <div className="space-y-1">
            <NavLink
              to="/pitch-simulator/1"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition ${
                  isActive ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-100'
                }`
              }
            >
              <MessageSquare size={16} className="text-emerald-600" />
              <span>AI Investor Pitch VC</span>
            </NavLink>
          </div>
        </div>
      </div>

      {/* Bottom AI Helper Box */}
      <div className="bg-gradient-to-br from-violet-50 to-indigo-50 border border-violet-100 rounded-2xl p-4 mt-6">
        <div className="flex items-center gap-2 mb-2">
          <div className="p-1.5 bg-violet-600 text-white rounded-lg">
            <Bot size={16} />
          </div>
          <span className="text-xs font-bold text-violet-950">AI Startup Co-Pilot</span>
        </div>
        <p className="text-xs text-slate-600 mb-3">
          Need help raising value, researching market problems, or adding a unique 10x feature?
        </p>
        <NavLink
          to="/copilot"
          className="flex items-center justify-between w-full py-2 px-3 bg-white hover:bg-violet-50 text-violet-700 border border-violet-200 text-xs font-bold rounded-xl shadow-2xs transition"
        >
          <span>Consult AI Co-Pilot</span>
          <ArrowUpRight size={14} />
        </NavLink>
      </div>
    </aside>
  );
}