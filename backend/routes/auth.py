from fastapi import APIRouter

router = APIRouter(
    prefix="/auth",
    tags=["🔐 Authentication"]
)


@router.post("/signup")
def signup():

    return {
        "message": "User registered successfully."
    }


@router.post("/login")
def login():

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