"use client";

import React from "react";
import Link from "next/link";
import { 
  Zap, BrainCircuit, Terminal, Layers, Star, 
  Globe, Link2, Mail, ArrowRight, ShieldCheck, Cpu 
} from "lucide-react";

export default function AboutArchitect() {
  const skills = [
    { category: "AI & Reasoning", items: ["Autonomous Agents", "Tool-Calling", "GenUI Architectures", "LLM Orchestration", "Prompt Engineering"] },
    { category: "Backend & Analytics", items: ["FastAPI", "Python (Pandas/Scikit)", "ML Forecasting", "SQL (Postgres/SQLite)", "Data Pipelines"] },
    { category: "Frontend Engineering", items: ["Next.js (App Router)", "React", "TailwindCSS", "Recharts Visualization", "UX/UI Interactions"] },
    { category: "DevOps & Cloud", items: ["Docker Orchestration", "Railway", "Git Workflows", "API Integration", "CI/CD Pipelines"] }
  ];

  return (
    <div className="flex flex-col gap-10 py-4 max-w-5xl mx-auto animate-in fade-in duration-300">
      
      {/* PROFESSIONAL PROFILE BANNER */}
      <div className="bg-white border border-[#e5e5e7] p-8 rounded-2xl shadow-sm flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
        {/* Profile Avatar */}
        <div className="relative flex-shrink-0 group">
          <div className="w-24 h-24 rounded-full border border-[#e5e5e7] bg-[#f5f5f7] flex items-center justify-center relative overflow-hidden transition-colors group-hover:border-blue-400">
            <BrainCircuit className="w-12 h-12 text-blue-600" />
          </div>
        </div>

        {/* Bio Details */}
        <div className="flex-1 space-y-3 text-center md:text-left">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
            <span className="text-[9px] bg-blue-50 text-blue-600 border border-blue-200 px-2 py-0.5 rounded font-bold uppercase tracking-wider flex items-center gap-1">
              <Star className="w-2.5 h-2.5 fill-blue-600" />
              Lead Architect
            </span>
            <span className="text-[9px] bg-slate-100 text-[#515154] px-2 py-0.5 rounded font-bold uppercase tracking-wider">
              Full-Stack AI Specialist
            </span>
          </div>

          <h1 className="text-3xl font-bold text-[#1d1d1f] font-serif">
            Intelligence Systems Architect
          </h1>

          <p className="text-[#515154] text-xs leading-relaxed max-w-2xl font-lato">
            Passionate software engineer and data architect dedicated to bridging the gap between raw database schemas and executive cognitive reasoning. Specializes in autonomous AI agents, descriptive pipelines, and dynamic generative UI components.
          </p>

          {/* Social Connections */}
          <div className="flex justify-center md:justify-start gap-3 text-[#86868b]">
            <button className="p-1.5 bg-white border border-[#e5e5e7] rounded-lg hover:text-blue-600 hover:border-blue-400 transition-colors">
              <Globe className="w-3.5 h-3.5" />
            </button>
            <button className="p-1.5 bg-white border border-[#e5e5e7] rounded-lg hover:text-blue-600 hover:border-blue-400 transition-colors">
              <Link2 className="w-3.5 h-3.5" />
            </button>
            <button className="p-1.5 bg-white border border-[#e5e5e7] rounded-lg hover:text-blue-600 hover:border-blue-400 transition-colors">
              <Mail className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      <div className="border-t border-[#e5e5e7] my-2" />

      {/* CORE CONTRIBUTIONS SHOWCASE */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-[#1d1d1f] font-serif">Key Analytical Contributions</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white border border-[#e5e5e7] p-6 rounded-xl hover:border-blue-400 transition-colors shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-lg bg-slate-100 text-blue-600 flex items-center justify-center">
                <Cpu className="w-4 h-4" />
              </div>
              <h3 className="text-[#1d1d1f] font-bold text-sm font-serif">LLM Intent Orchestration</h3>
            </div>
            <p className="text-[#515154] text-xs leading-relaxed font-lato">
              Designed prompt templates and intent parser matching natural language inputs directly to relational database schemas. Built the layout generator that dynamically compiles chart specifications from conversational responses.
            </p>
          </div>

          <div className="bg-white border border-[#e5e5e7] p-6 rounded-xl hover:border-blue-400 transition-colors shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-lg bg-slate-100 text-blue-600 flex items-center justify-center">
                <Terminal className="w-4 h-4" />
              </div>
              <h3 className="text-[#1d1d1f] font-bold text-sm font-serif">Deterministic Analytics Service</h3>
            </div>
            <p className="text-[#515154] text-xs leading-relaxed font-lato">
              Engineered core SQL query routines in FastAPI to calculate business metrics such as Incremental Revenue (IR) and Incremental Sold Units (ISU) securely and consistently without mathematical variance.
            </p>
          </div>

          <div className="bg-white border border-[#e5e5e7] p-6 rounded-xl hover:border-blue-400 transition-colors shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-lg bg-slate-100 text-blue-600 flex items-center justify-center">
                <Layers className="w-4 h-4" />
              </div>
              <h3 className="text-[#1d1d1f] font-bold text-sm font-serif">Adaptive Component Renderer</h3>
            </div>
            <p className="text-[#515154] text-xs leading-relaxed font-lato">
              Created the frontend schema-validation mapping layer that reads dynamic, AI-generated JSON layouts and maps them to interactive Recharts visual templates with zero rendering stutter.
            </p>
          </div>

          <div className="bg-white border border-[#e5e5e7] p-6 rounded-xl hover:border-blue-400 transition-colors shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-lg bg-slate-100 text-blue-600 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h3 className="text-[#1d1d1f] font-bold text-sm font-serif">Predictive Forecasting Models</h3>
            </div>
            <p className="text-[#515154] text-xs leading-relaxed font-lato">
              Integrated Python predictive modeling frameworks within the backend data service to supply realistic demand forecasts and prescriptive stock allocation insights.
            </p>
          </div>
        </div>
      </div>

      {/* TECH STACK SKILLS GRID */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-[#1d1d1f] font-serif">Skills Index</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {skills.map((skillGroup, idx) => (
            <div key={idx} className="bg-white border border-[#e5e5e7] p-5 rounded-xl hover:border-blue-400 transition-colors shadow-sm flex flex-col gap-3">
              <h4 className="text-[#1d1d1f] text-xs font-extrabold uppercase border-b border-[#e5e5e7] pb-1.5 font-lato">
                {skillGroup.category}
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {skillGroup.items.map((item, itemIdx) => (
                  <span 
                    key={itemIdx} 
                    className="text-[9px] bg-slate-50 border border-[#e5e5e7] text-[#515154] font-semibold px-2 py-0.5 rounded transition-colors hover:border-blue-500 hover:bg-white cursor-default font-lato"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
