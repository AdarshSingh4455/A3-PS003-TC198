# AIORI 3 Hackathon – Team A3-PS003-TC198

## Team Details

- **Team Code:** TC198
- **Problem Statement ID:** PS003
- **Hackathon:** AIORI 3
- **Project Name:** TrafficPulse-X

## Problem Statement

**Federated Traffic-Flow Prediction with Communication-Cost Evaluation**

The problem focuses on building a traffic forecasting system using federated learning while also evaluating the communication required between distributed clients and a central server.

## Our Proposed Solution

Our solution is **TrafficPulse-X**.

TrafficPulse-X uses historical traffic sensor data to forecast future traffic conditions while allowing regional clients to train locally.

Instead of continuously sending all raw traffic data to a central server, regional clients train locally and share model updates for federated aggregation.

Our proposed solution includes:

- Graph + LSTM based traffic-speed forecasting
- Federated Learning using FedAvg
- Regional non-IID client partitions
- Communication-cost evaluation
- Selective client participation
- Decision Intelligence
- Interactive traffic analysis dashboard

The aim is to study whether federated traffic forecasting can maintain useful prediction quality while reducing unnecessary communication.

## Project Presentation

Our AIORI project presentation is available here:

[View Project Presentation](./A3-PS003-TC198-Presentation.pdf)

## Team Introduction Video

Our team introduction video covers:

- Team member roles and responsibilities
- Our understanding of PS-003
- The proposed TrafficPulse-X solution

[Watch Team Introduction Video](https://youtu.be/kbMFY39V_l4)

## Level 1 Submission Status

- GitHub collaboration setup completed
- Repository naming completed
- AIORI GitHub collaboration completed
- Repository ownership transferred to AIORI
- Project presentation uploaded
- Team introduction video created
- YouTube video link added

## Repository Structure

```text
A3-PS003-TC198/
├── README.md
├── A3-PS003-TC198-Presentation.pdf
└── src/
```
