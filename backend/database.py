from pymongo import MongoClient

client = MongoClient("mongodb://localhost:27017")

db = client["finance_tracker"]
budgets_collection = db["budgets"]

transactions_collection = db["transactions"]