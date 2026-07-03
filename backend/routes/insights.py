from fastapi import APIRouter
from database import transactions_collection

router = APIRouter(
    prefix="/insights",
    tags=["💡 Insights"]
)


@router.get("/")
def get_insights():

    transactions = list(transactions_collection.find())

    total_expense = 0
    total_income = 0
    category_summary = {}

    for transaction in transactions:

        amount = float(transaction["amount"])

        category = transaction["category"]

        if category.lower() == "salary":
            total_income += amount
        else:
            total_expense += amount

        category_summary[category] = category_summary.get(category, 0) + amount

    savings = total_income - total_expense

    highest_category = ""

    if category_summary:
        highest_category = max(
            category_summary,
            key=category_summary.get
        )

    return {

        "total_income": total_income,

        "total_expense": total_expense,

        "savings": savings,

        "highest_category": highest_category,

        "total_transactions": len(transactions),

        "category_summary": category_summary

    }
@router.get("/monthly")
def monthly_insights():
    return get_insights()