# HerCare AI 🌸
### AI-Powered Women's Health & Wellness Web Platform

**HerCare AI** is a complete full-stack web application designed to help women track their menstrual cycles and daily health information, understand biological changes and patterns in their health data, receive AI-generated observations, navigate pregnancy wellness, and receive supportive, personalized care recommendations.

> **Important Health Notice**: HerCare AI provides wellness information and estimated predictions based on user-provided data. It is not intended to diagnose, treat, or prevent medical conditions and should not replace professional medical advice.

---

## 🏛️ Technology Stack

- **Frontend**: React 18, React Router DOM, Chart.js, React-ChartJS-2, Lucide Icons, Vite
- **Backend**: Python 3.13, FastAPI, Uvicorn, Pydantic v2, CORS Middleware
- **Database**: SQLite with SQLAlchemy 2.0 ORM (structured for seamless PostgreSQL migration via `DATABASE_URL`)
- **AI/ML Engine**: Scikit-learn, Pandas, NumPy (Linear Regression cycle trend prediction, Pearson correlation engine, Z-score baseline change detection, contextual wellness recommender)

---

## 🚀 Quick Start Guide

### 1. Start the Backend API (Port 8000)

```powershell
cd backend
.\.venv\Scripts\python.exe run.py
```
* Interactive API Documentation (Swagger UI): `http://127.0.0.1:8000/docs`
* API Root: `http://127.0.0.1:8000/`

### 2. Start the Frontend Application (Port 5173)

```powershell
cd frontend
npm.cmd run dev
```
* Open your browser at: `http://localhost:5173`

---

## 📱 Features & Navigation

1. **Dashboard (`/`)**: Current cycle day, phase, next period countdown, AI wellness highlight, quick navigation cards.
2. **Cycle Tracker (`/cycle-tracker`)**: Period logging, cycle length estimation, fertile window calculation, historical cycle table.
3. **Health Log (`/health-log`)**: Log flow, discomfort slider (0-10), mood selection, energy rating, sleep hours & quality, symptom tags, personal reflections.
4. **AI Insights (`/ai-insights`)**: Biological phase hormonal context, cycle regularity analysis, synthesized observations.
5. **What Changed? (`/what-changed`)**: Baseline vs recent 7-day comparative analysis with delta metrics and non-alarmist AI narrative.
6. **Patterns (`/patterns`)**: Interactive charts for sleep vs energy correlation, cycle phase vs pain, symptom frequency, and cycle length history.
7. **Pregnancy Mode (`/pregnancy-mode`)**: Gestational week calculator, due date countdown, baby size milestones, trimester wellness guides.
8. **Personalized Support (`/personalized-support`)**: Hydration tracker (8-glass goal), interactive 4-4-4 breathing sanctuary, phase nutrition, daily affirmations.
9. **Privacy (`/privacy`)**: Local SQLite storage transparency, zero AI training guarantees, one-click JSON health data export, database reset.

---

## 🧪 Automated Testing

Run backend tests verifying database schema, sample seed data, and ML prediction engines:

```powershell
cd backend
.\.venv\Scripts\python.exe test_backend.py
.\.venv\Scripts\python.exe test_api_endpoints.py
```
