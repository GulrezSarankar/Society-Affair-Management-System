# 🔐 Password + JWT + Role-based Auth Utilities

from passlib.context import CryptContext
from jose import jwt, JWTError
from datetime import datetime, timedelta
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import os
from dotenv import load_dotenv

# =========================
# ✅ LOAD ENV VARIABLES (FIXED)
# =========================
load_dotenv(dotenv_path=os.path.join(os.getcwd(), ".env"))

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM") or "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 30))

EMAIL_USER = os.getenv("EMAIL_USER")
EMAIL_PASS = os.getenv("EMAIL_PASS")

# =========================
# 🔥 VALIDATION (VERY IMPORTANT)
# =========================
if not SECRET_KEY:
    raise Exception("❌ SECRET_KEY not set in .env")

if not EMAIL_USER or not EMAIL_PASS:
    raise Exception("❌ EMAIL_USER or EMAIL_PASS not set in .env")

# Debug (remove later)
print("✅ ENV LOADED")
print("EMAIL_USER:", EMAIL_USER)
print("ALGORITHM:", ALGORITHM)

# =========================
# 🔑 Password Hashing
# =========================
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(password: str):
    return pwd_context.hash(password)


def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)


# =========================
# 🔐 JWT Token Creation (FIXED)
# =========================
def create_access_token(data: dict):
    try:
        to_encode = data.copy()

        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        to_encode.update({"exp": expire})

        return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

    except Exception as e:
        print("❌ JWT Error:", e)
        raise HTTPException(status_code=500, detail="Token creation failed")


# =========================
# 🔒 Token Authentication
# =========================
security = HTTPBearer()


def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid or expired token")


# =========================
# 👮 Admin Role Check
# =========================
def admin_required(user=Depends(get_current_user)):
    if user.get("role") != "ADMIN":
        raise HTTPException(status_code=403, detail="Admin access required")
    return user


# =========================
# 📧 EMAIL SENDER (FULL FIX)
# =========================
def send_email(to_email: str, subject: str, body: str, otp: str = None):
    try:
        sender = EMAIL_USER
        password = EMAIL_PASS

        if not sender or not password:
            raise Exception("Email credentials missing")

        msg = MIMEMultipart()
        msg["From"] = sender
        msg["To"] = to_email
        msg["Subject"] = subject

        # OTP section
        otp_section = ""
        if otp:
            otp_section = f"""
            <h1 style="color:#16a34a; text-align:center;">
                {otp}
            </h1>
            <p style="text-align:center;">
                This OTP is valid for 5 minutes.
            </p>
            """

        html_content = f"""
        <html>
            <body style="font-family: Arial, sans-serif;">
                <h2 style="color: #2563eb;">
                    Society Management System
                </h2>

                <p>{body}</p>

                {otp_section}

                <hr>
                <p style="font-size: 12px; color: gray;">
                    Do not share this OTP with anyone.
                </p>
            </body>
        </html>
        """

        msg.attach(MIMEText(html_content, "html"))

        # SMTP setup
        server = smtplib.SMTP("smtp.gmail.com", 587)
        server.starttls()

        server.login(sender, password)  # 🔥 THIS WAS FAILING BEFORE

        server.sendmail(sender, to_email, msg.as_string())
        server.quit()

        print("✅ Email sent successfully")

    except Exception as e:
        print("❌ Email failed:", e)
        raise HTTPException(status_code=500, detail=f"Email error: {str(e)}")