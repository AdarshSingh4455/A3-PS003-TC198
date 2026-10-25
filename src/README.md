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
| **Milestone 3** | **Oct 24, 2026** | Baseline traffic forecasting models & metric evaluation framework | **Completed** |
| **Milestone 4** | **Oct 25, 2026** | Temporal deep learning models (TemporalLSTM & TemporalGRU) & loss | **Completed** |
| **Milestone 5** | **Oct 25, 2026** | Chebyshev polynomial spatial graph convolutions (SpatialGCN) | Planned |
| **Milestone 6** | **Oct 25, 2026** | Spatiotemporal neural architecture (SpatialGraphLSTM) end-to-end | Planned |
| **Milestone 7** | **Oct 25, 2026** | Centralized model evaluation benchmarks & comparative results | Planned |
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

---

## 6. Baseline Traffic Forecasting Models

To provide a rigorous benchmark for deep spatiotemporal and federated learning architectures, three standard non-deep learning baseline predictors are implemented in `ml/baselines/`:

### A. Implemented Baselines
1. **Last Value (Persistence Baseline)**:
   Assumes current traffic speed persists into the future across all horizons:
   $$\hat{y}_{t+h} = y_t, \quad \forall h \in \{15, 30, 45, 60\}\text{ mins}$$
   Includes backward fallback search across preceding history window in the presence of sensor dropouts.

2. **Historical Average (HA)**:
   Captures periodic weekly commute cycles by computing conditional historical means:
   $$\hat{y}_{t+h}(s) = \frac{1}{|D_{\text{train}}|} \sum_{\tau \in D_{\text{train}}} y_\tau(s) \quad \text{for } \text{dayofweek}(\tau) = d, \, \text{time\_slot}(\tau) = \sigma$$
   Trained strictly on historical train splits to prevent test data leakage.

3. **Linear / Ridge Regression**:
   Direct multivariate regression learning a linear mapping from normalized temporal observation windows $X \in \mathbb{R}^{B \times 12 \times 207 \times 1}$ to multi-horizon predictions with L2 regularization ($\lambda = 1.0$).

### B. Standardized Traffic Metric Formulations
Evaluation across all forecasting models is computed strictly on unnormalized physical traffic speed space ($\text{mph}$):
- **Mean Absolute Error (MAE)**:
  $$\text{MAE} = \frac{1}{|V|}\sum_{i=1}^{|V|} |y_i - \hat{y}_i|$$
- **Root Mean Squared Error (RMSE)**:
  $$\text{RMSE} = \sqrt{\frac{1}{|V|}\sum_{i=1}^{|V|} (y_i - \hat{y}_i)^2}$$
- **Mean Absolute Percentage Error (MAPE)**:
  $$\text{MAPE} = \frac{100\%}{|V|}\sum_{i=1}^{|V|} \left|\frac{y_i - \hat{y}_i}{y_i}\right| \quad \text{for } y_i > 0$$

---

## 7. Temporal Deep Learning Architectures (TemporalLSTM & TemporalGRU)

Implemented in `ml/temporal/`, these models capture sequential temporal dynamics across continuous 5-minute historical traffic windows:

### A. Model Formulations
- **TemporalGRU**: 1-layer GRU with hidden dimension $h=64$. Transposes input tensors to $(B \cdot S, 12, 2)$ to learn globally shared temporal transitions while maintaining lightweight parameter scale ($\sim 13.2\text{k}$ parameters).
- **TemporalLSTM**: 1-layer LSTM with cell state memory ($h=64$), preventing vanishing gradients across the 12-step lookback window ($\sim 17.5\text{k}$ parameters).

### B. Masked MAE Loss Function
Sensors occasionally undergo hardware dropouts or telemetry packet loss. To avoid penalizing models on missing data, loss is computed strictly across valid target points:

$$\mathcal{L}_{\text{MaskedMAE}}(Y, \hat{Y}, M) = \frac{\sum_{b, t, s} M_{b, t, s} \cdot \left| Y_{b, t, s} - \hat{Y}_{b, t, s} \right|}{\max\left(1, \sum_{b, t, s} M_{b, t, s}\right)}$$
