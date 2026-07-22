from fastapi import APIRouter
from models.schemas import User, LoginUser
from database import users_collection

import re
import os
import random
import smtplib
from email.mime.text import MIMEText
from datetime import datetime, timedelta

from dotenv import load_dotenv

load_dotenv()

EMAIL_ADDRESS = os.getenv("EMAIL_ADDRESS")
EMAIL_PASSWORD = os.getenv("EMAIL_PASSWORD")

router = APIRouter(
    prefix="/auth",
    tags=["🔐 Authentication"]
)

# ==========================================
# OTP Storage (Temporary)
# ==========================================

otp_storage = {}

# ==========================================
# SIGN UP
# ==========================================

@router.post("/signup")
def signup(user: User):

    password_pattern = r"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.#]).{8,}$"

    if not re.match(password_pattern, user.password):
        return {
            "message":
            "Password must contain at least 8 characters, one uppercase, one lowercase, one number and one special character."
        }

    existing = users_collection.find_one(
        {"email": user.email}
    )

    if existing:
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


# ==========================================
# LOGIN
# ==========================================

@router.post("/login")
def login(user: LoginUser):

    existing = users_collection.find_one(
        {"email": user.email}
    )

    if not existing:
        return {
            "message": "Email not registered."
        }

    if existing["password"] != user.password:
        return {
            "message": "Incorrect password."
        }

    return {
        "message": "Login successful."
    }


# ==========================================
# SEND OTP
# ==========================================

@router.post("/forgot-password/{email}")
def forgot_password(email: str):

    user = users_collection.find_one(
        {"email": email}
    )

    if not user:
        return {
            "message": "Email not registered."
        }

    otp = str(random.randint(100000,999999))

    expiry = datetime.now() + timedelta(minutes=5)

    otp_storage[email] = {

        "otp": otp,

        "expiry": expiry

    }

    try:

        msg = MIMEText(
            f"""
Hello,

Your OTP for resetting your Finance Tracker password is:

{otp}

This OTP is valid for only 5 minutes.

If you didn't request this, please ignore this email.

Finance Tracker Team
"""
        )

        msg["Subject"] = "Finance Tracker Password Reset OTP"

        msg["From"] = EMAIL_ADDRESS

        msg["To"] = email

        server = smtplib.SMTP("smtp.gmail.com",587)

        server.starttls()

        server.login(
            EMAIL_ADDRESS,
            EMAIL_PASSWORD
        )

        server.send_message(msg)

        server.quit()

    except Exception as e:

        return {

            "message":"Unable to send email",

            "error":str(e)

        }

    return {

        "message":"OTP sent successfully."

    }


# ==========================================
# VERIFY OTP
# ==========================================

@router.post("/verify-otp/{email}/{otp}")
def verify_otp(email:str,otp:str):

    if email not in otp_storage:

        return {

            "message":"OTP not found."

        }

    stored = otp_storage[email]

    if datetime.now() > stored["expiry"]:

        del otp_storage[email]

        return {

            "message":"OTP expired."

        }

    if stored["otp"] != otp:

        return {

            "message":"Invalid OTP."

        }

    return {

        "message":"OTP verified."

    }


# ==========================================
# RESET PASSWORD
# ==========================================

@router.post("/reset-password/{email}/{otp}/{new_password}")
def reset_password(
    email:str,
    otp:str,
    new_password:str
):

    if email not in otp_storage:

        return {

            "message":"OTP not found."

        }

    stored = otp_storage[email]

    if datetime.now() > stored["expiry"]:

        del otp_storage[email]

        return {

            "message":"OTP expired."

        }

    if stored["otp"] != otp:

        return {

            "message":"Invalid OTP."

        }

    password_pattern = r"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.#]).{8,}$"

    if not re.match(password_pattern,new_password):

        return {

            "message":
            "Password does not satisfy policy."

        }

    users_collection.update_one(

        {

            "email":email

        },

        {

            "$set":{

                "password":new_password

            }

        }

    )

    del otp_storage[email]

    return {

        "message":"Password updated successfully."

    }


# ==========================================
# LOGOUT
# ==========================================

@router.post("/logout")
def logout():

    return {

        "message":"Logged out successfully."

    }