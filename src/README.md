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
| **Milestone 2** | **Oct 24, 2026** | PEMS-BAY sensor topology, spatial graph adjacency, and data loaders | Planned |
| **Milestone 3** | **Oct 24, 2026** | Baseline traffic forecasting models & metric evaluation framework | Planned |
| **Milestone 4-7** | **Oct 25, 2026** | Spatiotemporal neural architectures (Chebyshev GCN + LSTM) & training | Planned |
| **Milestone 8-11** | **Oct 26, 2026** | Regional non-IID partitioning, FedAvg core, CCV scheduling & DP | Planned |
| **Milestone 12-15** | **Oct 27, 2026** | 9-Factor Decision Intelligence, FastAPI REST service & Interactive UI | Planned |
| **Milestone 16-18** | **Oct 28, 2026** | Historical replay engine, integration test suite, and final runbook | Planned |
