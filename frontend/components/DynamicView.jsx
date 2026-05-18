"use client";

import React from "react";
import { 
  CustomBarChart, 
  CustomLineChart, 
  CustomPieChart, 
  CustomAreaChart, 
  BubbleScatterChart,
  KPICard,
  StackedBarChart,
  HorizontalStackedBarChart,
  resolveKeys
} from "./Charts";
import { InsightTile } from "./Cards";

// HELPER: Dynamically pivot flat database records for stacked/clustered visual segments
const autoPivotData = (activeData, xKey, yKey) => {
  if (!activeData || activeData.length === 0) return { pivotedData: [], keys: [] };
  
  // Find the exact casing and matched xKey and yKey in the active dataset
  const resolved = resolveKeys(activeData, xKey, yKey);
  const resolvedX = resolved.xKey;
  const resolvedY = resolved.yKey;
  
  const first = activeData[0];
  const columns = Object.keys(first);
  
  // Pivot columns are all columns that are neither the resolved X nor resolved Y axis keys
  const pivotCols = columns.filter(k => k !== resolvedX && k !== resolvedY);
  
  if (pivotCols.length === 0) {
    return { pivotedData: activeData, keys: [resolvedY] };
  }
  
  // Helper to generate a combined pivot key from row item values, skipping redundant single-value columns
  const getPivotKeyRaw = (item) => {
    return pivotCols
      .filter(col => {
        const uniqueVals = Array.from(new Set(activeData.map(r => r[col])));
        return uniqueVals.length > 1;
      })
      .map(col => String(item[col] || ''))
      .filter(Boolean)
      .join(" - ");
  };
  
  // Determine if there are multiple pivot segments in the active filtered dataset
  const hasMultipleSegments = pivotCols.some(col => {
    const uniqueVals = Array.from(new Set(activeData.map(r => r[col])));
    return uniqueVals.length > 1;
  });
  
  if (!hasMultipleSegments) {
    return { pivotedData: activeData, keys: [resolvedY] };
  }
  
  const uniquePivotValues = Array.from(new Set(activeData.map(item => getPivotKeyRaw(item))));
  
  // Capping segments to Top 9 + OTHER if too many combinations
  let topPivots = uniquePivotValues;
  const isCapped = uniquePivotValues.length > 9;
  
  if (isCapped) {
    const pivotSums = {};
    activeData.forEach(item => {
      const pKey = getPivotKeyRaw(item);
      let yVal = item[resolvedY];
      if (typeof yVal === 'string') {
        yVal = parseFloat(yVal.replace(/[$,%]/g, '')) || 0;
      }
      pivotSums[pKey] = (pivotSums[pKey] || 0) + yVal;
    });
    
    // Sort and slice top 9
    const sortedPivots = Object.keys(pivotSums).sort((a, b) => pivotSums[b] - pivotSums[a]);
    topPivots = sortedPivots.slice(0, 9);
  }
  
  const getPivotKey = (item) => {
    const rawKey = getPivotKeyRaw(item);
    if (!isCapped || topPivots.includes(rawKey)) return rawKey;
    return "OTHER";
  };
  
  const finalKeys = isCapped ? [...topPivots, "OTHER"] : uniquePivotValues;
  
  const grouped = {};
  activeData.forEach(item => {
    const xVal = item[resolvedX];
    const pivotVal = getPivotKey(item) || resolvedY;
    let yVal = item[resolvedY];
    
    if (typeof yVal === 'string') {
      yVal = parseFloat(yVal.replace(/[$,%]/g, '')) || 0;
    }
    
    if (!grouped[xVal]) {
      grouped[xVal] = { [resolvedX]: xVal };
      finalKeys.forEach(pv => {
        grouped[xVal][pv] = 0;
      });
      if (!finalKeys.includes(resolvedY)) {
        grouped[xVal][resolvedY] = 0;
      }
    }
    
    grouped[xVal][pivotVal] = (grouped[xVal][pivotVal] || 0) + yVal;
  });
  
  return { 
    pivotedData: Object.values(grouped), 
    keys: finalKeys 
  };
};

