# TrafficPulse-X Implementation Source

Welcome to the **TrafficPulse-X** core implementation workspace for **Problem Statement PS-003: Federated Traffic-Flow Prediction with Communication-Cost Evaluation**.

TrafficPulse-X provides an enterprise-grade federated traffic forecasting system built upon spatial graph convolutional networks, temporal recurrence, privacy-preserving federated aggregation, and an interactive real-time decision intelligence dashboard.

---

## 1. System Architecture Overview

```text
                               ┌─────────────────────────────────┐
                               │     Central Federated Server    │
                               │  - Global Aggregator (FedAvg)   │
                               │  - CCV Client Scheduling Engine │
                               │  - DP Noise & Secure Aggregator │
                               └────────────────┬────────────────┘
                                                │
                     ┌──────────────────────────┼──────────────────────────┐
                     │ Global Weights W_t       │ Updates ΔW_k             │ Evaluation
                     ▼                          ▼                          ▼
        ┌────────────────────────┐ ┌────────────────────────┐ ┌────────────────────────┐
        │  Regional Client 0     │ │  Regional Client 1     │ │  Regional Client 2     │
        │  (Griffith Park/Glend) │ │  (Downtown LA Core)    │ │  (San Fernando Valley) │
        │  - Local PEMS Subgraph │ │  - Local PEMS Subgraph │ │  - Local PEMS Subgraph │
        │  - Chebyshev GCN+LSTM  │ │  - Chebyshev GCN+LSTM  │ │  - Chebyshev GCN+LSTM  │
        └────────────────────────┘ └────────────────────────┘ └────────────────────────┘
```

The system is organized into modular subsystems:
- **`ml/`**: Machine learning models (Chebyshev GCN, LSTM), baseline forecasters, federated learning contracts, communication-constrained scheduling (CCV), and differential privacy.
- **`backend/`**: High-performance FastAPI backend exposing REST APIs for live telemetry, model predictions, decision scoring, and client fleet metrics.
- **`frontend/`**: Interactive operator dashboard built with React 19, Vite, and Leaflet for geospatial traffic visualization, historical replay, and dispatch controls.
- **`data/`**: Sensor topology, adjacency matrices, distance metadata, and traffic speed series.

---

## 2. Technical Stack & Prerequisites

- **Python Runtime**: Python 3.10 or higher
- **Machine Learning**: PyTorch 2.0+, NumPy, SciPy, Pandas, Opacus (Differential Privacy)
- **Backend API**: FastAPI, Uvicorn, Pydantic v2
- **Frontend & Visualization**: Node.js 18+, React 19, Vite, Leaflet, React-Leaflet, Recharts, Tailwind CSS
- **Testing**: Pytest (automated test suite)

---

## 3. Environment Setup & Scaffolding

### A. Python ML & Backend Environment
```bash
# Navigate to the source folder
cd src

# Create and activate a Python virtual environment
python -m venv .venv
source .venv/bin/activate    # On Linux/macOS
# or: .venv\Scripts\activate # On Windows

# Install runtime dependencies
pip install -r requirements.txt
```

### B. Frontend Dashboard Environment
```bash
# Install frontend package dependencies
npm install

# Start the Vite local development server
npm run dev
```

### C. Configuration
Copy the provided `.env.example` to `.env` to configure optional overrides:
```bash
cp .env.example .env
```

---

## 4. Progressive Implementation Roadmap

| Milestone | Target Date | Focus Area | Status |
| :--- | :--- | :--- | :--- |
| **Milestone 1** | **Oct 24, 2026** | Project scaffolding, dependency manifests, and environment baseline | **Completed** |
| **Milestone 2** | **Oct 24, 2026** | PEMS-BAY sensor topology, spatial graph adjacency, and data loaders | **Completed** |
| **Milestone 3** | **Oct 24, 2026** | Baseline traffic forecasting models & metric evaluation framework | Planned |
| **Milestone 4-7** | **Oct 25, 2026** | Spatiotemporal neural architectures (Chebyshev GCN + LSTM) & training | Planned |
| **Milestone 8-11** | **Oct 26, 2026** | Regional non-IID partitioning, FedAvg core, CCV scheduling & DP | Planned |
| **Milestone 12-15** | **Oct 27, 2026** | 9-Factor Decision Intelligence, FastAPI REST service & Interactive UI | Planned |
| **Milestone 16-18** | **Oct 28, 2026** | Historical replay engine, integration test suite, and final runbook | Planned |

---

## 5. Spatial Graph Topology & Road Network Dataset

### A. Dataset Overview & Ingestion
The spatial traffic network is structured across two prominent benchmarks:
- **METR-LA**: 207 traffic loop detector sensors positioned across Los Angeles County highways (Ventura Freeway, San Diego Freeway, Harbor Freeway, Hollywood Freeway).
- **PEMS08**: 170 traffic detector sensors along San Bernardino regional interstate highways.

### B. Weighted Spatial Adjacency Matrix Construction
The road network is modeled as a directed graph $G = (V, E, W)$, where vertices $V$ represent loop sensors and $W$ represents pairwise proximity computed via a thresholded Gaussian kernel:

$$W_{ij} = \begin{cases} \exp\left(-\frac{\text{dist}(v_i, v_j)^2}{\sigma^2}\right), & \text{dist}(v_i, v_j) \le \kappa \\ 0, & \text{otherwise} \end{cases}$$

- $\text{dist}(v_i, v_j)$: Shortest path road network distance between sensors $i$ and $j$.
- $\sigma$: Standard deviation of network distances ($\approx 10\text{ km}$).
- $\kappa$: Distance threshold cutoff ($\approx 0.1$).

### C. Regional Partitioning & Sensor Metadata
The 207 sensors are mapped into 4 distinct geographic clusters to represent realistic non-IID regional client jurisdictions:
1. **Region 0 (Glendale / Griffith Park)**: Sensors covering US-101 and SR-134 intersections.
2. **Region 1 (Downtown Los Angeles Core)**: High-density arterial connectors (I-10, I-110).
3. **Region 2 (San Fernando Valley)**: Arterial routes along I-405 North.
4. **Region 3 (East LA / San Gabriel Corridor)**: Peripheral commute arteries.
