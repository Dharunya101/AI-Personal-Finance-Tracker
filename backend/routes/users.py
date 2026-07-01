from fastapi import APIRouter

router = APIRouter(
    prefix="/users",
    tags=["👤 User Management"]
)


@router.get("/")
def get_users():

    return {
        "message": "List of users."
    }


@router.get("/{user_id}")
def get_user(user_id: int):

    return {
        "user_id": user_id,
        "message": "User details."
    }


@router.put("/{user_id}")
def update_user(user_id: int):

    return {
        "user_id": user_id,
        "message": "User updated."
    }


@router.delete("/{user_id}")
def delete_user(user_id: int):

    return {
        "user_id": user_id,
        "message": "User deleted."
    }