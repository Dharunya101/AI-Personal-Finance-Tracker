from fastapi import APIRouter
from models.schemas import User, LoginUser
from database import users_collection

print("AUTH ROUTE LOADED")

router = APIRouter(
    prefix="/auth",
    tags=["🔐 Authentication"]
)
@router.post("/signup")
def signup(user: User):

    existing_user = users_collection.find_one(
        {"email": user.email}
    )

    if existing_user:

        return {
            "message": "Email already registered."
        }

    users_collection.insert_one({

        "name": user.name,

        "email": user.email,

        "password": user.password

    })

    return {

        "message": "Account created successfully."

    }


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


@router.post("/logout")
def logout():

    return {
        "message": "Logged out successfully."
    }


@router.post("/forgot-password")
def forgot_password():

    return {
        "message": "Password reset link sent."
    }


@router.post("/reset-password")
def reset_password():

    return {
        "message": "Password updated successfully."
    }