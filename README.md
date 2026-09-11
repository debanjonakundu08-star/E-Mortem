# E-Mortem &mdash; “The Autopsy of Electronic Waste”

> **Before you repair it, understand it.**  
> A consumer-first digital diagnostic and second-opinion platform for failing electronic devices.

---

## 1. Executive Summary

Every year, millions of electronic devices are prematurely discarded or subjected to expensive, unnecessary motherboard replacements based on incomplete repair counter diagnoses.

**E-Mortem** is an AI-inspired, digital postmortem forensics platform. When a device begins behaving erratically—such as random shutdowns, high battery drain, thermal throttling, charging disconnects, or display glitches—E-Mortem analyzes reported symptoms, physical incident history (drops, water, updates), and maintenance logs to generate a comprehensive **Electronic Postmortem Report**:
- **Health Score (0–100)**: Objective hardware vitality score across 6 key subsystems.
- **Repairability Score (0–100)**: Economic viability ranking (Repair vs Replace).
- **Ranked Probable Causes**: Pattern-based failure probabilities with non-technical root cause explanations.
- **Component Health Telemetry**: Battery, Thermal System, Storage, Display, Charging, and Software.
- **Recovery Analysis**: Identifies harvestable subcomponents (screens, cameras, NVMe/UFS storage) and data salvage feasibility.
- **Before You Pay the Technician (7 Key Questions)**: Actionable checklist for consumers to ask repair shops before approving speculative invoices.

---

## 2. System Architecture

E-Mortem features a decoupled, modular full-stack architecture:

```
┌──────────────────────────────────────────────────────────┐
│                   React + Vite Frontend                  │
│       Tailwind CSS • Recharts • Lucide React • SPA       │
│                 (Running on Port 5173)                   │
└────────────────────────────┬─────────────────────────────┘
                             │
                  REST API / JSON (HTTP)
                             │
┌────────────────────────────▼─────────────────────────────┐
│                 FastAPI Python Backend                   │
│        Uvicorn ASGI • CORS Middleware • Pydantic         │
│                 (Running on Port 8000)                   │
└──────────────┬────────────────────────────┬──────────────┘
               │                            │
┌──────────────▼──────────────┐ ┌───────────▼──────────────┐
│   Analysis Engine (Python)  │ │   SQLite Database        │
│ Transparent Rule Heuristics │ │   SQLAlchemy ORM         │
│ & Calibrated Benchmark Logic│ │   (backend/e_mortem.db)  │
└─────────────────────────────┘ └──────────────────────────┘
```

---

## 3. Technology Stack

- **Frontend**:
  - **React 18**: Component-driven user interface
  - **Vite 5**: High-speed build tooling and dev server
  - **Tailwind CSS**: Dark, futuristic cyberpunk/hardware telemetry aesthetic
  - **Recharts**: Interactive telemetry and macro e-waste failure intelligence charts
  - **Lucide React**: Modern iconography
- **Backend**:
  - **Python 3.10+ / 3.13**: Core programming language
  - **FastAPI**: Asynchronous high-performance REST API
  - **SQLAlchemy 2.0**: Relational Object-Relational Mapping (ORM)
  - **SQLite**: Local relational database (`backend/e_mortem.db`)
  - **Pydantic v2**: Request/response schema validation and data serialization
  - **Uvicorn**: Lightning-fast ASGI production server

---

## 4. REST API Reference

All backend endpoints are prefixed with `/api` and serve JSON:

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Service health status check |
| `GET` | `/api/devices` | List all registered electronic devices in SQLite |
| `POST` | `/api/devices` | Register a new device with purchase & valuation data |
| `GET` | `/api/devices/{id}` | Retrieve specific device details |
| `GET` | `/api/devices/{id}/reports` | List all postmortem reports for a specific device |
| `POST` | `/api/diagnose` | Run electronic autopsy heuristic analysis and persist to database |
| `GET` | `/api/reports` | List all archived postmortem reports |
| `GET` | `/api/reports/{id}` | Retrieve full postmortem details, component health, and 7 questions |
| `DELETE` | `/api/reports/{id}` | Delete an autopsy report from the database |
| `GET` | `/api/insights` | Aggregate macro failure intelligence and sustainability benchmarks |
| `POST` | `/api/assistant` | Digital second-opinion assistant query handler |

