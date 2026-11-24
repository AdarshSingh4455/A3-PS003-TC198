# TrafficPulse-X — Frontend Architecture & Component Guide

> High-performance React 19 dashboard powered by Tailwind CSS, Leaflet GIS, Recharts, and GPU-optimized anti-blur typography.

---

## 1. System Architecture & Component Dataflow

The frontend is built as a single-page application (SPA) centered around a synchronized historical telemetry clock (`ReplayContext`), feeding 7 distinct operational views.

```mermaid
flowchart TD
    subgraph Core ["State & Gateway"]
        API["Centralized API Client<br/>(src/services/api.js)"]
        Clock["ReplayContext<br/>(34,272 Timesteps Replay Clock)"]
        Theme["ThemeContext<br/>(Dark / Light Mode)"]
    end

    subgraph Dashboards ["7 Competition Dashboards (src/pages/)"]
        P1["Overview<br/>(/)"]
        P2["Traffic Network<br/>(/network)"]
        P3["Predictions<br/>(/predictions)"]
        P4["Decision Intelligence<br/>(/intelligence)"]
        P5["Federated Learning<br/>(/federated-learning)"]
        P6["Communication<br/>(/communication)"]
        P7["Alerts & Analytics<br/>(/alerts)"]
    end

    subgraph Visualizations ["Interactive Visualizers (src/components/)"]
        Map["Leaflet GIS Map<br/>(207 Caltrans Sensors)"]
        ForecastChart["Multi-Horizon Recharts<br/>(15m / 30m / 60m)"]
        JuryTable["Need Score Radar<br/>& Dispatch Ledger"]
        FLCard["FedAvg Convergence<br/>& 4-Region Non-IID"]
        CommPie["Payload Accounting<br/>& 50% CCV Frontier"]
    end

    API --> Clock
    Clock --> Dashboards
    Theme --> Dashboards

    P2 --> Map
    P3 --> ForecastChart
    P4 --> JuryTable
    P5 --> FLCard
    P6 --> CommPie
```

---

## 2. Directory Structure

```text
src/
├── app/
│   └── App.jsx                           # Primary router, navigation layout & modals
├── pages/                                # 7 Core Application Dashboards
│   ├── Overview/Overview.jsx             # System KPI console & sector overview
│   ├── TrafficNetwork/TrafficNetwork.jsx # 207-sensor interactive GIS map
│   ├── Prediction/Prediction.jsx         # Multi-horizon forecast engine & benchmarks
│   ├── DecisionIntelligence/             # Need Score prioritization & action tiers
│   ├── FederatedLearning/                # 4-client FedAvg convergence & math proofs
│   ├── Communication/                    # 50% CCV savings & payload accounting
│   └── Alerts/Alerts.jsx                 # Anomaly thresholds & incident stream
├── components/                           # Modular Reusable Widgets
│   ├── common/                           # MetricCard, DataTable, ScientificBadge, Modals
│   ├── traffic/                          # RealTrafficMap, MapLegend, UnifiedMapControls
│   ├── prediction/                       # ForecastChartCard, ForecastHorizonCards
│   ├── decision/                         # CounterfactualQueryCard, EvidenceChain, NeedScore
│   ├── federated/                        # CentralizedVsFederated, PrivacyExperiment
│   ├── communication/                    # CommunicationBreakdownDonut, ParetoChart
│   └── alerts/                           # AlertStreamTable, SelectedAlertInspector
├── context/
│   ├── ReplayContext.jsx                 # Global time-tick & sensor telemetry state
│   └── ThemeContext.jsx                  # Dark/light theme persistence
├── data/
│   ├── sensor_location_names.json        # 207 authentic Caltrans freeway cross-points
│   └── replayAlertsData.js               # Synchronized offline incident stream
├── services/
│   └── api.js                            # Axios/Fetch client with dynamic VITE_API_URL
├── utils/
│   └── formatters.js                     # Formatting helpers for speed, bytes, and dates
├── index.css                             # Typography engine & anti-blur styling
└── main.jsx                              # React DOM mount point
```

---

## 3. Typography & Subpixel Anti-Blur Engine

To eliminate font blurriness on Windows and high-DPI displays:
- **DirectWrite ClearType Restoration**: Removed persistent `will-change: transform` and CSS 3D transforms on parent containers so Chromium preserves subpixel antialiasing.
- **Font Stack**: Dual modern font stack importing Google `Inter` for clean prose and `JetBrains Mono` for tabular numerals.
- **Stroke-Bleed Prevention**: Monospace numbers and IDs are capped at `font-weight: 600` (`font-bold`) to keep inner glyph counters sharp at small pixel sizes (10–12px).

---

## 4. Local Development Runbook

```bash
# 1. Install frontend dependencies
npm install

# 2. Start Vite local development server (Port 5173)
npm run dev

# 3. Compile optimized production build (Sub-2.5s)
npm run build

# 4. Preview compiled production bundle
npm run preview
```

---

## 5. Live Production Deployment
- **Live URL**: [https://trafficpulsex-frontend.onrender.com](https://trafficpulsex-frontend.onrender.com)
- **SPA Fallback**: Configured with `/* -> /index.html` rewrite rules to prevent 404s on browser refresh.
