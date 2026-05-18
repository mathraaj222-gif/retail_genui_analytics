"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { 
  LayoutDashboard, MessageSquare, Settings, LogOut, Sparkles, PieChart,
  BarChart4, Activity, Target, BrainCircuit, Box, MapPin, Zap
} from "lucide-react";

function SidebarContent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const view = searchParams.get('view') || 'executive';

  return (
      <aside className="w-72 bg-white border-r border-slate-200 flex flex-col shadow-xl relative z-20">
        <div className="p-8">
          <div className="flex items-center gap-4 cursor-pointer group">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-2.5 rounded-xl shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/40 transition-shadow">
              <BrainCircuit className="w-6 h-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold text-slate-900 tracking-tighter leading-none">RetailAI</span>
              <span className="text-[10px] text-blue-600 font-bold uppercase tracking-widest mt-1">Intelligence Core</span>
            </div>
          </div>
        </div>

        <div className="px-4 py-2 flex-1 overflow-y-auto custom-scrollbar">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4 ml-4">AI Core</p>
          <nav className="space-y-1 mb-6">
            <NavItem icon={MessageSquare} label="AI GenUI Chat" href="/chat" active={pathname === "/chat" || pathname === "/"} />
          </nav>
        </div>

        <div className="px-4 py-4 mt-auto border-t border-slate-100 bg-slate-50/50">
          <nav className="space-y-1">
            <NavItem icon={Settings} label="System Config" href="#" />
          </nav>
        </div>
      </aside>
  );
}

export default function AppLayout({ children }) {
  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 overflow-hidden font-outfit">
      <React.Suspense fallback={<aside className="w-72 bg-white border-r border-slate-200 flex flex-col shadow-xl relative z-20"></aside>}>
        <SidebarContent />
      </React.Suspense>

      {/* MAIN VIEWPORT */}
      <main className="flex-1 flex flex-col relative overflow-hidden bg-slate-50">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-100 blur-[120px] rounded-full pointer-events-none" />
        <div className="flex-1 overflow-y-auto relative z-10 custom-scrollbar">
          {children}
        </div>
      </main>
    </div>
  );
}

function NavItem({ icon: Icon, label, href, active }) {
  return (
    <Link 
      href={href}
      className={`
        group flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300
        ${active 
          ? "bg-blue-600 shadow-md text-white" 
          : "text-slate-500 hover:bg-slate-100 hover:text-slate-900 border border-transparent"
        }
      `}
    >
      <div className={`
        p-1.5 rounded-lg transition-colors
        ${active ? "bg-white/20 text-white" : "bg-slate-100 group-hover:bg-slate-200"}
      `}>
        <Icon className="w-4 h-4" />
      </div>
      <span className={`text-sm tracking-wide ${active ? 'font-bold' : 'font-medium'} whitespace-nowrap`}>{label}</span>
      {active && (
        <div className="ml-auto">
          <Sparkles className="w-3 h-3 text-blue-200 animate-pulse" />
        </div>
      )}
    </Link>
  );
}
