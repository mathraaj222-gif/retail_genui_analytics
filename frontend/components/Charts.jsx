"use client";

import React from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area, ScatterChart, Scatter, ZAxis, Legend,
  ComposedChart
} from "recharts";

// Shared Theme Constants
const COLORS = ["#3b82f6", "#10b981", "#8b5cf6", "#f59e0b", "#f43f5e", "#06b6d4"];

// HELPER: Intelligent Executive Tooltip Formatter for Percentages and Rupees
const tooltipFormatter = (value, name) => {
  const nameLower = String(name).toLowerCase();
  const isPct = nameLower.includes("pct") || nameLower.includes("percent") || nameLower.includes("growth") || nameLower.includes("margin") || nameLower.includes("rate") || nameLower.includes("effectiveness");
  
  if (isPct) {
    const num = parseFloat(value);
    return [isNaN(num) ? value : `${num.toFixed(2)}%`, name.replace(/_/g, ' ').toUpperCase()];
  }
  
  const isRev = nameLower.includes("revenue") || nameLower.includes("sales") || nameLower.includes("promo_value") || nameLower.includes("price") || nameLower.includes("ir") || nameLower.includes("revenue_after") || nameLower.includes("revenue_before") || nameLower.includes("value");
  if (isRev) {
    const num = parseFloat(value);
    if (!isNaN(num)) {
      if (Math.abs(num) >= 10000000) {
        return [`₹${(num / 10000000).toFixed(2)} Cr`, name.replace(/_/g, ' ').toUpperCase()];
      }
      if (Math.abs(num) >= 100000) {
        return [`₹${(num / 100000).toFixed(2)} L`, name.replace(/_/g, ' ').toUpperCase()];
      }
      return [`₹${num.toLocaleString('en-IN')}`, name.replace(/_/g, ' ').toUpperCase()];
    }
  }
  
  const num = parseFloat(value);
  if (!isNaN(num) && num % 1 !== 0) {
    return [num.toFixed(2), name.replace(/_/g, ' ').toUpperCase()];
  }
  
  return [value, name.replace(/_/g, ' ').toUpperCase()];
};

// HELPER: Resolve keys case-insensitively, fuzzy, and with metric-aware fallback
export const resolveKeys = (data, xKey, yKey) => {
  if (!data || data.length === 0) return { xKey, yKey };
  const first = data[0];
  const keys = Object.keys(first);
  
  let resolvedX = keys.find(k => k.toLowerCase() === xKey?.toLowerCase());
  let resolvedY = keys.find(k => k.toLowerCase() === yKey?.toLowerCase());
  
  if (!resolvedX && xKey) {
    resolvedX = keys.find(k => k.toLowerCase().includes(xKey.toLowerCase()) || xKey.toLowerCase().includes(k.toLowerCase()));
  }
  
  // Try matching resolvedX to common category keys if not found
  if (!resolvedX) {
    resolvedX = keys.find(k => {
      const kl = k.toLowerCase();
      return kl.includes("category") || kl.includes("city") || kl.includes("store") || kl.includes("product") || kl.includes("campaign") || kl.includes("month");
    });
  }
  
  if (!resolvedX) {
    resolvedX = keys[0];
  }
  
  // Resolve Y fuzzy
  if (!resolvedY && yKey) {
    resolvedY = keys.find(k => k.toLowerCase().includes(yKey.toLowerCase()) || yKey.toLowerCase().includes(k.toLowerCase()));
  }
  
  // Fallback: If resolvedY is still not found, locate the correct numeric/metric column (especially for percentages)
  if (!resolvedY) {
    const remainingKeys = keys.filter(k => k !== resolvedX);
    
    // Check for metric terms
    resolvedY = remainingKeys.find(k => {
      const kl = k.toLowerCase();
      return kl.includes("pct") || kl.includes("percentage") || kl.includes("growth") || kl.includes("uplift") || kl.includes("revenue") || kl.includes("sales") || kl.includes("volume") || kl.includes("qty") || kl.includes("quantity") || kl.includes("effectiveness");
    });
    
    // Fallback to the first column containing numbers
    if (!resolvedY) {
      resolvedY = remainingKeys.find(k => {
        return data.some(row => {
          const val = row[k];
          return typeof val === 'number' || (typeof val === 'string' && !isNaN(parseFloat(val.replace(/[$,%]/g, ''))));
        });
      });
    }
  }
  
  return { 
    xKey: resolvedX || xKey, 
    yKey: resolvedY || yKey 
  };
};