Interactive API documentation is generated at **[http://localhost:8000/docs](http://localhost:8000/docs)**.

---

## 5. Quick Start & Setup Instructions

### Prerequisites
- **Node.js**: v18+ (tested with v24)
- **Python**: v3.10+ (tested with v3.13)

### Step 1: Start the Backend (FastAPI + SQLite)
```bash
# Navigate to backend directory
cd backend

# Install dependencies
pip install -r requirements.txt

# (Optional) Seed the SQLite database with benchmark cases
python seed_data.py

# Run FastAPI server on port 8000
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```
*The backend automatically initializes tables and populates seed data on startup if the database is empty.*

### Step 2: Start the Frontend (React + Vite)
In a separate terminal:
```bash
# In the project root directory
npm install

# Run Vite dev server on port 5173
npm run dev
```

Open your browser at **[http://localhost:5173](http://localhost:5173)**.

---

## 6. Hackathon 2-Minute Demo Script

For evaluators and judges to test the entire system in under two minutes:

1. Open **[http://localhost:5173](http://localhost:5173)**.
2. In the top navigation bar or Dashboard hero banner, click **`⚡ Try Demo Diagnosis`**.
3. The platform instantly routes to the calibrated benchmark autopsy report for the **Samsung Galaxy S23** (`EM-2026-1024`):
   - **Health Score**: `64 / 100` (Attention Required)
   - **Repairability Score**: `78 / 100` (🟢 REPAIR FIRST)
   - **Top Ranked Probable Causes**:
     - `72%` &mdash; Battery Voltage Drop / Cell Degradation
     - `51%` &mdash; Thermal Throttling / Degraded Heat Dissipation
     - `38%` &mdash; Background Software Load / Post-Update Conflict
     - `18%` &mdash; Charging System Issue
   - **Component Health Meters**: Battery (42%), Thermal (61%), Storage (87%), Display (94%), Charging (68%), Software (72%).
   - **Economic Comparison**: Repair (₹1,500–₹3,000) vs Residual Value (₹18,000) &rarr; **REPAIR FIRST**.
   - **Before You Pay the Technician**: 7 questions to ask the repair shop with interactive checkboxes.
4. Try the **Ask E-Mortem** chat assistant in the bottom right corner (e.g. *"Why is my phone shutting down at 30%?"*).
5. Navigate to **Failure Intelligence (`/insights`)** to explore the macro root-cause distribution across consumer devices.

---

## 7. Limitations & Ethical Transparency

- **Hackathon Prototype**: E-Mortem is an intelligent pattern-recognition decision aid, **not a medical or industrial-grade hardware oscilloscope**. It does not physically probe printed circuit boards.
- **Pattern Estimates**: All probabilities and percentages are heuristic prototype approximations designed to educate users and prevent predatory repair billing.
- **Privacy First**: All user telemetry is processed locally; no external third-party proprietary AI APIs are called.

---

## 8. Future AI / ML Integration Roadmap

While this prototype employs transparent, rule-based heuristics, its architecture is decoupled to support future ML models:
1. **Audio Acoustic Forensics**: Frequency analysis of fan bearing whine, capacitor coil squeal, and HDD click-of-death patterns.
2. **Thermal Camera Vision Models**: Integration with FLIR mobile camera attachments to segment motherboard hot spots.
3. **Collaborative Repair Benchmarking**: Crowdsourced right-to-repair databases mapping failure symptoms to specific board-level component reference designators.
