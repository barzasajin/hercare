from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base
from .models import User
from .routes import cycles, health_log, ai, pregnancy, demo

# Create database tables automatically
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="HerCare AI API",
    description="AI-powered women's health, cycle intelligence, pattern detection, and wellness platform.",
    version="1.0.0"
)

# CORS configuration to connect with React Vite frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows Vite dev server & production builds
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API Routers
app.include_router(cycles.router)
app.include_router(health_log.router)
app.include_router(ai.router)
app.include_router(pregnancy.router)
app.include_router(demo.router)

@app.get("/")
def root():
    return {
        "app": "HerCare AI API",
        "status": "healthy",
        "version": "1.0.0",
        "disclaimer": "HerCare AI provides wellness information and estimated predictions based on user-provided data. It is not intended to diagnose, treat, or prevent medical conditions and should not replace professional medical advice."
    }
