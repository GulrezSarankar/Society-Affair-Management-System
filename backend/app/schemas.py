from pydantic import BaseModel, EmailStr
from pydantic import BaseModel

class RegisterSchema(BaseModel):
    name: str
    email: EmailStr
    password: str

class LoginSchema(BaseModel):
    email: EmailStr
    password: str


from pydantic import BaseModel, EmailStr

class RegisterSchema(BaseModel):
    name: str
    email: EmailStr
    password: str

# 🔥 New Response Schema (important)
class UserResponse(BaseModel):
    id: int
    name: str
    email: EmailStr
    role: str

    class Config:
        from_attributes = True

class ResidentCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    flat_id: int   # 🔥 important
from pydantic import BaseModel

# 🔹 Create Flat
class FlatCreate(BaseModel):
    flat_number: str
    floor: int
    block: str


# 🔹 Response Flat
class FlatResponse(BaseModel):
    id: int
    flat_number: str
    floor: str
    block: str

    class Config:
        from_attributes = True


class MaintenanceCreate(BaseModel):
    user_id: int
    amount: int

class MaintenanceResponse(BaseModel):
    id: int
    amount: int
    status: str

    class Config:
        from_attributes = True


class ResidentRegister(BaseModel):
    name: str
    email: str
    password: str

class LoginSchema(BaseModel):
    email: str
    password: str

class ForgotPassword(BaseModel):
    email: str

class VerifyOTP(BaseModel):
    email: str
    otp: str

class ResetPassword(BaseModel):
    email: str
    new_password: str


class ComplaintCreate(BaseModel):
    title: str
    description: str