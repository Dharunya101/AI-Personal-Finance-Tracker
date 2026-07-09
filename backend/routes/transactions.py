from fastapi import APIRouter
from bson import ObjectId

from database import transactions_collection
from models.schemas import Transaction, UpdateTransaction
from services.prediction_service import predict_category

router = APIRouter(
    prefix="/transactions",
    tags=["💰 Transactions"]
)
@router.post("/")
def add_transaction(transaction: Transaction):

    print("Step 1")

    category = predict_category(
        transaction.notes,
        transaction.payment_mode,
        transaction.location
    )

    print("Step 2")

    data = {

    "user_email": transaction.user_email,

    "notes": transaction.notes,

    "payment_mode": transaction.payment_mode,

    "location": transaction.location,

    "amount": transaction.amount,

    "date": transaction.date,

    "category": category

}

    print("Step 3")

    result = transactions_collection.insert_one(data)

    print("Step 4")

    return {
        "message": "Transaction Saved",
        "id": str(result.inserted_id),
        "category": category
    }

@router.get("/{user_email}")
def get_transactions(user_email: str):

    transactions = []

    for transaction in transactions_collection.find(
        {"user_email": user_email}
    ):

        transaction["_id"] = str(transaction["_id"])

        transactions.append(transaction)

    return transactions

@router.get("/{transaction_id}")
def get_transaction(transaction_id: str):

    transaction = transactions_collection.find_one(
        {"_id": ObjectId(transaction_id)}
    )

    if transaction:

        transaction["_id"] = str(transaction["_id"])

        return transaction

    return {"message": "Transaction Not Found"}
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
@router.delete("/{transaction_id}")
def delete_transaction(transaction_id: str):

    transactions_collection.delete_one(
        {"_id": ObjectId(transaction_id)}
    )

    return {
        "message": "Transaction Deleted"
    }