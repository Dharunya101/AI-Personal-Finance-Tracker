from fastapi import APIRouter
from models.schemas import User, LoginUser
from database import users_collection
import re

print("AUTH ROUTE LOADED")

router = APIRouter(
    prefix="/auth",
    tags=["🔐 Authentication"]
)

# ==========================================
# SIGN UP
# ==========================================

@router.post("/signup")
def signup(user: User):

    # Password Validation
    password_pattern = r"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.#]).{8,}$"

    if not re.match(password_pattern, user.password):
        return {
            "message": "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character."
        }

    # Check if email already exists
    existing_user = users_collection.find_one(
        {"email": user.email}
    )

    if existing_user:
        return {
            "message": "Email already registered."
        }

    # Save user
    users_collection.insert_one({

        "name": user.name,
        "email": user.email,
        "password": user.password

    })

    return {
        "message": "Account created successfully."
    }


# ==========================================
# LOGIN
# ==========================================

@router.post("/login")
def login(user: LoginUser):

    existing_user = users_collection.find_one({
        "email": user.email
    })

    if not existing_user:
        return {
            "message": "Email not registered."
        }

    if existing_user["password"] != user.password:
        return {
            "message": "Incorrect password."
        }

    return {
        "message": "Login successful."
    }


# ==========================================
# LOGOUT
# ==========================================

@router.post("/logout")
def logout():

    return {
        "message": "Logged out successfully."
    }


# ==========================================
# FORGOT PASSWORD
# ==========================================

@router.post("/forgot-password")
def forgot_password():

    return {
        "message": "Password reset link sent."
    }


# ==========================================
# RESET PASSWORD
# ==========================================

@router.post("/reset-password")
def reset_password():

    return {
        "message": "Password updated successfully."
    }