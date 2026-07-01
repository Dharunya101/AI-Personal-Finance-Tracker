from fastapi import APIRouter

from models.schemas import Transaction
from services.prediction_service import predict_category

router = APIRouter(
    prefix="/categorization",
    tags=["🤖 Expense Categorization"]
)
@router.post("/predict")
def predict(transaction: Transaction):

    category = predict_category(
        transaction.notes,
        transaction.payment_mode,
        transaction.location
    )

    return {
        "Predicted Category": category
    }
@router.get("/model-info")
def model_info():

    return {

        "Model": "LinearSVC",

        "Training Dataset": "BudgetWise Personal Finance Dataset",

        "Status": "Loaded",

        "Version": "1.0"

    }
@router.get("/categories")
def categories():

    return {

        "Supported Categories": [

            "food",

            "travel",

            "rent",

            "utilities",

            "health",

            "education",

            "entertainment",

            "salary",

            "bonus",

            "investment",

            "freelance",

            "savings",

            "others"

        ]

    }