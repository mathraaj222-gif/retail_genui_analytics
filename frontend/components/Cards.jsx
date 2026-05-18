"use client";

import React from "react";
import { TrendingUp, AlertCircle, Sparkles } from "lucide-react";

export const KPIBox = ({ title, value, subtitle = "", icon: Icon, glowColor = "blue", trend = null }) => (
  <div className="bg-white border border-slate-200 p-6 rounded-[1.5rem] shadow-sm hover:shadow-md hover:scale-[1.02] transition-all group">
    <div className="flex justify-between items-start mb-4">
      <h3 className="text-slate-500 text-xs font-bold uppercase tracking-widest">{title}</h3>
      {Icon && <Icon className={`w-5 h-5 text-${glowColor}-600 opacity-70 group-hover:opacity-100 transition-opacity`} />}
    </div>
    <div className="flex items-baseline gap-2">
      <div className="text-3xl font-extrabold text-slate-900 tracking-tight">{value}</div>
      {trend && (
        <span className={`text-xs font-bold ${trend.toString().includes("-") || trend.toString().includes("↓") ? 'text-rose-600' : 'text-emerald-600'}`}>
          {trend}
        </span>
      )}
    </div>
    {subtitle && <div className={`text-${glowColor}-600 text-xs font-bold mt-1`}>{subtitle}</div>}
  </div>
);

export const InsightTile = ({ title, description, severity }) => {
  const severityMap = {
    low: "border-emerald-500 bg-emerald-50 text-emerald-800",
    medium: "border-amber-500 bg-amber-50 text-amber-800",
    high: "border-rose-500 bg-rose-50 text-rose-800 shadow-sm",
  };
  const colors = severityMap[severity || "low"] || severityMap.low;

  return (
    <div className={`p-5 rounded-xl border-l-4 ${colors} mb-4 shadow-sm`}>
      <div className="flex items-center gap-2 mb-2">
        <Sparkles className="w-4 h-4" />
        <h4 className="font-bold uppercase tracking-wider text-xs">{title}</h4>
      </div>
      <p className="text-slate-700 text-sm leading-relaxed">{description}</p>
    </div>
  );
};
