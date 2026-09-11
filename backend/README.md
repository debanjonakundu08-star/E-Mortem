# E-Mortem &mdash; FastAPI Backend Service

> **“The Autopsy of Electronic Waste.”**  
> REST API and Rule-Based Electronic Postmortem Diagnostic Heuristic Engine.

---

## 1. Overview

The **E-Mortem Backend** is a high-performance, lightweight Python service powered by:
- **FastAPI**: Modern asynchronous REST API framework
- **SQLAlchemy & SQLite**: Zero-configuration relational database (`e_mortem.db`)
- **Pydantic v2**: Strict request/response payload validation
- **Analysis Engine**: Transparent, weighted heuristic scoring algorithms for hardware diagnostics, economic repairability, and postmortem reporting

---

## 2. Directory Structure

```
backend/
├── main.py              # FastAPI application, route handlers, and CORS configuration
├── database.py          # SQLite connection and session maker
├── models.py            # SQLAlchemy database tables (User, Device, Diagnosis, Report)
├── schemas.py           # Pydantic schemas for data serialization and validation
├── analysis_engine.py   # Heuristic scoring engine (Health, Repairability, Causes, Telemetry)
├── seed_data.py         # Initialization and seed data (Samsung Galaxy S23 benchmark case)
├── requirements.txt     # Python package dependencies
└── README.md            # Backend documentation
```

---

## 3. Setup and Execution

### Prerequisites
- Python 3.10+ (tested with Python 3.13)
- `pip` package manager

### 1. Install Dependencies
```bash
cd backend
pip install -r requirements.txt
```

### 2. Seed Database (Automatic on Startup or Manual)
```bash
python seed_data.py
```

### 3. Run FastAPI Server
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The interactive OpenAPI / Swagger documentation will be available at:
- **Swagger UI**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **ReDoc**: [http://localhost:8000/redoc](http://localhost:8000/redoc)

---

## 4. REST API Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Service health status and version identifier |
| `GET` | `/api/devices` | List all registered electronic devices |
| `POST` | `/api/devices` | Register a new device with purchase and valuation telemetry |
| `GET` | `/api/devices/{id}` | Get specific device details |
| `GET` | `/api/devices/{id}/reports` | Get all diagnosis reports tied to a device |
| `POST` | `/api/diagnose` | Run electronic autopsy heuristic analysis and persist report |
| `GET` | `/api/reports` | List all electronic postmortem reports with summary metrics |
| `GET` | `/api/reports/{id}` | Retrieve complete autopsy details, causes, telemetry, and 7 questions |
| `DELETE` | `/api/reports/{id}` | Delete a diagnosis report |
| `GET` | `/api/insights` | Aggregate macro failure intelligence and repair statistics |
| `POST` | `/api/assistant` | Rule-based responses for "Ask E-Mortem" digital second opinion |

---

## 5. Benchmark Calibration

The engine includes deterministic calibration for the demo benchmark:
- **Device**: Samsung Galaxy S23 (Purchased March 2024)
- **Symptoms**: Random Shutdown, Battery Drain, Overheating, Slow Performance
- **Outputs**:
  - Health: `64 / 100` (Attention Required)
  - Repairability: `78 / 100` (REPAIR FIRST)
  - Primary Probable Cause: Battery Voltage Drop / Cell Degradation (72%)
  - Secondary: Thermal Throttling / Degraded Heat Dissipation (51%)
  - Repair vs Replace: ₹1,500–₹3,000 battery service vs ₹18,000 value
  - 7 Questions to Ask the Repair Shop
