### 🚀 Society Affair Management System

A full-stack web application designed to simplify and automate residential society operations, including resident management, maintenance tracking, complaint handling, and role-based access control.
---
## ⚙️ Installation Guide
🖥️ Backend Setup (FastAPI)
📦 Install dependencies
pip install -r requirements.txt
▶️ Run backend server
uvicorn main:app --reload
---
### 🌐 Frontend Setup (React + Vite)
📦 Install dependencies
npm install
🎨 Install Tailwind CSS (if not installed)
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
📚 Install Required Libraries
npm install axios react-router-dom lucide-react recharts
▶️ Run frontend
npm run dev
---
### 📁 Project Structure
backend/
frontend/
uploads/
requirements.txt
README.md
---
### 🎯 Features
🔐 JWT Authentication (Admin & Resident)
📧 Email OTP Verification
🏠 Flat & Resident Management
💰 Maintenance Tracking & Payment
📸 Complaint System with Image Upload
📊 Dashboard with Charts
👮 Admin Approval System
---
### 🔐 Environment Variables
Create .env file in backend/:

SECRET_KEY=your_secret_key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
🚀 Run Project
## Backend
uvicorn main:app --reload
---

# Frontend
npm run dev
---

## 👨‍💻Author
Developed as a full-stack project to demonstrate real-world application architecture and problem-solving.
---
