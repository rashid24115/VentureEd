import React from 'react';
import { Layers, Target, Compass, Sparkles, TrendingUp, DollarSign, Share2, Shield, Users } from 'lucide-react';

export default function LeanCanvasGrid({ canvasData }) {
  if (!canvasData) {
    return (
      <div className="bg-white p-8 rounded-2xl border border-dashed border-slate-300 text-center text-slate-400 text-xs">
        No Lean Canvas generated yet. Submit your idea to generate the 9-box framework.
      </div>
    );
  }

  const problem = canvasData.problem || [];
  const solution = canvasData.solution || [];
  const keyMetrics = canvasData.key_metrics || canvasData.keyMetrics || [];
  const uvp = canvasData.unique_value_proposition || canvasData.uniqueValueProposition || 'N/A';
  const unfairAdvantage = canvasData.unfair_advantage || canvasData.unfairAdvantage || 'N/A';
  const channels = canvasData.channels || [];
  const customerSegments = canvasData.customer_segments || canvasData.customerSegments || [];
  const costStructure = canvasData.cost_structure || canvasData.costStructure || [];
  const revenueStreams = canvasData.revenue_streams || canvasData.revenueStreams || [];

  const Card = ({ title, items, icon: Icon, badgeColor = 'bg-slate-100 text-slate-700' }) => (
    <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col h-full space-y-2">
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
          {Icon && <Icon size={14} className="text-indigo-600 shrink-0" />}
          <span>{title}</span>
        </h3>
      </div>
      <div className="flex-1 overflow-y-auto">
        {Array.isArray(items) ? (
          <ul className="space-y-1.5 text-xs text-slate-600">
            {items.map((item, idx) => (
              <li key={idx} className="flex items-start gap-1.5 leading-relaxed">
                <span className="text-indigo-500 font-bold shrink-0">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-xs text-slate-700 leading-relaxed font-medium">{items}</p>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Top 5 Columns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Column 1: Problem */}
        <div className="lg:col-span-1 min-h-[260px]">
          <Card title="1. Problem" items={problem} icon={Target} />
        </div>

        {/* Column 2: Solution & Key Metrics */}
        <div className="lg:col-span-1 flex flex-col gap-4">
          <Card title="4. Solution" items={solution} icon={Sparkles} />
          <Card title="8. Key Metrics" items={keyMetrics} icon={TrendingUp} />
        </div>

        {/* Column 3: UVP & Unfair Advantage */}
        <div className="lg:col-span-1 flex flex-col gap-4">
          <Card title="3. Unique Value Prop" items={uvp} icon={Compass} />
          <Card title="9. Unfair Advantage" items={unfairAdvantage} icon={Shield} />
        </div>

        {/* Column 4: Channels */}
        <div className="lg:col-span-1 min-h-[260px]">
          <Card title="5. Channels" items={channels} icon={Share2} />
        </div>

        {/* Column 5: Customer Segments */}
        <div className="lg:col-span-1 min-h-[260px]">
          <Card title="2. Customer Segments" items={customerSegments} icon={Users} />
        </div>
      </div>

      {/* Bottom 2 Columns Grid: Cost Structure & Revenue Streams */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card title="7. Cost Structure" items={costStructure} icon={DollarSign} />
        <Card title="6. Revenue Streams" items={revenueStreams} icon={TrendingUp} />
      </div>
    </div>
  );
}