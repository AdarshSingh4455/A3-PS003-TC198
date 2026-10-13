# TrafficPulse-X

> **Evidence-on-Demand Federated Traffic Intelligence & Spatio-Temporal Forecasting**

[![Python 3.10+](https://img.shields.io/badge/python-3.10+-blue.svg)](https://www.python.org/downloads/)
[![React 19](https://img.shields.io/badge/react-19-61dafb.svg)](https://react.dev/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110+-009688.svg)](https://fastapi.tiangolo.com/)
[![PyTorch](https://img.shields.io/badge/PyTorch-2.0+-ee4c2c.svg)](https://pytorch.org/)
[![Vite](https://img.shields.io/badge/Vite-8.3+-646cff.svg)](https://vitejs.dev/)
[![License: Missing](https://img.shields.io/badge/License-Missing-lightgrey.svg)](#license)

**Team ID**: `A3-PS003-TC198`
**Benchmark Dataset**: METR-LA (Los Angeles County Highway Network, 207 Sensors)
**Execution Paradigm**: Historical Replay Analysis (March 1, 2012 – June 27, 2012)

---

## 1. Project Overview

**TrafficPulse-X** is an intelligent spatio-temporal traffic speed forecasting platform designed around the principle:
*“Sense only what matters. Ask the next best question. Share only what helps.”*

Modern intelligent transportation systems (ITS) typically rely on centralized architectures that continuously stream raw, uncompressed telemetry from hundreds of edge sensors across municipal networks. This model introduces severe communication bottlenecks, WAN transmission expenses, and privacy risks. TrafficPulse-X solves these challenges through a unified three-tier architecture:

1. **High-Precision Spatio-Temporal Modeling**: A hybrid **Graph+LSTM** network leveraging Chebyshev spectral graph convolutions and recurrent memory cells to forecast traffic speeds at +5, +15, +30, and +60-minute horizons across 207 inductive loop sensors.
2. **Active Decision Intelligence**: An uncertainty-calibrated **Need-Score** engine that schedules telemetry acquisitions dynamically, prioritizing high-entropy bottleneck sensors while maintaining verified network coverage.
3. **Privacy-Preserving Federated Learning with Selective Communication**: A decentralized **FedAvg** training framework across 4 regional client clusters with **Client Contribution Value (CCV)** optimization that achieves a **50.0% application-payload reduction** with equivalent forecast accuracy.

---

## 2. Problem Statement

Centralized intelligent transportation infrastructures encounter three fundamental limitations:

- **Spatio-Temporal Nonlinearity**: Freeway speeds fluctuate nonlinearly due to localized bottlenecks, propagating shockwaves across interconnected highway segments that standard linear and purely temporal models fail to capture.
- **Communication Inefficiency**: Continuously pulling full-fidelity telemetry across wide sensor arrays generates redundant transmissions during stable flow regimes, congesting backhaul bandwidth.
- **Data Sovereignty & Privacy**: Centralizing raw sensory data across distinct municipal districts or administrative jurisdictions violates institutional boundaries and increases centralized point-of-failure vulnerabilities.

TrafficPulse-X treats traffic forecasting as an **evidence-on-demand sensing and federated model aggregation problem**, reducing application-layer data exchange while maintaining state-of-the-art predictive performance.

---

## 3. Key Features

- **7-Model Benchmarking Suite**: Complete empirical evaluation comparing Last Value, Historical Average, Linear Regression, Temporal GRU, Temporal LSTM, Spatial GCN, and the primary Spatial Graph+LSTM model.
- **Calibrated Multi-Horizon Uncertainty**: Empirical residual distributions provide calibrated error boundaries ($\pm \text{mph}$) across all forecasting windows.
- **Dynamic Need-Score Engine**: 9-factor evaluation quantifying information entropy, spatial divergence, temporal drift, and network redundancy to prioritize active telemetry queries.
- **Decentralized Regional Partitions**: 207 highway sensors partitioned into 4 geographic clusters (North-East, South-East, Central-West, North-West) via K-Means graph clustering.
- **Selective Federated Communication**: CCV-directed client scheduling evaluating 4 matched communication policies (4/4 Full, 75%, 50%, and 25% participation).
- **Interactive Multi-View Console**: 7-route React 19 web application featuring Leaflet map-integrated controls, Recharts analytics, dual light/dark command-center themes, and responsive layout across desktop and mobile screens.
- **Server-Side AI Assistant**: Integrated assistant engine capable of answering domain technical queries locally via built-in knowledge retrieval or via server-side Google Gemini REST API.

---

## 4. System Architecture

```
+---------------------------------------------------------------------------------------+
|                             METR-LA BENCHMARK DATASET                                 |
|         207 Inductive Loop Sensors | 34,272 Timestamps (5-Min Cadence)                |
|                    data/raw/metr-la/ | data/processed/metr-la/                         |
+---------------------------------------------------------------------------------------+
                                           |
                                           v
+---------------------------------------------------------------------------------------+
|                            BACKEND FASTAPI SERVICES                                   |
|   +-----------------------+   +-----------------------+   +-----------------------+   |
|   |  Prediction Service   |   | Decision Intelligence |   |   Federated Service   |   |
|   |  (Spatial Graph+LSTM) |   |  (Need Score & Jury)  |   |    (FedAvg & CCV)     |   |
|   +-----------------------+   +-----------------------+   +-----------------------+   |
+---------------------------------------------------------------------------------------+
                                           |
                                           v
+---------------------------------------------------------------------------------------+
|                               REACT 19 CLIENT CONSOLE                                 |
|  /overview   /network   /predictions   /decision   /federated   /communication   /alerts |
+---------------------------------------------------------------------------------------+
```

---

## 5. Dataset

TrafficPulse-X is evaluated on the standard **METR-LA** highway traffic benchmark:

| Attribute | Specification |
| :--- | :--- |
| **Location** | Los Angeles County Freeway Network (Caltrans Performance Measurement System) |
| **Sensors** | 207 Inductive Loop Detectors |
| **Telemetry Metric** | Historical Vehicle Speed (mph) |
| **Temporal Range** | March 1, 2012 00:00:00 – June 27, 2012 23:55:00 |
| **Sampling Interval** | 5 minutes (288 observations per day per detector) |
| **Total Timesteps** | 34,272 chronological observations |
| **Data Splits** | Train: 70% (23,990 steps) \| Val: 10% (3,427 steps) \| Test: 20% (6,855 steps) |
| **Execution Mode** | Historical Replay (deterministic simulation, not live traffic) |
| **Data Availability** | Speed is available. Vehicle count (flow), occupancy, and incident ground truth are not present. |

---

## 6. Prediction Model

### Spatial Graph+LSTM Architecture
The primary forecasting architecture combines **Spatial Graph Convolutions** with **Long Short-Term Memory (LSTM)** units:

1. **Input Representation**: A 12-timestep lookback tensor $\mathbf{X} \in \mathbb{R}^{B \times 12 \times N \times 1}$ (past 60 minutes) normalized by train-only statistics ($\mu = 53.72\text{ mph}, \sigma = 20.30\text{ mph}$).
2. **Chebyshev Graph Convolution**: Spatial feature extraction across the weighted, distance-thresholded highway graph adjacency matrix $\mathbf{A} \in \mathbb{R}^{207 \times 207}$:
   $$\mathbf{Z}^{(t)} = \sigma\left(\tilde{\mathbf{D}}^{-1/2} \tilde{\mathbf{A}} \tilde{\mathbf{D}}^{-1/2} \mathbf{X}^{(t)} \mathbf{W}\right)$$
3. **Temporal Recurrent Modeling**: A 2-layer LSTM processing spatial graph embeddings across chronological steps to preserve dynamic momentum.
4. **Multi-Horizon Linear Projection**: Direct output head mapping hidden states to 12 future timesteps (yielding evaluated benchmarks at +5 min, +15 min, +30 min, and +60 min).

---

## 7. Decision Intelligence

The Decision Intelligence layer enables active sensing by answering: *Which detector requires telemetry right now?*

- **authoritative Need Score**: Evaluates 9 empirical factors:
  - *Uncertainty Proxy* (residual variance)
  - *Spatial Speed Disagreement* (topological neighbor divergence)
  - *Traffic Drift* (temporal rate of speed change)
  - *Spatial Influence* (graph centrality)
  - *Freshness* (time elapsed since last active sample)
  - *Information Debt* (unmonitored step accumulation)
  - *Coverage Need* (regional blind-spot density)
  - *Data Quality* (sensor availability status)
  - *Redundancy Penalty* (clustering suppression)
- **Sensor Jury**: Multi-neighbor consensus validation voting on localized speed anomalies.
- **Heuristic Plausibility Gate**: Kinematic consistency checking filtering physically impossible velocity transitions ($>25\text{ mph}$ change within 5 minutes).

---

## 8. Federated Learning

To preserve jurisdictional privacy and avoid transmitting raw sensor streams:

- **Client Partitioning**: 207 sensors clustered into 4 geographic clients:
  - **Client A** (North-East): 48 sensors (weight $w_A = 0.2291$)
  - **Client B** (South-East): 57 sensors (weight $w_B = 0.2771$)
  - **Client C** (Central-West): 58 sensors (weight $w_C = 0.2795$)
  - **Client D** (North-West): 44 sensors (weight $w_D = 0.2144$)
- **Aggregation Protocol**: Weighted Federated Averaging (FedAvg) where client weights are proportional to training observation counts.
- **Convergence**: Early stopping selected **Round 8** as the optimal checkpoint with a validation MAE of **3.1536 mph**.
- **Generalization**: Final test set MAE is **3.5322 mph**—only a **+2.75% (+0.0944 mph)** trade-off compared to the centralized model (3.4378 mph), verifying decentralized feasibility.

---

## 9. Communication Optimization

TrafficPulse-X optimizes communication through dual-level accounting:

- **Level 1 (Sensor-to-Edge)**: High-speed 187-byte serialized compact status heartbeats versus ~4.2 KB detailed telemetry payloads on demand.
- **Level 2 (Edge-to-Server Federated Scheduling)**: **Client Contribution Value (CCV)** scheduling selects a subset of regional edge clients each round based on:
  $$\text{CCV}_k = \alpha \cdot s_k + \beta \cdot d_k + \lambda \cdot \tau_k$$
  *(where $s_k$ is sensor fraction, $d_k$ is regional drift magnitude, and $\tau_k$ is communication debt).*

---

## 10. Results

### Centralized 7-Model Benchmark
| Rank | Model | Overall MAE (mph) | Overall RMSE (mph) | Overall MAPE (%) | +5 min MAE | +15 min MAE | +30 min MAE | +60 min MAE |
| :---: | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **1** | **Spatial Graph+LSTM** | **3.4378** | **6.8873** | **9.57%** | **2.3648** | **3.0007** | **3.6699** | **4.7158** |
| 2 | Spatial GCN | 3.5821 | 7.1420 | 10.12% | 2.5112 | 3.1890 | 3.8214 | 4.8068 |
| 3 | Temporal LSTM | 3.6914 | 7.3512 | 10.45% | 2.5934 | 3.2981 | 3.9450 | 4.9291 |
| 4 | Temporal GRU | 3.7120 | 7.3980 | 10.51% | 2.6102 | 3.3150 | 3.9680 | 4.9548 |
| 5 | Linear Regression | 4.1205 | 8.1124 | 11.90% | 2.9412 | 3.7820 | 4.4510 | 5.3078 |
| 6 | Historical Average | 4.1934 | 8.2410 | 12.15% | 4.1934 | 4.1934 | 4.1934 | 4.1934 |
| 7 | Last Value | 4.4520 | 8.9140 | 13.02% | 2.8120 | 3.9450 | 4.8810 | 6.1700 |

### Selective Communication Policies
| Policy | Selected Clients | Total Application Payload | Payload Reduction | Test MAE (mph) | Operational Status |
| :--- | :---: | :---: | :---: | :---: | :--- |
| **Full Participation** | 4 / 4 | 11,468,184 B (11.47 MB) | 0.0% | 3.6473 | Synchronous Baseline |
| **75% Participation** | 3 / 4 | 8,601,138 B (8.60 MB) | -25.0% | 3.6530 | Dominated by 50% Policy |
| **50% Participation** | 2 / 4 | **5,734,092 B (5.73 MB)** | **-50.0%** | **3.6448** | **Best Balanced Trade-off** |
| **25% Participation** | 1 / 4 | **2,867,046 B (2.87 MB)** | **-75.0%** | **3.6699** | **Maximum Observed Efficiency** |

*(Note: Application payload reflects serialized model parameter exchanges; physical transport overhead varies by network protocol).*

---

## 11. Technology Stack

- **Frontend**: React 19, Vite 8, Tailwind CSS 4, React Router 7, Leaflet & React-Leaflet, Recharts, Lucide Icons, Oxlint.
- **Backend**: Python 3.10+, FastAPI, Uvicorn, Pydantic v2, HTTPX.
- **Machine Learning**: PyTorch 2.0+, NumPy, Pandas, SciPy, PyTables (HDF5).
- **Testing & Verification**: Pytest, Chrome DevTools Protocol (CDP) automated browser validation.

---

## 12. Repository Structure

```
TrafficPulse-X/
├── backend/                        # FastAPI application & ML inference services
│   ├── communication_intelligence/ # Communication accounting & policy engines
│   ├── datasets/                   # METR-LA ingestion & split handling
│   ├── decision/                   # Need-Score, Jury, and Plausibility Gate
│   ├── federated/                  # Federated learning coordinator
│   ├── prediction/                 # Graph+LSTM inference service & schemas
│   ├── assistant.py                # Server-side AI assistant service
│   ├── data_source.py              # Authoritative data coordinator
│   ├── graph.py                    # Spatial adjacency matrix loader
│   ├── main.py                     # Primary FastAPI application
│   ├── requirements.txt            # Python dependencies
│   └── test_*.py                   # 18 test suites (300 verification tests)
├── data/                           # Dataset configuration & model artifacts
│   ├── processed/metr-la/          # Calibrated JSONs, regions, and checkpoints
│   └── raw/metr-la/                # Graph topology adjacency matrix & sensor IDs
├── docs/                           # Submission documentation
│   ├── ARCHITECTURE.md             # Deep architectural specifications
│   ├── AUDIT_REPORT.md             # Authoritative release audit
│   ├── DEMO_VIVA.md                # Hackathon viva presentation walkthrough
│   ├── DEVELOPMENT.md              # Contributor & engineering guide
│   ├── SCIENTIFIC_CONTRACT.md      # Frozen mathematical & experimental contracts
│   ├── TrafficPulse-X_Complete_Documentation.md  # Deep technical documentation source
│   └── TrafficPulse-X_Complete_Documentation.pdf # Complete submission PDF document
├── ml/                             # Machine learning models and training scripts
│   ├── baselines/                  # Last Value, HA, and Linear Regression
│   ├── federated/                  # FedAvg aggregator & client partitioning
│   ├── graph/                      # Spatial GCN implementation
│   ├── spatiotemporal/             # Spatial Graph+LSTM core implementation
│   └── temporal/                   # GRU and LSTM temporal baselines
├── public/                         # Public web assets and favicon
├── src/                            # React 19 frontend application
│   ├── app/                        # App root & route definitions
│   ├── components/                 # UI components
│   │   ├── alerts/                 # Alerts stream and inspector
│   │   ├── assistant/              # Floating AI assistant widget
│   │   ├── common/                 # Badges, buttons, tables, navigation
│   │   ├── communication/          # Payload charts and policy selector
│   │   ├── decision/               # Decision ranking and validation layer
│   │   ├── federated/              # FL partition cards and case studies
│   │   ├── overview/               # Overview hero console and metric cards
│   │   ├── prediction/             # Multi-horizon forecast and benchmark cards
│   │   └── traffic/                # Real-traffic map and sensor detail panel
│   ├── context/                    # ReplayContext & ThemeContext
│   ├── pages/                      # 7 core application routes
│   └── services/                   # Frontend API integration gateway
├── .env.example                    # Safe template for environment variables
├── .gitignore                      # Git exclusion rules
├── index.html                      # Single page application entry point
├── package.json                    # Node dependencies and scripts
├── package-lock.json               # Locked dependency tree
├── vite.config.js                  # Vite build configuration
└── README.md                       # Project documentation
```

---

## 13. Installation

### Prerequisites
- Node.js (v18 or higher recommended)
- Python (v3.10 or higher)

### Setup Steps
```bash
# Clone the repository
git clone https://github.com/AdarshSingh4455/TrafficPulse_X.git
cd TrafficPulse_X

# Install Frontend Dependencies
npm install

# Install Backend Dependencies
pip install -r backend/requirements.txt
```

---

## 14. Running Backend

Start the FastAPI application on port 8000:
```bash
python -m uvicorn backend.main:app --host 127.0.0.1 --port 8000
```
API Documentation will be accessible at: `http://127.0.0.1:8000/docs`

---

## 15. Running Frontend

Start the Vite development server on port 5173:
```bash
npm run dev -- --host 127.0.0.1 --port 5173
```
Open your browser at: `http://127.0.0.1:5173/`

---

## 16. Environment Variables

Create a local `.env` file from `.env.example`:
```bash
cp .env.example .env
```
Example configuration:
```ini
# Optional: Google Gemini API key for external LLM reasoning in the AI assistant
# If omitted, assistant uses built-in local knowledge retrieval without crashing
GEMINI_API_KEY=your_key_here
```
*(The `GEMINI_API_KEY` is loaded strictly on the server in `backend/assistant.py`. No secrets are bundled into client code).*

---

## 17. Testing

### Run Frontend Linting & Build
```bash
# Verify zero errors
npm run lint

# Verify clean production bundle
npm run build
```

### Run Backend Pytest Suite
```bash
python -m pytest backend -v
```
**Results**: **300 passed out of 300 tests (100% passing)** across all mathematical contracts, prediction services, decision layers, and federated checkpoints.

---

## 18. Screenshots

Representative system screenshots are available under the `/docs` documentation suite:
- **Traffic Network**: Interactive Leaflet 207-sensor map with embedded historical replay, 3 basemaps, region filters, and color-coded speed legend.
- **Predictions**: Multi-horizon speed forecasts (+5m to +60m) with calibrated uncertainty bounds and 7-model comparative benchmark.
- **Decision Intelligence**: Dynamic Need Score breakdown, Next-Best Query ranking, Sensor Jury consensus, and heuristic plausibility gate.
- **Federated Learning**: 4 regional client partition cards, Round 8 convergence chart, and Indian smart-mobility municipal case studies (Ranchi, Tumakuru, Visakhapatnam).
- **Communication Intelligence**: Pareto-optimal policy comparison cards, application payload breakdown donut, and regional traffic accounting table.
- **Alerts**: Attention and evidence telemetry stream with selected event inspector.

---

## 19. Limitations

- **Historical Replay Telemetry**: Evaluated on historical METR-LA sensor recordings; does not stream present-day live road telemetry.
- **Speed-Only Benchmark**: METR-LA supplies inductive loop speed measurements (mph). Physical vehicle volume (flow), road occupancy, and verified incident ground truth are not present in the dataset.
- **Application Payload Accounting**: Communication figures reflect measured serialized application payloads. Actual physical transport bandwidth depends on lower-layer transport protocols (TCP/IP headers, TLS handshake overhead, packet loss).
- **Heuristic Plausibility Gate**: Kinematic consistency validation checks maximum acceleration plausibility rather than physical ground vehicle dynamics.

---

## 20. Documentation

Comprehensive project documentation is maintained in the [`docs/`](docs/) directory:
- [Architecture Specifications](docs/ARCHITECTURE.md)
- [Scientific Contracts & Provenance](docs/SCIENTIFIC_CONTRACT.md)
- [Engineering & Development Guide](docs/DEVELOPMENT.md)
- [Demo & Viva Presentation Guide](docs/DEMO_VIVA.md)
- [Release Audit Report](docs/AUDIT_REPORT.md)
- [Complete Technical Documentation (PDF)](docs/TrafficPulse-X_Complete_Documentation.pdf)
- [Complete Technical Documentation Source (Markdown)](docs/TrafficPulse-X_Complete_Documentation.md)

---

## 21. References

1. **Li, Y., Yu, R., Shahabi, C., & Liu, Y. (2018)**. *Diffusion Convolutional Recurrent Neural Network: Data-Driven Traffic Forecasting*. International Conference on Learning Representations (ICLR).
2. **Yu, B., Yin, H., & Zhu, Z. (2018)**. *Spatio-Temporal Graph Convolutional Networks: A Deep Learning Framework for Traffic Forecasting*. International Joint Conference on Artificial Intelligence (IJCAI).
3. **McMahan, B., Moore, E., Ramage, D., Hampson, S., & y Arcas, B. A. (2017)**. *Communication-Efficient Learning of Deep Networks from Decentralized Data*. Artificial Intelligence and Statistics (AISTATS).
4. **Chen, C., Petty, K., Skabardonis, A., Varaiya, P., & Jia, Z. (2001)**. *Freeway Performance Measurement System (PeMS)*. Transportation Research Record.
5. **Ministry of Housing and Urban Affairs (MoHUA), Government of India (2015–2024)**. *Smart Cities Mission: Integrated Command and Control Centres (ICCC) and Adaptive Traffic Control Systems (ATCS)*.

---

## License
**Status**: `LICENSE MISSING`
*Recommendation: MIT License or Apache 2.0. To be finalized upon project owner authorization.*
