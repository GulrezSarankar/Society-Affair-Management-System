# =========================
#  IMPORTS
# =========================
from passlib.context import CryptContext
from jose import jwt, JWTError
from datetime import datetime, timedelta
from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import os
from dotenv import load_dotenv
import random

# Brevo API
from sib_api_v3_sdk import Configuration, ApiClient
from sib_api_v3_sdk.api import transactional_emails_api
from sib_api_v3_sdk.models import SendSmtpEmail

# =========================
#  LOAD ENV VARIABLES
# =========================
load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 30))

BREVO_EMAIL = os.getenv("BREVO_EMAIL")
BREVO_API_KEY = os.getenv("BREVO_API_KEY")
# =========================
#  VALIDATION
# =========================
if not SECRET_KEY:
    raise Exception("❌ SECRET_KEY not set in .env")

# if not BREVO_EMAIL or not BREVO_API_KEY:
#     raise Exception("❌ Brevo credentials missing")

print("✅ ENV LOADED")

# =========================
#  PASSWORD HASHING
# =========================
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(password: str):
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str):
    return pwd_context.verify(plain_password, hashed_password)


# =========================
#  JWT TOKEN CREATION
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
#  TOKEN AUTHENTICATION
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
#  ADMIN ROLE CHECK
# =========================
def admin_required(user=Depends(get_current_user)):
    if user.get("role") != "ADMIN":
        raise HTTPException(status_code=403, detail="Admin access required")
    return user


# =========================
#  EMAIL SENDER (BREVO API ✅ FINAL)
# =========================
def send_email(to_email: str, subject: str, body: str, otp: str = None):
    try:
        configuration = Configuration()
        configuration.api_key['api-key'] = BREVO_API_KEY

        api_instance = transactional_emails_api.TransactionalEmailsApi(
            ApiClient(configuration)
        )

        otp_section = ""
        if otp:
            otp_section = f"""
            <h1 style="color:#16a34a; text-align:center;">{otp}</h1>
            <p style="text-align:center;">This OTP is valid for 5 minutes.</p>
            """

        html_content = f"""
        <html>
            <body style="font-family: Arial;">
                <h2 style="color:#2563eb;">Society Management System</h2>
                <p>{body}</p>
                {otp_section}
                <hr>
                <p style="font-size:12px;color:gray;">
                    Do not share this OTP with anyone.
                </p>
            </body>
        </html>
        """

        send_smtp_email = SendSmtpEmail(
            to=[{"email": to_email}],
            sender={"email": BREVO_EMAIL, "name": "SocietySync"},
            subject=subject,
            html_content=html_content,
        )

        api_instance.send_transac_email(send_smtp_email)

        print("✅ Email sent via Brevo API")

    except Exception as e:
        print("❌ BREVO API ERROR:", e)
        raise HTTPException(status_code=500, detail=str(e))


# =========================
#  OTP GENERATOR
# =========================
def generate_otp():
    return str(random.randint(100000, 999999))