from fastapi import APIRouter

router = APIRouter(
    prefix="/settings",
    tags=["⚙️ Settings"]
)


@router.get("/")
def settings():

    return {

        "Currency": "INR",

        "Monthly Budget": 30000,

        "Theme": "Light"

    }


@router.put("/")
def update_settings():

    return {

        "message": "Settings updated."

    }