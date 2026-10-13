import React, { useState, useEffect, useMemo } from 'react';
import { 
  Radio, 
  AlertTriangle
} from 'lucide-react';
import { 
  fetchFederatedCommunication,
  fetchPhase9Selection,
  fetchPhase9ClientValues,
  fetchPhase9Experiments,
  fetchPhase9Tradeoff,
  fetchPhase9Rounds
} from '../../services/api';
import CommunicationHeroFlow from '../../components/communication/CommunicationHeroFlow';
import CommunicationSummaryKPIs from '../../components/communication/CommunicationSummaryKPIs';
import CommunicationBreakdownDonut from '../../components/communication/CommunicationBreakdownDonut';
import SavingsVsPredictionQualityChart from '../../components/communication/SavingsVsPredictionQualityChart';
import ParticipationStrategyComparison from '../../components/communication/ParticipationStrategyComparison';
import PerRegionCommunicationTable from '../../components/communication/PerRegionCommunicationTable';
import RecentCommunicationEvents from '../../components/communication/RecentCommunicationEvents';
import CommunicationTechnicalDetails from '../../components/communication/CommunicationTechnicalDetails';

const STRATEGIES_MAP = {
  FULL: {
    id: 'FULL',
    policyKey: 'POLICY_CONTROLLED_4_OF_4',
    budgetKey: '4/4',
    name: 'Full Participation',
    shortName: 'Full (4/4)',
    clientsPerRound: 4,
    totalBytes: 11468184,
    reductionPercent: 0.0,
    testMAE: 3.6473,
    isBestTradeoff: false
  },
  SEVENTY_FIVE: {
    id: 'SEVENTY_FIVE',
    policyKey: 'POLICY_CCV_3_OF_4',
    budgetKey: '3/4',
    name: '75% Participation',
    shortName: '75% (3/4)',
    clientsPerRound: 3,
    totalBytes: 8601138,
    reductionPercent: 25.0,
    testMAE: 3.6530,
    isBestTradeoff: false
  },
  FIFTY: {
    id: 'FIFTY',
    policyKey: 'POLICY_CCV_2_OF_4',
    budgetKey: '2/4',
    name: '50% Participation',
    shortName: '50% (2/4)',
    clientsPerRound: 2,
    totalBytes: 5734092,
    reductionPercent: 50.0,
    testMAE: 3.6448,
    isBestTradeoff: true
  },
  TWENTY_FIVE: {
    id: 'TWENTY_FIVE',
    policyKey: 'POLICY_CCV_1_OF_4',
    budgetKey: '1/4',
    name: '25% Participation',
    shortName: '25% (1/4)',
    clientsPerRound: 1,
    totalBytes: 2867046,
    reductionPercent: 75.0,
    testMAE: 3.6699,
    isBestTradeoff: false
  }
};

