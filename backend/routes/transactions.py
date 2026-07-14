from fastapi import APIRouter, Query
from bson import ObjectId

from database import transactions_collection
from models.schemas import Transaction, UpdateTransaction
from services.prediction_service import predict_category

router = APIRouter(
    prefix="/transactions",
    tags=["💰 Transactions"]
)

# ==========================================
# Add Transaction
# ==========================================

@router.post("/")
def add_transaction(transaction: Transaction):

    category = predict_category(
        transaction.notes,
        transaction.payment_mode,
        transaction.location
    )

    data = {

        "user_email": transaction.user_email,
        "notes": transaction.notes,
        "payment_mode": transaction.payment_mode,
        "location": transaction.location,
        "amount": transaction.amount,
        "date": transaction.date,
        "category": category

    }

    result = transactions_collection.insert_one(data)

    return {

        "message": "Transaction Saved",
        "id": str(result.inserted_id),
        "category": category

    }


# ==========================================
# Get All Transactions of a User
# (Supports Monthly Filter)
# ==========================================

@router.get("/user/{user_email}")
def get_transactions(
    user_email: str,
    month: str = Query(None)
):

    transactions = []

    query = {

        "user_email": user_email

    }

    # Get all transactions of the user
    for transaction in transactions_collection.find(query).sort("date", -1):

        # Apply month filter if selected
        if month:

            if not transaction.get("date", "").startswith(month):

                continue

        transaction["_id"] = str(transaction["_id"])

        transactions.append(transaction)

    return transactions


# ==========================================
# Get Single Transaction
# ==========================================

@router.get("/{transaction_id}")
def get_transaction(transaction_id: str):

    transaction = transactions_collection.find_one(

        {"_id": ObjectId(transaction_id)}

    )

    if transaction:

        transaction["_id"] = str(transaction["_id"])

        return transaction

    return {

        "message": "Transaction Not Found"

    }


# ==========================================
# Update Transaction
# ==========================================

@router.put("/{transaction_id}")
def update_transaction(
    transaction_id: str,
    transaction: UpdateTransaction
):

    update_data = {}

    for key, value in transaction.model_dump().items():

        if value is not None:

            update_data[key] = value

    if update_data:

        transactions_collection.update_one(

            {"_id": ObjectId(transaction_id)},

            {"$set": update_data}

        )

    return {

        "message": "Transaction Updated"

    }


# ==========================================
# Delete Transaction
# ==========================================

@router.delete("/{transaction_id}")
def delete_transaction(transaction_id: str):

    transactions_collection.delete_one(

        {"_id": ObjectId(transaction_id)}

    )

    return {

        "message": "Transaction Deleted"

    }