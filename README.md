# Retail Promotion Intelligence Platform (GenUI Analytics)

An AI-powered analytical platform designed to provide tangible promotion insights to Sales Directors using a GenUI-driven dynamic rendering architecture.

## System Architecture

The platform follows a strict modular separation of concerns to ensure scalability and production readiness.

### 1. Analytics Engine (Deterministic)
- Located in `backend/app/services/analytics/` and `query_engine/`.
- Responsible for reliable, code-driven calculations of business metrics.
- Uses Pandas and Scikit-learn for descriptive and predictive tasks.

### 2. AI Orchestration Layer (Probabilistic)
- Located in `backend/app/services/ai/`.
- Handles intent parsing, dynamic UI schema generation, and natural language synthesis.
- Orchestrates between the Analytics Engine and the GenUI Rendering layer.

### 3. GenUI Rendering Layer
- Located in `frontend/components/genui/`.
- A schema-driven UI system that renders components (charts, cards, tables) based on JSON definitions received from the AI layer.

### 4. Feature Engineering & Query Engineering
- Dedicated layers for translating raw data into business-ready features (`uplift`, `revenue`, `promo_metrics`).

## Project Structure

- `backend/`: FastAPI application, SQL models, and analytical services.
- `frontend/`: Next.js application with TailwindCSS and dynamic rendering logic.
- `data/`: Raw and processed data storage (Git ignored).
- `ml/`: ML notebooks and model storage for forecasting.
- `docker-compose.yml`: (Placeholder) Container orchestration setup.

## Development Phases

1. **Database & Schema Setup**: Initializing PostgreSQL models and Alembic migrations.
2. **Feature Engineering**: Implementing core business metrics (Revenue, Uplift).
3. **Analytics API**: Building deterministic endpoints for raw analytical results.
4. **Static Visualizations**: Creating base Recharts components.
5. **AI Intent Parsing**: Implementing LLM prompts to extract user intent.
6. **GenUI Rendering**: Connecting AI schemas to the dynamic frontend renderer.
7. **Predictive Analytics**: Integrating Prophet for sales forecasting.

## Local Setup

### Backend
1. `cd backend`
2. `pip install -r requirements.txt`
3. Create `.env` from `.env.example`
4. `uvicorn app.main:app --reload`

### Frontend
1. `cd frontend`
2. `npm install`
3. `npm run dev`

### PostgreSQL Setup
- Ensure a PostgreSQL instance is running.
- Create a database named `retail_analytics`.
- Update `DATABASE_URL` in `backend/.env`.
