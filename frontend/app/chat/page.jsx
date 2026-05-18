"use client";

import React, { useState } from "react";
import DynamicView from "@/components/DynamicView";
import { fetchAnalytics } from "@/lib/api/client";
import { Sparkles, ArrowUp, Store, TrendingUp, ShoppingBag, BarChart3, HelpCircle } from "lucide-react";

export default function GenUIChat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const askAI = async (overridePrompt, directEndpoint = null) => {
    const promptToSend = typeof overridePrompt === "string" ? overridePrompt : input;
    if (!promptToSend.trim()) return;

    const userMsg = { role: "user", content: promptToSend };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const fetchUrl = directEndpoint ? directEndpoint : "/analytics/autonomous/query";
      const fetchOptions = directEndpoint 
        ? { method: "GET" }
        : {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ prompt: promptToSend }),
          };

      const data = await fetchAnalytics(fetchUrl, fetchOptions);
      
      if (data) {
        setMessages(prev => [...prev, { role: "assistant", payload: data }]);
      } else {
        setMessages(prev => [...prev, { role: "assistant", content: "Apologies, the query core is currently unreachable." }]);
      }
    } catch (err) {
      setMessages(prev => [...prev, { role: "assistant", content: "Communication failure. The retail intelligence engine is offline." }]);
    } finally {
      setLoading(false);
    }
  };

  const sampleQuestions = [
    {
      text: "Show me the predictive sales forecasting and demand models.",
      desc: "30-day predictive volume forecast using pre-trained ML models",
      endpoint: "/analytics/predictive/demand-forecast"
    },
    {
      text: "Which products are the top performing by sales?",
      desc: "Top 10 highest performing retail items by volume",
      endpoint: "/analytics/descriptive/top-products"
    },
    {
      text: "What is the promotional campaign effectiveness by type?",
      desc: "Interactive breakdown of promo type sales contributions",
      endpoint: "/analytics/descriptive/campaign-performance"
    },
    {
      text: "What are the prescriptive recommendations for campaign inventory allocation?",
      desc: "Strategic inventory allocations and high-impact action recommendations",
      endpoint: "/analytics/prescriptive/recommendations"
    }
  ];

  return (
    <div className="flex flex-col h-full max-w-5xl mx-auto p-6">
      <div className="flex-1 overflow-y-auto space-y-10 py-10 custom-scrollbar">
        {messages.length === 0 ? (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header Block */}
            <div className="bg-slate-900 border border-slate-800 p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-[80px]" />
              <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-[80px]" />
              
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                  <Sparkles className="text-white w-6 h-6 animate-pulse" />
                </div>
                <span className="text-[10px] bg-blue-900/40 text-blue-400 border border-blue-800 px-3 py-1 rounded-full font-bold uppercase tracking-widest">
                  Enterprise AI
                </span>
              </div>
              
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight mb-4">
                Welcome to the AtliQ Mart <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-emerald-400 bg-clip-text text-transparent">AI Retail Intelligence Platform</span>
              </h1>
              
              <p className="text-slate-300 text-base leading-relaxed mb-4">
                This project showcases an AI-powered retail analytics and business intelligence system developed around the promotional campaigns conducted by AtliQ Mart — a retail giant operating more than 50 supermarkets across Southern India.
              </p>
              
              <p className="text-slate-400 text-sm leading-relaxed">
                During the Diwali 2023 and Sankranti 2024 festive seasons, AtliQ Mart launched large-scale promotional campaigns on its AtliQ branded products across all stores. The objective of this platform is to analyze the effectiveness of those promotions using advanced analytics, AI-driven insights, forecasting models, and executive-level business intelligence visualizations.
              </p>
            </div>

            {/* Explorational Pillars */}
            <div className="bg-slate-900/50 border border-slate-800/80 p-8 rounded-[2.5rem] shadow-xl">
              <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <Store className="text-blue-500 w-5 h-5" />
                This AI GenUI Analytics Platform enables users to explore:
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-slate-300 text-sm">
                <div className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-800/30 transition-colors">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0" />
                  <span>Store performance and revenue uplift analysis</span>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-800/30 transition-colors">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0" />
                  <span>Promotion effectiveness and ROI intelligence</span>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-800/30 transition-colors">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0" />
                  <span>Product and category response behavior</span>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-800/30 transition-colors">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0" />
                  <span>Incremental Revenue (IR) and Incremental Sold Units (ISU)</span>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-800/30 transition-colors">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0" />
                  <span>Predictive sales forecasting and anomaly detection</span>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-800/30 transition-colors">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0" />
                  <span>Prescriptive recommendation systems for future campaigns</span>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-800/30 transition-colors">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0" />
                  <span>Correlation analysis between product categories and promotion strategies</span>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-800/30 transition-colors">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0" />
                  <span>AI-generated business insights and executive summaries</span>
                </div>
              </div>
            </div>

            {/* Quick Suggestions */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-slate-500" />
                Select a Quick Analysis Suggestion
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {sampleQuestions.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => askAI(q.text, q.endpoint)}
                    className="text-left bg-slate-900 hover:bg-slate-800/80 border border-slate-800 hover:border-slate-700 p-5 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 group relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl group-hover:bg-blue-500/10 transition-all" />
                    <p className="text-white font-bold text-sm leading-snug mb-1 group-hover:text-blue-400 transition-colors">
                      {q.text}
                    </p>
                    <p className="text-slate-400 text-xs">
                      {q.desc}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          messages.map((msg, i) => (
            <div key={i} className={`flex gap-6 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              {msg.role === "assistant" && (
                <div className="w-10 h-10 bg-slate-900 border border-slate-850 rounded-xl shrink-0 flex items-center justify-center">
                  <Sparkles className="text-blue-500 w-5 h-5" />
                </div>
              )}
              <div className={`max-w-[90%] ${msg.role === "user" ? "bg-blue-600 text-white px-6 py-4 rounded-3xl shadow-lg font-medium text-base" : "w-full"}`}>
                {msg.content && <p className="leading-relaxed">{msg.content}</p>}
                {msg.payload && (
                  <DynamicView 
                    schema={msg.payload.schema} 
                    data={msg.payload.data} 
                    insights={msg.payload.insights}
                    executive_summary={msg.payload.executive_summary}
                    recommendations={msg.payload.recommendations}
                    plain_english={msg.payload.plain_english}
                    viz_explanation={msg.payload.viz_explanation}
                  />
                )}
              </div>
            </div>
          ))
        )}
        {loading && (
          <div className="flex gap-4 items-center">
            <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <span className="text-slate-500 text-xs font-bold uppercase tracking-widest">AI Retail Engine is computing...</span>
          </div>
        )}
      </div>

      <div className="relative mt-auto pt-6">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask anything about your retail campaigns..."
          className="w-full bg-slate-900 border border-slate-800 rounded-[2rem] p-6 pr-20 text-white focus:ring-2 focus:ring-blue-600 outline-none min-h-[80px] text-base resize-none shadow-2xl transition-all"
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), askAI())}
        />
        <button onClick={askAI} className="absolute right-4 bottom-10 bg-blue-600 text-white p-3 rounded-2xl hover:bg-blue-500 shadow-lg transition-all hover:scale-105 active:scale-95">
          <ArrowUp className="w-5 h-5 stroke-[3px]" />
        </button>
      </div>
    </div>
  );
}