// HELPER: Sanitize data for simple charts (bar, line, area, pie)
const sanitizeChartData = (data, xKey, yKey) => {
  if (!data || !Array.isArray(data)) return [];
  
  const resolved = resolveKeys(data, xKey, yKey);
  const rx = resolved.xKey;
  const ry = resolved.yKey;
  
  return data.map(item => {
    const newItem = { ...item };
    const xVal = item[rx];
    let yVal = item[ry];
    
    if (typeof yVal === 'string') {
      const cleaned = yVal.replace(/[$,%]/g, '').trim();
      const parsed = parseFloat(cleaned);
      if (!isNaN(parsed)) {
        yVal = parsed;
      }
    } else if (yVal === null || yVal === undefined) {
      yVal = 0;
    }
    
    newItem[xKey] = xVal;
    newItem[yKey] = yVal;
    return newItem;
  });
};

// HELPER: Sanitize data for scatter charts
const sanitizeScatterData = (data, xKey, yKey, zKey, nameKey) => {
  if (!data || !Array.isArray(data)) return [];
  const first = data[0];
  const keys = Object.keys(first);
  
  const rx = keys.find(k => k.toLowerCase() === xKey?.toLowerCase()) || keys.find(k => k.toLowerCase().includes(xKey?.toLowerCase())) || xKey;
  const ry = keys.find(k => k.toLowerCase() === yKey?.toLowerCase()) || keys.find(k => k.toLowerCase().includes(yKey?.toLowerCase())) || yKey;
  const rz = keys.find(k => k.toLowerCase() === zKey?.toLowerCase()) || keys.find(k => k.toLowerCase().includes(zKey?.toLowerCase())) || zKey;
  const rn = keys.find(k => k.toLowerCase() === nameKey?.toLowerCase()) || keys.find(k => k.toLowerCase().includes(nameKey?.toLowerCase())) || nameKey;
  
  return data.map(item => {
    const newItem = { ...item };
    
    let xVal = item[rx];
    let yVal = item[ry];
    let zVal = item[rz];
    const nVal = item[rn];
    
    if (typeof xVal === 'string') xVal = parseFloat(xVal.replace(/[$,%]/g, '')) || 0;
    if (typeof yVal === 'string') yVal = parseFloat(yVal.replace(/[$,%]/g, '')) || 0;
    if (typeof zVal === 'string') zVal = parseFloat(zVal.replace(/[$,%]/g, '')) || 0;
    
    newItem[xKey] = xVal;
    newItem[yKey] = yVal;
    newItem[zKey] = zVal;
    newItem[nameKey] = nVal;
    
    return newItem;
  });
};

// HELPER: Sanitize data for stacked charts
const sanitizeStackedData = (data, xKey, keys) => {
  if (!data || !Array.isArray(data)) return [];
  const first = data[0];
  const dataKeys = Object.keys(first);
  
  const rx = dataKeys.find(k => k.toLowerCase() === xKey?.toLowerCase()) || dataKeys.find(k => k.toLowerCase().includes(xKey?.toLowerCase())) || xKey;
  
  return data.map(item => {
    const newItem = { ...item };
    newItem[xKey] = item[rx];
    
    keys.forEach(k => {
      const rk = dataKeys.find(dk => dk.toLowerCase() === k.toLowerCase()) || dataKeys.find(dk => dk.toLowerCase().includes(k.toLowerCase())) || k;
      let val = item[rk];
      if (typeof val === 'string') {
        val = parseFloat(val.replace(/[$,%]/g, '')) || 0;
      }
      newItem[k] = val;
    });
    
    return newItem;
  });
};

