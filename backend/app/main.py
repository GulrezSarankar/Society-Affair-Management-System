from fastapi import FastAPI
from app.database import Base, engine
from app.auth import router as auth_router
from app.flat_routes import router as flat_router
from fastapi.middleware.cors import CORSMiddleware  
from app.maintenance import router as maintenance_router
from app.Resident import router as resident_router
from fastapi.staticfiles import StaticFiles
from app.Watchman import router as watchman_router

Base.metadata.create_all(bind=engine)


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    
)

app.include_router(auth_router)
app.include_router(watchman_router)
app.include_router(flat_router)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

app.include_router(resident_router)
app.include_router(maintenance_router)
@app.get("/")
def home():
    return {"message": "Society Management System API running"}