export default function Communication() {
  const [commData, setCommData] = useState(null);
  const [error, setError] = useState(null);
  
  // Interactive Active Strategy (Defaults to 50% Participation - Best Observed Balanced Trade-off)
  const [activeStrategy, setActiveStrategy] = useState('FIFTY');

  const [phase9Selection, setPhase9Selection] = useState(null);
  const [clientValues, setClientValues] = useState([]);
  const [phase9Experiments, setPhase9Experiments] = useState(null);
  const [_phase9Tradeoff, setPhase9Tradeoff] = useState(null);
  const [activeHistoryPolicy, setActiveHistoryPolicy] = useState('POLICY_CCV_2_OF_4');
  const [roundsHistory, setRoundsHistory] = useState([]);

  const activeStrategyObj = useMemo(() => {
    return STRATEGIES_MAP[activeStrategy] || STRATEGIES_MAP.FIFTY;
  }, [activeStrategy]);

  // Load baseline communication stats
  const loadData = async () => {
    setError(null);
    try {
      const res = await fetchFederatedCommunication();
      setCommData(res);
    } catch (err) {
      setError(err.message || 'Failed to connect to backend communication service.');
    }
  };

  useEffect(() => {
    loadData();
    fetchPhase9Experiments()
      .then(setPhase9Experiments)
      .catch(() => {});
    fetchPhase9Tradeoff()
      .then(setPhase9Tradeoff)
      .catch(() => {});
    fetchPhase9ClientValues()
      .then(setClientValues)
      .catch(() => {});
  }, []);

  // Update selection budget when active strategy changes
  useEffect(() => {
    fetchPhase9Selection(activeStrategyObj.budgetKey)
      .then(setPhase9Selection)
      .catch(() => {});
  }, [activeStrategyObj.budgetKey]);

  // Load rounds history for selected technical policy
  useEffect(() => {
    if (activeHistoryPolicy) {
      fetchPhase9Rounds(activeHistoryPolicy)
        .then(setRoundsHistory)
        .catch(() => {});
    }
  }, [activeHistoryPolicy]);

  return (
    <div className="space-y-6 pb-12">
      
      {/* ==================================================================== */}
      {/* 1. CINEMATIC HEADER STRIP                                            */}
      {/* ==================================================================== */}
      <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-[#071727] border border-slate-200 dark:border-[#17364E] p-5 lg:p-6 shadow-xs dark:shadow-md transition-colors">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
                <Radio className="w-5 h-5" />
              </div>
              <h1 className="text-xl lg:text-2xl font-black text-slate-900 dark:text-[#F5F8FC] tracking-tight">
                Communication Intelligence
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-[#B8C7D8] font-medium max-w-2xl">
              Adaptive sensor querying and selective federated weight synchronization.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Selective Optimization Active
            </span>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 flex items-center gap-3 text-xs">
          <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
          <div>
            <span className="font-bold">Communication Service Notice:</span> {error}
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* A. Baseline Communication Accounting & Architecture Hero Flow        */}
      {/* ==================================================================== */}
      <CommunicationHeroFlow
        activeStrategy={activeStrategy}
        onSelectStrategy={setActiveStrategy}
        baselineTotalBytes={11468184}
        selectedTotalBytes={activeStrategyObj.totalBytes}
        reductionPercent={activeStrategyObj.reductionPercent}
        selectedStrategyName={activeStrategyObj.name}
        isBestTradeoff={activeStrategyObj.isBestTradeoff}
      />

      {/* ==================================================================== */}
      {/* B. COMPACT PAYLOAD KPI ROW (EXACTLY 4 COMPACT CARDS)                 */}
      {/* ==================================================================== */}
      <CommunicationSummaryKPIs />

      {/* ==================================================================== */}
      {/* C. CORE ANALYTICS ROW (BREAKDOWN DONUT + ACCURACY TRADE-OFF)          */}
      {/* ==================================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-stretch">
        <CommunicationBreakdownDonut
          totalBytes={activeStrategyObj.totalBytes}
          strategyName={activeStrategyObj.name}
        />
        <SavingsVsPredictionQualityChart
          activeStrategy={activeStrategy}
          onSelectStrategy={setActiveStrategy}
        />
      </div>

      {/* ==================================================================== */}
      {/* D. PARTICIPATION STRATEGY COMPARISON                                 */}
      {/* ==================================================================== */}
      <ParticipationStrategyComparison
        activeStrategy={activeStrategy}
        onSelectStrategy={setActiveStrategy}
      />

      {/* ==================================================================== */}
      {/* E. REGIONAL COMMUNICATION + RECENT EVENTS                            */}
      {/* ==================================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        <div className="lg:col-span-7 flex flex-col min-h-[350px]">
          <PerRegionCommunicationTable
            activeStrategy={activeStrategy}
          />
        </div>
        <div className="lg:col-span-5 flex flex-col min-h-[350px]">
          <RecentCommunicationEvents />
        </div>
      </div>

      {/* ==================================================================== */}
      {/* F. COLLAPSIBLE TECHNICAL DETAILS & RESEARCH AUDITS                   */}
      {/* ==================================================================== */}
      <CommunicationTechnicalDetails
        clientValues={clientValues}
        phase9Selection={phase9Selection}
        roundsHistory={roundsHistory}
        activeHistoryPolicy={activeHistoryPolicy}
        onSelectHistoryPolicy={setActiveHistoryPolicy}
        commData={commData}
        phase9Experiments={phase9Experiments}
      />

    </div>
  );
}
