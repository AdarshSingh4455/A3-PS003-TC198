import React, { useState } from 'react';
import { TrendingUp } from 'lucide-react';

export default function CommunicationTimeChart() {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  // Time steps data points
  const timePoints = [
    { time: '16:00', baseline: 38, selective: 16 },
    { time: '16:30', baseline: 42, selective: 17 },
    { time: '17:00', baseline: 60, selective: 24 },
    { time: '17:30', baseline: 82, selective: 38 },
    { time: '18:00', baseline: 91, selective: 44 },
    { time: '18:30', baseline: 100, selective: 48.8 },
  ];

  // SVG dimensions
  const width = 500;
  const height = 180;
  const padLeft = 45;
  const padRight = 25;
  const padTop = 25;
  const padBottom = 30;

  const chartW = width - padLeft - padRight;
  const chartH = height - padTop - padBottom;

  const maxMB = 100;

  // Convert (index, value) to (x, y)
  const getX = (i) => padLeft + (i / (timePoints.length - 1)) * chartW;
  const getY = (val) => padTop + chartH - (val / maxMB) * chartH;

  // Generate SVG path strings
  const baselinePath = timePoints.reduce((acc, pt, i) => {
    const x = getX(i);
    const y = getY(pt.baseline);
    return i === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
  }, '');

  const selectivePath = timePoints.reduce((acc, pt, i) => {
    const x = getX(i);
    const y = getY(pt.selective);
    return i === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
  }, '');

  // Fill area under selective line
  const selectiveArea = `${selectivePath} L ${getX(timePoints.length - 1)} ${padTop + chartH} L ${getX(0)} ${padTop + chartH} Z`;

  // "Now" marker position between 17:30 and 18:00
  const nowX = getX(3.5);

  return (
    <div className="flex flex-col h-full rounded-2xl bg-white dark:bg-[#071727] border border-slate-200 dark:border-[#17364E] shadow-xl p-5 transition-colors">
      
      {/* Header: Title + Icon */}
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-[#F5F8FC] leading-none">
              Communication Over Time
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-[#8295A8] mt-1 font-medium">
              Payload accumulation across operational replay window
            </p>
          </div>
        </div>

        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
          -44% SAVINGS
        </span>
      </div>

      {/* Interactive SVG Chart Container */}
      <div className="flex-1 flex flex-col justify-center relative min-h-[190px]">
        <svg 
          viewBox={`0 0 ${width} ${height}`} 
          className="w-full h-full overflow-visible"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="selectiveAreaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Horizontal Grid Lines & Y-Axis Labels */}
          {[0, 20, 40, 60, 80, 100].map((tick) => {
            const y = getY(tick);
            return (
              <g key={tick}>
                <line
                  x1={padLeft}
                  y1={y}
                  x2={width - padRight}
                  y2={y}
                  stroke="currentColor"
                  className="text-slate-200 dark:text-[#132A40]"
                  strokeWidth="1"
                  strokeDasharray={tick === 0 ? "none" : "2 2"}
                />
                <text
                  x={padLeft - 8}
                  y={y + 3.5}
                  textAnchor="end"
                  className="text-[10px] fill-slate-400 dark:fill-[#647C92] font-mono"
                >
                  {tick}
                </text>
              </g>
            );
          })}

          {/* Area Fill for TrafficPulse-X */}
          <path d={selectiveArea} fill="url(#selectiveAreaGrad)" />

          {/* Baseline Curve (Dashed White/Slate) */}
          <path
            d={baselinePath}
            fill="none"
            stroke="#94a3b8"
            strokeWidth="2.5"
            strokeDasharray="5 4"
            className="opacity-80"
          />

          {/* TrafficPulse-X Curve (Solid Emerald Glowing) */}
          <path
            d={selectivePath}
            fill="none"
            stroke="#10b981"
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* Vertical "Now" Marker Line */}
          <line
            x1={nowX}
            y1={padTop}
            x2={nowX}
            y2={padTop + chartH}
            stroke="#38bdf8"
            strokeWidth="1.5"
            strokeDasharray="3 3"
          />
          {/* "Now" Badge */}
          <g transform={`translate(${nowX - 18}, ${padTop - 18})`}>
            <rect width="36" height="15" rx="4" fill="#0284c7" />
            <text x="18" y="11" textAnchor="middle" className="text-[9px] font-bold fill-white">
              Now
            </text>
          </g>

          {/* Interactive Data Point Dots */}
          {timePoints.map((pt, i) => {
            const x = getX(i);
            const ySel = getY(pt.selective);
            const yBase = getY(pt.baseline);
            const isHovered = hoveredIndex === i;

            return (
              <g key={pt.time} onMouseEnter={() => setHoveredIndex(i)} onMouseLeave={() => setHoveredIndex(null)}>
                {/* Baseline Dot */}
                <circle cx={x} cy={yBase} r={isHovered ? 4.5 : 3} fill="#94a3b8" />
                {/* Selective Dot */}
                <circle cx={x} cy={ySel} r={isHovered ? 6 : 4} fill="#10b981" stroke="#042f2e" strokeWidth="2" />
                
                {/* X-Axis Label */}
                <text
                  x={x}
                  y={height - 8}
                  textAnchor="middle"
                  className="text-[10px] fill-slate-400 dark:fill-[#8295A8] font-mono"
                >
                  {pt.time}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Hover Tooltip Overlay */}
        {hoveredIndex !== null && (
          <div className="absolute top-2 right-2 p-2 rounded-lg bg-slate-900/90 border border-slate-700 text-white text-[11px] shadow-xl backdrop-blur-xs font-mono">
            <div className="font-bold text-cyan-400">{timePoints[hoveredIndex].time}</div>
            <div className="text-slate-300">Baseline: {timePoints[hoveredIndex].baseline} MB</div>
            <div className="text-emerald-400 font-bold">Selective: {timePoints[hoveredIndex].selective} MB</div>
          </div>
        )}
      </div>

      {/* Legend Row */}
      <div className="mt-2 pt-2 border-t border-slate-100 dark:border-[#17364E]/60 flex items-center justify-center gap-6 text-xs">
        <div className="flex items-center gap-2">
          <span className="w-4 h-0.5 border-t-2 border-dashed border-slate-400" />
          <span className="text-slate-500 dark:text-[#8295A8] font-medium">Baseline (All Sensors)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-1 rounded-full bg-emerald-500" />
          <span className="text-emerald-700 dark:text-emerald-400 font-bold">TrafficPulse-X (Selective)</span>
        </div>
      </div>

    </div>
  );
}
