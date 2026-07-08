from pydantic import BaseModel
from typing import Optional

class Transaction(BaseModel):
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

class Budget(BaseModel):

    category: str

    limit: float

from pydantic import BaseModel

class Budget(BaseModel):
    category: str
    monthly_budget: float

from pydantic import BaseModel, EmailStr

class User(BaseModel):
    name: str
    email: EmailStr
    password: str

class LoginUser(BaseModel):

    email: str

    password: str