import React from 'react';
import { Wifi, Leaf, Zap, Activity } from 'lucide-react';

export default function LiveBandwidthSavingsBar({
  activeStrategy = 'FIFTY',
  onSelectStrategy,
  baselineTotalBytes = 11468184,
  selectedTotalBytes = 5734092,
  reductionPercent = '50.0',
  selectedStrategyName = '50% Participation',
  isBestTradeoff = true
}) {
  const baselineMB = (baselineTotalBytes / 1000000).toFixed(2);
  const selectedMB = (selectedTotalBytes / 1000000).toFixed(2);
  const savedBytes = Math.max(0, baselineTotalBytes - selectedTotalBytes);
  const savedMB = (savedBytes / 1000000).toFixed(2);
  const savingsPctNum = parseFloat(reductionPercent) || 0;

  // Preset strategies matching STRATEGIES_MAP in Communication.jsx
  const quickPresets = [
    { key: 'TWENTY_FIVE', label: '25% Selection', reduction: '75%' },
    { key: 'FIFTY', label: '50% Selection (Optimal)', reduction: '50%' },
    { key: 'SEVENTY_FIVE', label: '75% Selection', reduction: '25%' },
    { key: 'FULL', label: 'Full Sync (100%)', reduction: '0%' }
  ];

  return (
    <div className="rounded-2xl bg-white dark:bg-[#071727] border border-slate-200 dark:border-[#17364E] p-5 shadow-xs dark:shadow-md transition-all space-y-4">
      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <Wifi className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900 dark:text-[#F5F8FC]">
                Live Bandwidth Savings & Eco Optimization Bar
              </h2>
              {isBestTradeoff && (
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 uppercase">
                  Optimal Tradeoff
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 dark:text-[#B8C7D8] font-normal mt-0.5">
              Live edge transmission comparison: Full synchronization baseline vs active selective policy
            </p>
          </div>
        </div>

        {/* Quick Strategy Selector Pills */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-[#0E2438] border border-slate-200 dark:border-[#17364E] text-xs self-start sm:self-auto">
          <span className="text-[10px] font-bold text-slate-500 dark:text-[#8295A8] uppercase tracking-wider px-2">
            Preset:
          </span>
          {quickPresets.map((preset) => (
            <button
              key={preset.key}
              type="button"
              onClick={() => onSelectStrategy?.(preset.key)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold font-mono transition-all cursor-pointer ${
                activeStrategy === preset.key
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-xs border border-emerald-400'
                  : 'text-slate-600 dark:text-[#BACCDA] hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Dual Comparative Bandwidth Progress Bar */}
      <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#04101A] border border-slate-200 dark:border-[#17364E]/70 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-2">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              Active Transmission Footprint:
            </span>
            <span className="font-mono font-extrabold text-cyan-600 dark:text-cyan-300 text-sm">
              {selectedMB} MB
            </span>
            <span className="text-slate-400 font-mono">/ {baselineMB} MB baseline</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-500 dark:text-slate-400 text-xs">Bandwidth Reduction:</span>
            <span className="font-mono font-extrabold text-emerald-600 dark:text-emerald-400 text-sm px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
              -{reductionPercent}% ({savedMB} MB Saved)
            </span>
          </div>
        </div>

        {/* Visual Stacked Progress Bar */}
        <div className="relative w-full h-4 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden flex shadow-inner">
          {/* Active payload segment */}
          <div
            style={{ width: `${Math.max(5, 100 - savingsPctNum)}%` }}
            className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-500 relative flex items-center justify-end pr-2"
          >
            <span className="text-[9px] font-mono font-bold text-white drop-shadow-xs hidden sm:inline">
              Active: {selectedMB} MB
            </span>
          </div>
          {/* Saved bandwidth segment (glowing emerald) */}
          <div
            style={{ width: `${Math.min(95, savingsPctNum)}%` }}
            className="h-full bg-gradient-to-r from-emerald-500/80 to-emerald-400 transition-all duration-500 relative flex items-center justify-center"
          >
            <span className="text-[9px] font-mono font-black text-emerald-950 uppercase drop-shadow-xs hidden sm:inline">
              ★ {savedMB} MB Saved (-{reductionPercent}%)
            </span>
          </div>
        </div>

        <div className="flex justify-between text-[11px] font-mono text-slate-500 dark:text-slate-400 pt-0.5">
          <span>0 MB</span>
          <span className="text-cyan-600 dark:text-cyan-400 font-bold">
            Selected: {selectedStrategyName}
          </span>
          <span>Baseline: {baselineMB} MB</span>
        </div>
      </div>

      {/* Eco & Wireless Operational Impact Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#071624] border border-slate-200 dark:border-[#17364E] flex items-center gap-3">
          <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shrink-0">
            <Leaf className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-[#8295A8] block">
              Energy & Carbon Impact
            </span>
            <span className="font-mono font-bold text-slate-900 dark:text-[#F5F8FC]">
              ~{(savingsPctNum * 0.082).toFixed(1)} Wh saved / epoch
            </span>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#071624] border border-slate-200 dark:border-[#17364E] flex items-center gap-3">
          <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 shrink-0">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-[#8295A8] block">
              Radio Airtime Saved
            </span>
            <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
              -{reductionPercent}% TX Airtime
            </span>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#071624] border border-slate-200 dark:border-[#17364E] flex items-center gap-3">
          <div className="p-2 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 shrink-0">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-[#8295A8] block">
              Network Channel Contention
            </span>
            <span className="font-mono font-bold text-slate-900 dark:text-[#F5F8FC]">
              {savingsPctNum >= 50 ? 'Low Contention (Optimal)' : 'Moderate Overhead'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
