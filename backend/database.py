from pymongo import MongoClient
from dotenv import load_dotenv
import os

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")
DATABASE_NAME = os.getenv("DATABASE_NAME")

client = MongoClient(MONGO_URI)

db = client[DATABASE_NAME]

transactions_collection = db["transactions"]
budgets_collection = db["budget"]
users_collection = db["user"]
password_reset_collection = db["password_reset"]