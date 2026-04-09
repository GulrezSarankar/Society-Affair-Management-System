import os
import ssl
import boto3
from sqlalchemy import create_engine
from dotenv import load_dotenv

# Load .env file
load_dotenv()

# ========================
# SECURITY
# ========================
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 30))

# ========================
# DATABASE
# ========================
DB_URL = os.getenv("DATABASE_URL")

ssl_context = ssl.create_default_context()

engine = create_engine(
    DB_URL,
    connect_args={
        "ssl": ssl_context
    }
)

# ========================
# AWS S3
# ========================
BUCKET_NAME = os.getenv("BUCKET_NAME")
AWS_REGION = os.getenv("AWS_REGION")

s3 = boto3.client(
    "s3",
    region_name=AWS_REGION,
    aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
    aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY"),
)