export default function DynamicView({ schema, data, insights, executive_summary, recommendations, plain_english, viz_explanation }) {
  const [selectedCampaign, setSelectedCampaign] = React.useState("All");

  if (!schema || !data) return null;

  if (Array.isArray(data) && data.length === 0) {
    return (
      <div className="p-12 text-center bg-slate-50 rounded-[2.5rem] border border-slate-200 shadow-inner">
        <p className="text-slate-500 font-bold uppercase tracking-widest text-sm mb-2">Analysis Complete</p>
        <p className="text-slate-800 text-xl font-medium">No matching data points found for this specific query.</p>
        {plain_english && <p className="mt-4 text-slate-500 italic">"{plain_english}"</p>}
      </div>
    );
  }

  // Detect campaign column and filter options dynamically
  const campaignCol = (() => {
    const firstRow = data[0] || {};
    const columns = Object.keys(firstRow);
    return columns.find(k => k.toLowerCase().includes("campaign"));
  })();

  const campaignNames = (() => {
    if (!campaignCol) return [];
    return Array.from(new Set(data.map(item => String(item[campaignCol]))));
  })();

  const filteredData = (() => {
    if (!campaignCol || selectedCampaign === "All") return data;
    return data.filter(item => String(item[campaignCol]) === selectedCampaign);
  })();

  const renderChart = (chartData) => {
    const { xKey: resolvedX, yKey: resolvedY } = resolveKeys(chartData, schema.xKey, schema.yKey);
    const columns = Object.keys(chartData[0] || {});
    const hasPivot = columns.length >= 3 && columns.some(k => k !== resolvedX && k !== resolvedY);
    
    let chartType = schema.type;
    if (hasPivot && (chartType === "bar" || chartType === "treemap" || !["stacked_bar", "horizontal_stacked_bar", "line", "pie", "area", "scatter", "kpi"].includes(chartType))) {
      chartType = "stacked_bar";
    }

    switch (chartType) {
      case "stacked_bar": {
        const { pivotedData, keys } = autoPivotData(chartData, schema.xKey, schema.yKey);
        return <StackedBarChart data={pivotedData} xKey={resolvedX} keys={keys} />;
      }
      case "horizontal_stacked_bar": {
        const { pivotedData, keys } = autoPivotData(chartData, schema.xKey, schema.yKey);
        return <HorizontalStackedBarChart data={pivotedData} keys={keys} yKey={resolvedX} />;
      }
      case "bar": return <CustomBarChart data={chartData} xKey={resolvedX} yKey={resolvedY} />;
      case "line": return <CustomLineChart data={chartData} xKey={resolvedX} yKey={resolvedY} />;
      case "pie": return <CustomPieChart data={chartData} nameKey={resolvedX} dataKey={resolvedY} />;
      case "area": return <CustomAreaChart data={chartData} xKey={resolvedX} yKey={resolvedY} />;
      case "scatter": return <BubbleScatterChart data={chartData} xKey={resolvedX} yKey={resolvedY} zKey={resolvedY} nameKey="name" />;
      case "kpi": return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {chartData.map((kpi, idx) => (
            <KPICard key={idx} title={kpi.label} value={kpi.value} unit={kpi.unit} trend={kpi.trend} />
          ))}
        </div>
      );
      default: return <CustomBarChart data={chartData} xKey={resolvedX} yKey={resolvedY} />;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Executive Header */}
      {executive_summary && (
        <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-2xl mb-8">
          <h3 className="text-blue-600 text-xs font-bold uppercase tracking-widest mb-2">Executive Summary</h3>
          <p className="text-xl text-slate-800 font-medium leading-relaxed italic">"{executive_summary}"</p>
        </div>
      )}

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">{schema.title}</h2>
        <div className="flex items-center gap-3">
          <div className="text-[10px] bg-slate-100 text-slate-500 border border-slate-200 px-3 py-1 rounded-full font-bold uppercase tracking-widest">
            {schema.type}
          </div>
          <div className="text-[10px] bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full font-bold uppercase tracking-widest">
            AI Verified
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-[2.5rem] border border-slate-200 shadow-sm flex flex-col lg:flex-row gap-6">
        {/* Campaign filter card */}
        {campaignCol && campaignNames.length > 1 && (
          <div className="lg:w-60 flex-shrink-0 lg:border-r border-slate-100 lg:pr-6 flex flex-col gap-4">
            <div>
              <h4 className="text-slate-800 text-xs font-extrabold uppercase tracking-wider mb-1">Campaign Focus</h4>
              <p className="text-slate-400 text-[10px] leading-relaxed">Toggle filters to segment promotion splits dynamically.</p>
            </div>
            
            <div className="flex flex-row lg:flex-col flex-wrap gap-2 mt-2">
              <button
                onClick={() => setSelectedCampaign("All")}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl border text-xs font-bold tracking-wide transition-all duration-300 ${
                  selectedCampaign === "All"
                    ? "bg-slate-900 border-slate-900 text-white shadow-md shadow-slate-200"
                    : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                }`}
              >
                <div className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center transition-all ${
                  selectedCampaign === "All" ? "border-white bg-white" : "border-slate-300 bg-transparent"
                }`}>
                  {selectedCampaign === "All" && <div className="w-1.5 h-1.5 rounded-full bg-slate-900" />}
                </div>
                All Campaigns
              </button>
              
              {campaignNames.map(name => (
                <button
                  key={name}
                  onClick={() => setSelectedCampaign(name)}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-xl border text-xs font-bold tracking-wide transition-all duration-300 ${
                    selectedCampaign === name
                      ? "bg-slate-900 border-slate-900 text-white shadow-md shadow-slate-200"
                      : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <div className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center transition-all ${
                    selectedCampaign === name ? "border-white bg-white" : "border-slate-300 bg-transparent"
                  }`}>
                    {selectedCampaign === name && <div className="w-1.5 h-1.5 rounded-full bg-slate-900" />}
                  </div>
                  {name.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        )}
        
        <div className="flex-1 min-w-0">
          {renderChart(filteredData)}
          {viz_explanation && (
            <p className="text-[10px] text-slate-500 mt-4 text-center italic">
              AI Selection Logic: {viz_explanation}
            </p>
          )}
        </div>
      </div>

      {/* Plain English Explanation */}
      {plain_english && (
        <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 shadow-inner">
          <h4 className="text-slate-500 text-xs font-bold uppercase mb-3">AI Interpretation</h4>
          <p className="text-slate-700 leading-relaxed">{plain_english}</p>
        </div>
      )}

      {/* Recommendations */}
      {recommendations && recommendations.length > 0 && (
        <div className="space-y-4">
          <h4 className="text-slate-500 text-xs font-bold uppercase tracking-widest">Strategic Recommendations</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recommendations.map((rec, i) => (
              <div key={i} className="bg-white border border-slate-200 shadow-sm p-5 rounded-2xl flex gap-4 hover:shadow-md transition-shadow">
                <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${rec.urgency === 'high' ? 'bg-rose-500' : 'bg-emerald-500'}`} />
                <div>
                  <p className="text-slate-900 font-bold mb-1">{rec.action}</p>
                  <p className="text-slate-600 text-sm">{rec.impact}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Insight Tiles */}
      {insights && insights.length > 0 && (
        <div className="space-y-4">
          <h4 className="text-slate-500 text-xs font-bold uppercase tracking-widest">Deep Analytics Findings</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {insights.map((item, i) => (
              <InsightTile key={i} {...item} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

