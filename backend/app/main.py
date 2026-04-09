from fastapi import FastAPI
from app.database import Base, engine
from app.auth import router as auth_router
from app.flat_routes import router as flat_router
from fastapi.middleware.cors import CORSMiddleware
from app.maintenance import router as maintenance_router
from app.Resident import router as resident_router
from fastapi.staticfiles import StaticFiles
from app.Watchman import router as watchman_router
import os
from fastapi.middleware.cors import CORSMiddleware

# Create uploads folder if not exists
if not os.path.exists("uploads"):
    os.makedirs("uploads")

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI()

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://society-affair-management-system.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routes
app.include_router(auth_router)
app.include_router(watchman_router)
app.include_router(flat_router)
app.include_router(resident_router)
app.include_router(maintenance_router)

# Static files
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# Test route
@app.get("/")
def home():
    return {"message": "Society Management System API running 🚀"}