from fastapi import APIRouter

router = APIRouter(
    prefix="/admin",
    tags=["Admin"]
)

@router.get("/")
def admin():

    return {
        "message":"Admin Dashboard"
    }

@router.get("/users")
def users():

    return {
        "message":"Manage Users"
    }

@router.get("/activity")
def activity():

    return {
        "message":"Recent Activity"
    }