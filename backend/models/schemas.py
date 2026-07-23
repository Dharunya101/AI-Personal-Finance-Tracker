from pydantic import BaseModel, EmailStr
from typing import Optional

# ==========================================
# Transaction Models
# ==========================================

class Transaction(BaseModel):

    user_email: str

    notes: str

    payment_mode: str

    location: str

    amount: float

    date: str


class UpdateTransaction(BaseModel):

    notes: Optional[str] = None

    payment_mode: Optional[str] = None

    location: Optional[str] = None

    amount: Optional[float] = None

    date: Optional[str] = None


# ==========================================
# Budget Model
# ==========================================

class Budget(BaseModel):

    category: str

    monthly_budget: float


# ==========================================
# User Models
# ==========================================

class User(BaseModel):

    name: str

    email: EmailStr

    password: str


from pydantic import BaseModel

class LoginUser(BaseModel):
    email: str
    password: str
    captcha: str


# ==========================================
# Update Profile
# ==========================================

class UpdateUser(BaseModel):

    name: str

    email: EmailStr


# ==========================================
# Change Password
# ==========================================

class ChangePassword(BaseModel):

    email: EmailStr

    current_password: str

    new_password: str

class ForgotPassword(BaseModel):

    email:str


class VerifyOTP(BaseModel):

    email:str

    otp:str


class ResetPassword(BaseModel):

    email:str

    new_password:str