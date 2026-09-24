import React from 'react';
import { ShieldCheck, AlertTriangle, Lightbulb, Zap } from 'lucide-react';

export default function SwotCard({ swot }) {
  if (!swot) return null;

  const sections = [
    { title: 'Strengths', items: swot.strengths, icon: ShieldCheck, color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
    { title: 'Weaknesses', items: swot.weaknesses, icon: AlertTriangle, color: 'text-amber-600 bg-amber-50 border-amber-200' },
    { title: 'Opportunities', items: swot.opportunities, icon: Lightbulb, color: 'text-blue-600 bg-blue-50 border-blue-200' },
    { title: 'Threats', items: swot.threats, icon: Zap, color: 'text-rose-600 bg-rose-50 border-rose-200' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {sections.map(({ title, items, icon: Icon, color }) => (
        <div key={title} className={`p-4 rounded-xl border ${color}`}>
          <div className="flex items-center gap-2 mb-2">
            <Icon size={18} />
            <h4 className="font-bold text-sm uppercase tracking-wide">{title}</h4>
          </div>
          <ul className="list-disc list-inside space-y-1 text-sm text-slate-700">
            {items?.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}