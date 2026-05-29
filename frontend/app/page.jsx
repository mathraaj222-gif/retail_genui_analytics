"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Table, ArrowRight, Database, ChevronRight, Info } from "lucide-react";

export default function HomePortal() {
  const [activeDataset, setActiveDataset] = useState("events");

  const datasets = {
    campaigns: {
      name: "dim_campaigns.csv",
      description: "timelines mapping critical campaign identifiers to holiday sales cycles.",
      rows: "2 Campaigns",
      columns: [
        { name: "campaign_id", type: "VARCHAR", desc: "Unique identifier (e.g., CAMP_DIW_01)" },
        { name: "campaign_name", type: "VARCHAR", desc: "Name of the marketing campaign (Diwali 2023, Sankranti 2024)" },
        { name: "start_date", type: "DATE", desc: "Campaign launch date" },
        { name: "end_date", type: "DATE", desc: "Campaign termination date" }
      ]
    },
    products: {
      name: "dim_products.csv",
      description: "Product master database cataloging items across multiple categories.",
      rows: "15 Unique Items",
      columns: [
        { name: "product_code", type: "VARCHAR", desc: "Unique product barcode identifier" },
        { name: "product_name", type: "VARCHAR", desc: "Full item description (e.g., AtliQ Double Filtered Peanut Oil)" },
        { name: "category", type: "VARCHAR", desc: "Product group classification (Grocery, Home Care, Personal Care)" }
      ]
    },
    stores: {
      name: "dim_stores.csv",
      description: "Geographic and operational master database representing store locations.",
      rows: "50 Active Supermarkets",
      columns: [
        { name: "store_id", type: "VARCHAR", desc: "Unique retail outlet identifier" },
        { name: "city", type: "VARCHAR", desc: "Southern Indian operational hub (Bengaluru, Chennai, Hyderabad, etc.)" },
        { name: "store_code", type: "VARCHAR", desc: "Internal store identifier tag" }
      ]
    },
    events: {
      name: "fact_events.csv",
      description: "Transaction event logs containing promotion application details, pricing, and volume sold.",
      rows: "76,000+ Records",
      columns: [
        { name: "event_id", type: "VARCHAR", desc: "Unique transaction record identifier" },
        { name: "store_id", type: "VARCHAR", desc: "Branch where transaction occurred (FK)" },
        { name: "campaign_id", type: "VARCHAR", desc: "Associated marketing campaign (FK)" },
        { name: "product_code", type: "VARCHAR", desc: "Item purchased (FK)" },
        { name: "base_price", type: "INTEGER", desc: "Regular price of the product without promotion" },
        { name: "promo_type", type: "VARCHAR", desc: "Promotion applied (BOGOF, 500-Refund, 50% OFF, 33% OFF, 25% OFF)" },
        { name: "quantity_sold_before_promo", type: "INTEGER", desc: "Average weekly volume sold before promo launched" },
        { name: "quantity_sold_after_promo", type: "INTEGER", desc: "Weekly volume sold during the promo period" }
      ]
    }
  };

  return (
    <div className="flex flex-col gap-10 py-4 max-w-5xl mx-auto">
      {/* HERO SECTION */}
      <div className="space-y-6">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-[#1d1d1f] font-serif leading-tight">
          Promotion Analytics Platform
        </h1>

        <p className="text-[#515154] text-base leading-relaxed max-w-3xl">
          An analytics system designed to evaluate the performance of promotions run by AtliQ Mart during the Diwali 2023 and Sankranti 2024 festive seasons. Explore descriptive metrics, incremental revenue projections, and autonomous insights generated directly from transactional databases.
        </p>

        <div className="flex items-center gap-4">
          <Link 
            href="/analytics" 
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-xl flex items-center gap-2 shadow-sm transition-colors text-sm font-lato"
          >
            <span>Launch Analytics</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link 
            href="/about" 
            className="bg-white hover:bg-slate-100 border border-[#e5e5e7] text-[#1d1d1f] font-medium px-6 py-3 rounded-xl flex items-center gap-2 transition-colors text-sm font-lato"
          >
            <span>About Architect</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      <div className="border-t border-[#e5e5e7] my-2" />

      {/* DATASETS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Side: Buttons */}
        <div className="flex flex-col gap-3">
          <div>
            <h2 className="text-xl font-bold text-[#1d1d1f] font-serif mb-1">Source Datasets</h2>
            <p className="text-[#86868b] text-xs">Select a table to review its attributes and metadata.</p>
          </div>

          <div className="flex flex-col gap-2.5 mt-2">
            {Object.keys(datasets).map((key) => {
              const isActive = activeDataset === key;
              return (
                <button
                  key={key}
                  onClick={() => setActiveDataset(key)}
                  className={`text-left px-5 py-4 rounded-xl border transition-colors flex items-center justify-between group ${
                    isActive 
                      ? "bg-white border-blue-600 text-blue-600 shadow-sm" 
                      : "bg-white border-[#e5e5e7] hover:border-blue-400 text-[#1d1d1f]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Table className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-[#86868b]'}`} />
                    <span className="text-sm font-semibold font-lato">{datasets[key].name}</span>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    isActive ? 'bg-blue-50 text-blue-600' : 'bg-slate-100 text-[#515154]'
                  }`}>
                    {datasets[key].rows}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Side: Schema viewer */}
        <div className="lg:col-span-2 bg-white border border-[#e5e5e7] rounded-2xl p-6 shadow-sm flex flex-col justify-between min-h-[350px]">
          <div className="space-y-4">
            <div>
              <span className="text-[10px] bg-slate-100 text-[#515154] font-bold uppercase px-2 py-0.5 rounded">
                Database Schema
              </span>
              <h3 className="text-[#1d1d1f] text-lg font-bold font-serif mt-2">{datasets[activeDataset].name}</h3>
              <p className="text-[#86868b] text-xs mt-1 leading-relaxed">{datasets[activeDataset].description}</p>
            </div>

            <div className="border border-[#e5e5e7] rounded-xl overflow-hidden bg-slate-50">
              <table className="w-full text-left border-collapse text-xs font-lato">
                <thead>
                  <tr className="bg-slate-100 text-[#515154] border-b border-[#e5e5e7] font-semibold">
                    <th className="px-4 py-2">Column</th>
                    <th className="px-4 py-2">Type</th>
                    <th className="px-4 py-2">Definition</th>
                  </tr>
                </thead>
                <tbody>
                  {datasets[activeDataset].columns.map((col, idx) => (
                    <tr key={idx} className="border-b border-[#e5e5e7] hover:bg-white text-[#1d1d1f] transition-colors">
                      <td className="px-4 py-2.5 font-mono text-[11px] text-blue-600 font-bold">{col.name}</td>
                      <td className="px-4 py-2.5 text-[10px] text-[#86868b] font-bold uppercase">{col.type}</td>
                      <td className="px-4 py-2.5 text-[#515154]">{col.desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex items-center gap-1.5 mt-6 pt-4 border-t border-[#e5e5e7] text-[10px] text-[#86868b]">
            <Info className="w-4 h-4 text-blue-500 flex-shrink-0" />
            <span>This structured dataset serves as the base for real-time promotion analytics queries.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
