import React, { useState } from 'react';
import { HelpCircle, CheckCircle2, XCircle, Zap, Sliders, Sparkles } from 'lucide-react';
import SectionCard from '../common/SectionCard';
import ScientificBadge from '../common/ScientificBadge';

const DEFAULT_COUNTERFACTUAL = {
  sensorId: "767620",
  decision: "QUERY",
  expectedBenefit: "45%",
  uncertaintyReduction: "-22%",
  reason: "High uncertainty reduction and state coverage gain justify communication cost.",
  withoutQuery: {
    estimatedUncertainty: "36%",
    blindSpotRisk: "Moderate",
    informationDebt: 0.40,
    coverageGap: "40%"
  },
  withQuery: {
    estimatedUncertainty: "14%",
    blindSpotRisk: "Low",
    informationDebt: 0.00,
    coverageGain: "+20%",
    expectedCost: "~4.2 KB (proxy)"
  }
};

export default function CounterfactualQueryCard({ data, sensorId: propSensorId, _onClose, onExecuteQuery }) {
  const activeData = data || DEFAULT_COUNTERFACTUAL;
  const {
    sensorId: dataSensorId = "773869",
    withoutQuery = {},
    withQuery = {},
    expectedBenefit = "45%",
    uncertaintyReduction = "-22%",
    decision = "QUERY",
    reason
  } = activeData;

  const sensorId = propSensorId || activeData.sensorId || dataSensorId || "773869";
  const isQuery = decision === "QUERY";
  const [simulatedBudget, setSimulatedBudget] = useState(1);

  return (
    <SectionCard
      title={`Query Impact Evaluation — Sensor ${sensorId}`}
      subtitle="Counterfactual comparison estimating state benefit against telemetry byte cost"
      icon={HelpCircle}
      action={<ScientificBadge type="COUNTERFACTUAL" label="ESTIMATED BENEFIT" size="xs" />}
      className="flex flex-col"
    >
      <div className="space-y-4">
        {/* Without Query vs With Query Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs tabular-nums">
          {/* Without Query (Current State) */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-2.5 transition-colors">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-semibold">
              <span className="text-[12px] font-bold">WITHOUT QUERY</span>
              <span className="text-[10px] text-slate-500 font-mono uppercase bg-slate-200/60 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                Current
              </span>
            </div>

            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-600 dark:text-slate-400">Uncertainty Proxy:</span>
              <span className="font-mono font-bold text-rose-600 dark:text-rose-400">
                {withoutQuery.estimatedUncertainty || "36%"}
              </span>
            </div>

            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-600 dark:text-slate-400">Information Debt:</span>
              <span className="font-mono font-bold text-slate-900 dark:text-slate-200">
                {withoutQuery.informationDebt !== undefined ? withoutQuery.informationDebt : 0.40}
              </span>
            </div>

            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-600 dark:text-slate-400">Blind Spot Risk:</span>
              <span className="font-mono font-semibold text-amber-600 dark:text-amber-400">
                {withoutQuery.blindSpotRisk || "Moderate"}
              </span>
            </div>
          </div>

          {/* With Query (Simulated / Projected State) */}
          <div className="p-3.5 rounded-xl bg-blue-50/70 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-500/30 space-y-2.5 transition-colors">
            <div className="flex items-center justify-between pb-2 border-b border-blue-200 dark:border-blue-500/20 text-cyan-800 dark:text-cyan-300 font-semibold">
              <span className="text-[12px] font-bold">WITH QUERY</span>
              <span className="text-[10px] text-cyan-700 dark:text-cyan-300 font-mono uppercase bg-blue-100/80 dark:bg-blue-900/40 px-1.5 py-0.5 rounded">
                Projected
              </span>
            </div>

            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-600 dark:text-slate-400">Uncertainty Proxy:</span>
              <div className="flex items-center gap-1.5">
                <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                  {withQuery.estimatedUncertainty || "14%"}
                </span>
                <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                  ({uncertaintyReduction})
                </span>
              </div>
            </div>

            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-600 dark:text-slate-400">Information Debt:</span>
              <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                {withQuery.informationDebt !== undefined ? withQuery.informationDebt : 0.00}
              </span>
            </div>

            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-600 dark:text-slate-400">Coverage Gain:</span>
              <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                {withQuery.coverageGain || "+20%"}
              </span>
            </div>
          </div>
        </div>

        {/* Interactive What-If Query Budget Simulator */}
        <div className="p-3.5 rounded-xl bg-gradient-to-r from-blue-500/5 via-cyan-500/5 to-purple-500/5 dark:from-[#0B2033] dark:to-[#071624] border border-cyan-500/30 dark:border-cyan-500/20 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
                <Sliders className="w-3.5 h-3.5" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-800 dark:text-cyan-300">
                  Interactive What-If: Multi-Node Query Budget
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block">
                  Simulate predictive uncertainty reduction vs telemetry payload trade-off
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 self-start sm:self-auto">
              {[1, 3, 5].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setSimulatedBudget(preset)}
                  className={`text-[10px] font-mono px-2 py-0.5 rounded-md border transition-all cursor-pointer ${
                    simulatedBudget === preset
                      ? 'bg-cyan-500 text-slate-950 font-bold border-cyan-400 shadow-xs'
                      : 'bg-white dark:bg-[#071727] text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-cyan-500/50'
                  }`}
                >
                  {preset === 1 ? '1 Node' : preset === 3 ? '3 Nodes' : '5 Nodes'}
                </button>
              ))}
            </div>
          </div>

          {/* Slider input */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-600 dark:text-slate-400 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-cyan-400" />
                Active Node Budget:
              </span>
              <span className="font-bold text-cyan-700 dark:text-cyan-300">
                {simulatedBudget} {simulatedBudget === 1 ? 'Sensor Node' : 'Sensor Nodes'}
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="5"
              step="1"
              value={simulatedBudget}
              onChange={(e) => setSimulatedBudget(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-400">
              <span>1 Node (Min Overhead)</span>
              <span>3 Nodes (Balanced)</span>
              <span>5 Nodes (High Precision)</span>
            </div>
          </div>

          {/* Dynamic Reactive Simulation Output Cards */}
          <div className="grid grid-cols-3 gap-2 pt-1 text-center font-mono">
            <div className="p-2 rounded-lg bg-white/80 dark:bg-[#04101A] border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] text-slate-500 block uppercase font-sans">Simulated Cost</span>
              <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                {simulatedBudget * 187} B
              </span>
              <span className="text-[9px] text-slate-400 block font-sans">
                ({(simulatedBudget * 4.2).toFixed(1)} KB proxy)
              </span>
            </div>
            <div className="p-2 rounded-lg bg-white/80 dark:bg-[#04101A] border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] text-slate-500 block uppercase font-sans">Uncertainty</span>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                -{(18 + (simulatedBudget - 1) * 7.5).toFixed(1)}%
              </span>
              <span className="text-[9px] text-slate-400 block font-sans">Variance drop</span>
            </div>
            <div className="p-2 rounded-lg bg-white/80 dark:bg-[#04101A] border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] text-slate-500 block uppercase font-sans">Accuracy Gain</span>
              <span className="text-xs font-bold text-purple-600 dark:text-purple-400">
                +{(18 + (simulatedBudget - 1) * 6.5).toFixed(1)}%
              </span>
              <span className="text-[9px] text-slate-400 block font-sans">Empirical gain</span>
            </div>
          </div>
        </div>

        {/* Rationale Quote */}
        {reason && (
          <p className="text-xs text-slate-600 dark:text-[#B8C7D8] italic bg-slate-50 dark:bg-[#071624] p-2.5 rounded-lg border border-slate-200 dark:border-[#17364E] leading-normal">
            &ldquo;{reason}&rdquo;
          </p>
        )}

        {/* State Benefit & Execution Strip */}
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#071624] border border-slate-200 dark:border-[#17364E] flex flex-col sm:flex-row items-center justify-between gap-3 transition-colors">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 dark:text-[#8295A8] font-medium">Estimated State Benefit:</span>
              <span className="text-xs font-mono font-semibold px-1.5 py-0.2 rounded bg-slate-200/60 dark:bg-slate-800 text-slate-600 dark:text-slate-400 uppercase text-[10px]">
                DERIVED
              </span>
            </div>
            <div className="text-[18px] font-mono font-extrabold text-emerald-600 dark:text-emerald-400 tabular-nums">
              {String(expectedBenefit).startsWith('+') ? expectedBenefit : `+${expectedBenefit}`} Forecast Benefit
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg border text-xs font-bold font-mono tracking-wider bg-white dark:bg-[#0B2033] border-slate-200 dark:border-[#17364E] whitespace-nowrap shrink-0">
              {isQuery ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 dark:text-emerald-400 shrink-0" />
                  <span className="text-emerald-700 dark:text-emerald-300">DECISION: QUERY</span>
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4 text-slate-400 shrink-0" />
                  <span className="text-slate-600 dark:text-[#B8C7D8]">DECISION: SKIP</span>
                </>
              )}
            </div>

            {isQuery && onExecuteQuery && (
              <button
                onClick={() => onExecuteQuery(sensorId)}
                className="inline-flex items-center justify-center gap-1.5 h-8 px-3.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Execute Query</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </SectionCard>
  );
}
