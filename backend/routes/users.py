from fastapi import APIRouter
from bson import ObjectId

from database import users_collection
from models.schemas import UpdateUser, ChangePassword

router = APIRouter(
    prefix="/users",
    tags=["👤 User Management"]
)

# ==========================================
# Get User Details
# ==========================================

@router.get("/{email}")
def get_user(email: str):

    user = users_collection.find_one(

        {

            "email": email

        }

    )

    if not user:

        return {

            "message": "User not found"

        }

    return {

        "name": user["name"],

        "email": user["email"]

    }


# ==========================================
# Update Profile
# ==========================================

@router.put("/update")
def update_profile(user: UpdateUser):

    result = users_collection.update_one(

        {

            "email": user.email

        },

        {

            "$set": {

                "name": user.name

            }

        }

    )

    if result.modified_count > 0:

        return {

            "message": "Profile Updated Successfully"

        }

    return {

        "message": "No Changes Made"

    }


# ==========================================
# Change Password
# ==========================================

@router.post("/change-password")
def change_password(data: ChangePassword):

    user = users_collection.find_one(

        {

            "email": data.email

        }

    )

    if not user:

        return {

            "message": "User not found"

        }

    if user["password"] != data.current_password:

        return {

            "message": "Current Password Incorrect"

        }

    users_collection.update_one(

        {

            "email": data.email

        },

        {

            "$set": {

                "password": data.new_password

            }

        }

    )

    return {

        "message": "Password Updated Successfully"

    }


# ==========================================
# Delete User
# ==========================================

@router.delete("/{email}")
def delete_user(email: str):

    result = users_collection.delete_one(

        {

            "email": email

        }

    )

    if result.deleted_count > 0:

        return {

            "message": "User Deleted"

        }

    return {

        "message": "User Not Found"

    }