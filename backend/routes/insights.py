from fastapi import APIRouter

from database import transactions_collection

router = APIRouter(
    prefix="/insights",
    tags=["💡 Insights"]
)


@router.get("/{user_email}")
def get_insights(user_email: str):

    transactions = list(
        transactions_collection.find(
            {"user_email": user_email}
        )
    )

    total_expense = 0
    total_income = 0

    category_summary = {}

    income_categories = [
        "salary",
        "bonus",
        "investment",
        "freelance"
    ]

    for transaction in transactions:

        amount = float(transaction.get("amount", 0))

        category = transaction.get("category", "Unknown")

        if category.lower() in income_categories:

            total_income += amount

        else:

            total_expense += amount

        category_summary[category] = (
            category_summary.get(category, 0) + amount
        )

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


@router.get("/monthly/{user_email}")
def monthly_insights(user_email: str):

    return get_insights(user_email)