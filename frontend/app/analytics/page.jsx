"use client";

import React, { useState, useEffect } from "react";
import DynamicView from "@/components/DynamicView";
import { fetchAnalytics } from "@/lib/api/client";
import { 
  Sparkles, ArrowUp, Store, TrendingUp, ShoppingBag, 
  HelpCircle, MessageSquare, BarChart4, Loader2, RefreshCw
} from "lucide-react";

export default function AnalyticsCore() {
  const [activeTab, setActiveTab] = useState("dashboard"); // "dashboard" or "chat"
  
  // Dashboard Analytics States
  const [kpis, setKpis] = useState(null);
  const [campaignData, setCampaignData] = useState(null);
  const [categoryData, setCategoryData] = useState(null);
  const [topProductsData, setTopProductsData] = useState(null);
  const [demandData, setDemandData] = useState(null);
  const [recommendationsData, setRecommendationsData] = useState(null);
  const [loadingDashboard, setLoadingDashboard] = useState(true);
  const [refreshingDashboard, setRefreshingDashboard] = useState(false);

  // Chat AI States
  const [messages, setMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [loadingChat, setLoadingChat] = useState(false);

  // Fetch Dashboard data concurrently
  const fetchDashboardData = async (isSilentRefresh = false) => {
    if (!isSilentRefresh) setLoadingDashboard(true);
    else setRefreshingDashboard(true);
    
    try {
      const [kpisRes, campaignRes, categoryRes, topProductsRes, demandRes, recommendationsRes] = await Promise.allSettled([
        fetchAnalytics("/analytics/metrics/executive-kpis"),
        fetchAnalytics("/analytics/descriptive/campaign-performance"),
        fetchAnalytics("/analytics/descriptive/category-performance"),
        fetchAnalytics("/analytics/descriptive/top-products"),
        fetchAnalytics("/analytics/predictive/demand-forecast"),
        fetchAnalytics("/analytics/prescriptive/recommendations")
      ]);

      if (kpisRes.status === "fulfilled" && kpisRes.value) setKpis(kpisRes.value);
      if (campaignRes.status === "fulfilled" && campaignRes.value) setCampaignData(campaignRes.value);
      if (categoryRes.status === "fulfilled" && categoryRes.value) setCategoryData(categoryRes.value);
      if (topProductsRes.status === "fulfilled" && topProductsRes.value) setTopProductsData(topProductsRes.value);
      if (demandRes.status === "fulfilled" && demandRes.value) setDemandData(demandRes.value);
      if (recommendationsRes.status === "fulfilled" && recommendationsRes.value) setRecommendationsData(recommendationsRes.value);
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setLoadingDashboard(false);
      setRefreshingDashboard(false);
    }
  };

  useEffect(() => {
    if (activeTab === "dashboard") {
      fetchDashboardData();
    }
  }, [activeTab]);

  // AI Chat Logic
  const askAI = async (overridePrompt, directEndpoint = null) => {
    const promptToSend = typeof overridePrompt === "string" ? overridePrompt : chatInput;
    if (!promptToSend.trim()) return;

    const userMsg = { role: "user", content: promptToSend };
    setMessages(prev => [...prev, userMsg]);
    setChatInput("");
    setLoadingChat(true);

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
      setLoadingChat(false);
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
      desc: "Breakdown of promo type sales contributions",
      endpoint: "/analytics/descriptive/campaign-performance"
    },
    {
      text: "What are the prescriptive recommendations for campaign inventory allocation?",
      desc: "Strategic inventory allocations and high-impact actions",
      endpoint: "/analytics/prescriptive/recommendations"
    }
  ];

  return (
    <div className="flex flex-col h-full gap-6">
      {/* SUB TAB SELECTOR HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-2 border-b border-[#e5e5e7]">
        <div>
          <h2 className="text-2xl font-bold font-serif text-[#1d1d1f]">Analytics Core</h2>
        </div>

        {/* Tab Buttons */}
        <div className="flex bg-slate-100 border border-[#e5e5e7] p-1 rounded-xl font-lato">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              activeTab === "dashboard"
                ? "bg-white text-blue-600 shadow-sm border border-[#e5e5e7]"
                : "text-[#515154] hover:text-blue-600"
            }`}
          >
            <BarChart4 className="w-3.5 h-3.5" />
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab("chat")}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              activeTab === "chat"
                ? "bg-white text-blue-600 shadow-sm border border-[#e5e5e7]"
                : "text-[#515154] hover:text-blue-600"
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            Chat with Data
          </button>
        </div>
      </div>

      {/* VIEWPORT AREA */}
      <div className="flex-1">
        
        {/* =========================================
            DASHBOARD VIEW
            ========================================= */}
        {activeTab === "dashboard" && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Action Bar */}
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold font-serif text-[#1d1d1f]">Performance Indicators</h3>
              </div>
              <button 
                onClick={() => fetchDashboardData(true)} 
                disabled={refreshingDashboard}
                className="flex items-center gap-2 px-3 py-1.5 border border-[#e5e5e7] rounded-xl bg-white hover:bg-slate-50 text-xs text-[#515154] font-medium transition-colors disabled:opacity-50 font-lato"
              >
                <RefreshCw className={`w-3 h-3 ${refreshingDashboard ? 'animate-spin' : ''}`} />
                {refreshingDashboard ? 'Refreshing...' : 'Refresh'}
              </button>
            </div>

            {/* KPI Cards Grid */}
            {loadingDashboard ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map(idx => (
                  <div key={idx} className="bg-white border border-[#e5e5e7] p-6 rounded-xl h-28 animate-pulse space-y-4 shadow-sm">
                    <div className="h-3 w-20 bg-slate-100 rounded" />
                    <div className="h-5 w-28 bg-slate-50 rounded" />
                  </div>
                ))}
              </div>
            ) : kpis ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Incremental Revenue Card */}
                <div className="bg-white border border-[#e5e5e7] p-6 rounded-xl hover:border-blue-400 transition-colors shadow-sm">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-[#86868b] text-[10px] font-bold uppercase tracking-widest font-lato">Incremental Revenue</h3>
                    <TrendingUp className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="flex items-baseline gap-2">
                    <div className="text-2xl font-bold text-[#1d1d1f] font-serif">{kpis.incremental_rev}</div>
                    <span className="text-xs font-semibold text-emerald-600 font-lato">{kpis.revenue_uplift}</span>
                  </div>
                </div>

                {/* ROI Card */}
                <div className="bg-white border border-[#e5e5e7] p-6 rounded-xl hover:border-blue-400 transition-colors shadow-sm">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-[#86868b] text-[10px] font-bold uppercase tracking-widest font-lato">Promotion ROI</h3>
                    <Sparkles className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="flex items-baseline gap-2">
                    <div className="text-2xl font-bold text-[#1d1d1f] font-serif">{kpis.promotion_roi}</div>
                  </div>
                </div>

                {/* Sales growth card */}
                <div className="bg-white border border-[#e5e5e7] p-6 rounded-xl hover:border-blue-400 transition-colors shadow-sm">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-[#86868b] text-[10px] font-bold uppercase tracking-widest font-lato">Quantity Uplift</h3>
                    <ShoppingBag className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="flex items-baseline gap-2">
                    <div className="text-2xl font-bold text-[#1d1d1f] font-serif">{kpis.avg_qty_growth}</div>
                  </div>
                </div>

                {/* Star Store Card */}
                <div className="bg-white border border-[#e5e5e7] p-6 rounded-xl hover:border-blue-400 transition-colors shadow-sm">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-[#86868b] text-[10px] font-bold uppercase tracking-widest font-lato">Highest-Revenue Store</h3>
                    <Store className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="flex items-baseline gap-2">
                    <div className="text-2xl font-bold text-[#1d1d1f] font-serif">{kpis.top_store}</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-6 text-center bg-white border border-[#e5e5e7] rounded-xl text-[#86868b] text-xs font-lato">
                Failed to load indicators
              </div>
            )}

            {/* Visual Analytics Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Campaign Performance Panel */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-[#1d1d1f] uppercase tracking-wider ml-1 font-lato">Campaign Channel Mix</h3>
                {loadingDashboard ? (
                  <div className="bg-white border border-[#e5e5e7] rounded-2xl h-[380px] animate-pulse shadow-sm" />
                ) : campaignData ? (
                  <div className="bg-white border border-[#e5e5e7] p-4 rounded-2xl shadow-sm">
                    <DynamicView {...campaignData} />
                  </div>
                ) : (
                  <div className="bg-white border border-[#e5e5e7] rounded-2xl h-[380px] flex items-center justify-center text-[#86868b] text-xs font-lato">Awaiting campaign mix data</div>
                )}
              </div>

              {/* Category Sales Panel */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-[#1d1d1f] uppercase tracking-wider ml-1 font-lato">Category Sales Distribution</h3>
                {loadingDashboard ? (
                  <div className="bg-white border border-[#e5e5e7] rounded-2xl h-[380px] animate-pulse shadow-sm" />
                ) : categoryData ? (
                  <div className="bg-white border border-[#e5e5e7] p-4 rounded-2xl shadow-sm">
                    <DynamicView {...categoryData} />
                  </div>
                ) : (
                  <div className="bg-white border border-[#e5e5e7] rounded-2xl h-[380px] flex items-center justify-center text-[#86868b] text-xs font-lato">Awaiting category split data</div>
                )}
              </div>

              {/* Top Products Panel */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-[#1d1d1f] uppercase tracking-wider ml-1 font-lato">Top Volume Performers</h3>
                {loadingDashboard ? (
                  <div className="bg-white border border-[#e5e5e7] rounded-2xl h-[380px] animate-pulse shadow-sm" />
                ) : topProductsData ? (
                  <div className="bg-white border border-[#e5e5e7] p-4 rounded-2xl shadow-sm">
                    <DynamicView {...topProductsData} />
                  </div>
                ) : (
                  <div className="bg-white border border-[#e5e5e7] rounded-2xl h-[380px] flex items-center justify-center text-[#86868b] text-xs font-lato">Awaiting product metrics</div>
                )}
              </div>

              {/* Predictive Forecast Panel */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-[#1d1d1f] uppercase tracking-wider ml-1 font-lato">Demand Forecasting Model</h3>
                {loadingDashboard ? (
                  <div className="bg-white border border-[#e5e5e7] rounded-2xl h-[380px] animate-pulse shadow-sm" />
                ) : demandData ? (
                  <div className="bg-white border border-[#e5e5e7] p-4 rounded-2xl shadow-sm">
                    <DynamicView {...demandData} />
                  </div>
                ) : (
                  <div className="bg-white border border-[#e5e5e7] rounded-2xl h-[380px] flex items-center justify-center text-[#86868b] text-xs font-lato">Awaiting forecast models</div>
                )}
              </div>
            </div>

            {/* Prescriptive Inventory Panel */}
            <div className="space-y-3 pt-2">
              <h3 className="text-sm font-bold text-[#1d1d1f] uppercase tracking-wider ml-1 font-lato">Strategic Inventory Allocations</h3>
              {loadingDashboard ? (
                <div className="bg-white border border-[#e5e5e7] rounded-2xl h-[280px] animate-pulse shadow-sm" />
              ) : recommendationsData ? (
                <div className="bg-white border border-[#e5e5e7] p-4 rounded-2xl shadow-sm">
                  <DynamicView {...recommendationsData} />
                </div>
              ) : (
                <div className="bg-white border border-[#e5e5e7] rounded-2xl h-[280px] flex items-center justify-center text-[#86868b] text-xs font-lato">Awaiting recommendations</div>
              )}
            </div>

          </div>
        )}

        {/* =========================================
            AI GENUI CHAT VIEW
            ========================================= */}
        {activeTab === "chat" && (
          <div className="flex flex-col h-[calc(100vh-14rem)] max-w-4xl mx-auto animate-in fade-in duration-300 relative justify-between">
            <div className="flex-1 overflow-y-auto space-y-8 py-2 custom-scrollbar">
              {messages.length === 0 ? (
                <div className="space-y-6 animate-in fade-in duration-500">
                  {/* Header Block */}
                  <div className="bg-white border border-[#e5e5e7] p-6 rounded-2xl shadow-sm relative overflow-hidden">
                    <h3 className="text-lg font-bold font-serif text-[#1d1d1f] mb-2">
                      Conversational Analytics
                    </h3>
                    <p className="text-[#515154] text-xs leading-relaxed max-w-2xl font-lato">
                      Ask business logic questions about promotion effectiveness, store revenue contributions, margin compressions, or category lifts, and get dynamically rendered visualization widgets directly from the AI analysis core.
                    </p>
                  </div>

                  {/* Quick Suggestions */}
                  <div className="space-y-3 font-lato">
                    <h4 className="text-[10px] font-bold text-[#86868b] uppercase tracking-wider flex items-center gap-1.5">
                      <HelpCircle className="w-3.5 h-3.5 text-[#86868b]" />
                      Sample Prompts
                    </h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {sampleQuestions.map((q, idx) => (
                        <button
                          key={idx}
                          onClick={() => askAI(q.text, q.endpoint)}
                          className="text-left bg-white border border-[#e5e5e7] hover:border-blue-400 p-4 rounded-xl shadow-sm transition-colors group"
                        >
                          <p className="text-[#1d1d1f] font-semibold text-xs leading-snug mb-1 group-hover:text-blue-600 transition-colors">
                            {q.text}
                          </p>
                          <p className="text-[#86868b] text-[10px]">
                            {q.desc}
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                messages.map((msg, i) => (
                  <div key={i} className={`flex gap-4 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                    {msg.role === "assistant" && (
                      <div className="w-8 h-8 bg-white border border-[#e5e5e7] rounded-lg shrink-0 flex items-center justify-center shadow-sm">
                        <Sparkles className="text-blue-600 w-4 h-4" />
                      </div>
                    )}
                    <div className={`max-w-[90%] font-lato ${msg.role === "user" ? "bg-blue-600 text-white px-5 py-3 rounded-2xl shadow-sm font-medium text-xs" : "w-full"}`}>
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
              {loadingChat && (
                <div className="flex gap-3 items-center">
                  <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
                  <span className="text-[#86868b] text-[10px] font-semibold uppercase tracking-wider font-lato">AI is calculating...</span>
                </div>
              )}
            </div>

            {/* Chat Input Bar */}
            <div className="bg-[#f5f5f7] pt-3 sticky bottom-0 border-t border-[#e5e5e7] mt-auto">
              <div className="relative font-lato">
                <textarea
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Ask anything about campaign results..."
                  className="w-full bg-white border border-[#e5e5e7] rounded-xl p-4 pr-16 text-[#1d1d1f] focus:ring-1 focus:ring-blue-600 outline-none min-h-[50px] max-h-[100px] text-xs resize-none shadow-sm transition-colors placeholder-[#86868b]"
                  onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), askAI())}
                />
                <button 
                  onClick={askAI} 
                  disabled={loadingChat || !chatInput.trim()}
                  className="absolute right-3.5 bottom-6 bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 disabled:opacity-40 shadow-sm transition-colors"
                >
                  <ArrowUp className="w-3.5 h-3.5 stroke-[2.5px]" />
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