export const CustomBarChart = ({ data, xKey, yKey }) => {
  const chartData = sanitizeChartData(data, xKey, yKey);
  return (
    <div className="w-full h-[350px] chart-container">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
          <XAxis dataKey={xKey} stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
          <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
          <Tooltip formatter={tooltipFormatter} contentStyle={{ backgroundColor: "#ffffff", borderRadius: "12px", border: "1px solid #e2e8f0", color: "#0f172a", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }} />
          <Legend wrapperStyle={{ fontSize: '10px', color: '#64748b', marginTop: '10px', maxHeight: '60px', overflowY: 'auto', paddingRight: '5px' }} formatter={(value) => value.replace(/_/g, ' ').toUpperCase()} />
          <Bar dataKey={yKey} fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={32} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export const StackedBarChart = ({ data, xKey, keys }) => {
  const chartData = sanitizeStackedData(data, xKey, keys);
  return (
    <div className="w-full h-[350px] chart-container">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
          <XAxis dataKey={xKey} stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
          <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
          <Tooltip formatter={tooltipFormatter} contentStyle={{ backgroundColor: "#ffffff", borderRadius: "12px", border: "1px solid #e2e8f0", color: "#0f172a", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }} />
          <Legend wrapperStyle={{ fontSize: '10px', color: '#64748b', marginTop: '10px', maxHeight: '60px', overflowY: 'auto', paddingRight: '5px' }} formatter={(value) => value.replace(/_/g, ' ').toUpperCase()} />
          {keys.map((k, i) => (
            <Bar key={k} dataKey={k} stackId="a" fill={COLORS[i % COLORS.length]} radius={i === keys.length - 1 ? [4, 4, 0, 0] : [0, 0, 0, 0]} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export const CustomLineChart = ({ data, xKey, yKey }) => {
  const chartData = sanitizeChartData(data, xKey, yKey);
  return (
    <div className="w-full h-[350px] chart-container">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
          <XAxis dataKey={xKey} stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
          <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
          <Tooltip formatter={tooltipFormatter} contentStyle={{ backgroundColor: "#ffffff", borderRadius: "12px", border: "1px solid #e2e8f0", color: "#0f172a", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }} />
          <Legend wrapperStyle={{ fontSize: '10px', color: '#64748b', marginTop: '10px', maxHeight: '60px', overflowY: 'auto', paddingRight: '5px' }} formatter={(value) => value.replace(/_/g, ' ').toUpperCase()} />
          <Line type="monotone" dataKey={yKey} stroke="#8b5cf6" strokeWidth={3} dot={{ r: 4, fill: "#8b5cf6", strokeWidth: 2, stroke: "#ffffff" }} activeDot={{ r: 6, stroke: '#8b5cf6', strokeWidth: 2 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export const CustomPieChart = ({ data, nameKey, dataKey }) => {
  const chartData = sanitizeChartData(data, nameKey, dataKey);
  return (
    <div className="w-full h-[350px] chart-container">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={chartData} cx="50%" cy="50%" innerRadius={70} outerRadius={110} dataKey={dataKey} nameKey={nameKey} paddingAngle={5}>
            {chartData?.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="#ffffff" strokeWidth={2} />
            ))}
          </Pie>
          <Tooltip formatter={tooltipFormatter} contentStyle={{ backgroundColor: "#ffffff", borderRadius: "12px", border: "1px solid #e2e8f0", color: "#0f172a", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }} />
          <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '10px', color: '#64748b', maxHeight: '60px', overflowY: 'auto', paddingRight: '5px' }} formatter={(value) => value.replace(/_/g, ' ').toUpperCase()} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export const CustomAreaChart = ({ data, xKey, yKey }) => {
  const chartData = sanitizeChartData(data, xKey, yKey);
  return (
    <div className="w-full h-[350px] chart-container">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorY" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
              <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
          <XAxis dataKey={xKey} stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
          <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
          <Tooltip formatter={tooltipFormatter} contentStyle={{ backgroundColor: "#ffffff", borderRadius: "12px", border: "1px solid #e2e8f0", color: "#0f172a", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }} />
          <Legend wrapperStyle={{ fontSize: '10px', color: '#64748b', marginTop: '10px', maxHeight: '60px', overflowY: 'auto', paddingRight: '5px' }} formatter={(value) => value.replace(/_/g, ' ').toUpperCase()} />
          <Area type="monotone" dataKey={yKey} stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorY)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export const BubbleScatterChart = ({ data, xKey, yKey, zKey, nameKey }) => {
  const chartData = sanitizeScatterData(data, xKey, yKey, zKey, nameKey);
  const legendName = yKey ? yKey.replace(/_/g, ' ').toUpperCase() : "METRIC";
  return (
    <div className="w-full h-[350px] chart-container">
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis type="number" dataKey={xKey} name={xKey} stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
          <YAxis type="number" dataKey={yKey} name={yKey} stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
          <ZAxis type="number" dataKey={zKey} range={[60, 400]} name={nameKey} />
          <Tooltip cursor={{ strokeDasharray: '3 3' }} formatter={tooltipFormatter} contentStyle={{ backgroundColor: "#ffffff", borderRadius: "12px", border: "1px solid #e2e8f0", color: "#0f172a", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }} />
          <Legend wrapperStyle={{ fontSize: '10px', color: '#64748b', marginTop: '10px', maxHeight: '60px', overflowY: 'auto', paddingRight: '5px' }} />
          <Scatter name={legendName} data={chartData} fill="#f59e0b" fillOpacity={0.7}>
             {chartData?.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
};

export const KPICard = ({ title, value, unit = "", trend = 0 }) => (
  <div className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col justify-between shadow-sm">
    <span className="text-slate-500 text-sm font-medium uppercase tracking-wider">{title}</span>
    <div className="flex items-baseline gap-2 mt-2">
      <span className="text-3xl font-extrabold text-slate-900">{value}{unit}</span>
      {trend !== 0 && (
        <span className={`text-xs font-bold ${trend > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
          {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
        </span>
      )}
    </div>
  </div>
);

export const HorizontalStackedBarChart = ({ data, keys, yKey }) => {
  const chartData = sanitizeStackedData(data, yKey, keys);
  return (
    <div className="w-full h-[350px] chart-container">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart layout="vertical" data={chartData} margin={{ top: 10, right: 30, left: 40, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
          <XAxis type="number" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
          <YAxis dataKey={yKey} type="category" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} width={120} />
          <Tooltip contentStyle={{ backgroundColor: "#ffffff", borderRadius: "12px", border: "1px solid #e2e8f0", color: "#0f172a", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }} />
          <Legend wrapperStyle={{ fontSize: '12px', color: '#64748b' }} />
          {keys.map((k, i) => (
            <Bar key={k} dataKey={k} stackId="a" fill={COLORS[i % COLORS.length]} radius={i === keys.length - 1 ? [0, 4, 4, 0] : [0, 0, 0, 0]} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export const GaugeChart = ({ value, min = 0, max = 100, color = "#10b981", label }) => {
  const data = [
    { name: "Value", value: value },
    { name: "Remainder", value: max - value }
  ];
  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="relative w-48 h-24">
        <ResponsiveContainer width="100%" height="200%">
          <PieChart>
            <Pie data={data} cx="50%" cy="100%" startAngle={180} endAngle={0} innerRadius={70} outerRadius={90} dataKey="value" stroke="none">
              <Cell fill={color} />
              <Cell fill="#f1f5f9" />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute bottom-0 left-0 w-full text-center">
          <span className="text-3xl font-extrabold text-slate-900">{value}%</span>
        </div>
      </div>
      <span className="text-slate-500 font-bold text-xs uppercase tracking-widest mt-6">{label}</span>
    </div>
  );
};

const PlaceholderChart = ({ title, data }) => (
  <div className="w-full h-[350px] bg-slate-50 border border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center text-slate-400 font-bold uppercase tracking-widest text-xs">
    <span>{title}</span>
    <span className="text-[10px] mt-2 opacity-60">
      {data ? `Data Sync Active (${Array.isArray(data) ? data.length : 1} nodes)` : "Awaiting Data"}
    </span>
  </div>
);

export const ForecastLineChart = ({ data }) => data && Array.isArray(data) && data.length > 0 && data[0].hasOwnProperty('date') ? <CustomLineChart data={data} xKey="date" yKey="forecast" /> : <PlaceholderChart title="Forecast Line Chart" data={data} />;
export const CorrelationHeatmap = ({ data }) => <PlaceholderChart title="Correlation Heatmap" data={data} />;
export const SankeyRevenueFlow = ({ data }) => <PlaceholderChart title="Sankey Revenue Flow" data={data} />;
export const GeoPerformanceMap = ({ data }) => <PlaceholderChart title="Geo Performance Map" data={data} />;
export const RevenueTreemap = ({ data }) => <PlaceholderChart title="Revenue Treemap" data={data} />;
export const ProductQuadrantMatrix = ({ data }) => <BubbleScatterChart data={data} xKey="revGrowth" yKey="qtyGrowth" zKey="revenue" nameKey="name" />;
export const EfficientFrontierChart = ({ data }) => <BubbleScatterChart data={data} xKey="risk" yKey="return" zKey="volume" nameKey="strategy" />;
export const ButterflyComparisonChart = ({ data }) => <PlaceholderChart title="Butterfly Comparison" data={data} />;
export const InventoryRiskMatrix = ({ data }) => <PlaceholderChart title="Inventory Risk Matrix" data={data} />;
export const ElasticityScatter = ({ data }) => <BubbleScatterChart data={data} xKey="discount" yKey="salesGrowth" zKey="revenue" nameKey="name" />;
export const DecompositionTree = ({ data }) => <PlaceholderChart title="Decomposition Tree" data={data} />;
export const AIAnomalyTimeline = ({ data }) => data && Array.isArray(data) && data.length > 0 && data[0].hasOwnProperty('timestamp') ? <CustomLineChart data={data} xKey="timestamp" yKey="anomaly_score" /> : <PlaceholderChart title="AI Anomaly Timeline" data={data} />;
export const LollipopRankingChart = ({ data }) => <PlaceholderChart title="Lollipop Ranking Chart" data={data} />;
export const DonutDistributionChart = ({ data }) => <CustomPieChart data={data} nameKey="name" dataKey="value" />;

