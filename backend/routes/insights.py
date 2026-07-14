from fastapi import APIRouter, Query
from database import transactions_collection

router = APIRouter(
    prefix="/insights",
    tags=["💡 Insights"]
)


# ======================================================
# Dashboard Insights
# ======================================================

@router.get("/{user_email}")
def get_insights(
    user_email: str,
    month: str = Query(None)
):

    transactions = list(
        transactions_collection.find(
            {"user_email": user_email}
        )
    )

    # ---------------------------------------
    # Filter by Month (YYYY-MM)
    # ---------------------------------------

    if month:

        transactions = [

            t for t in transactions

            if t.get("date", "").startswith(month)

        ]

    total_income = 0
    total_expense = 0

    category_summary = {}
    monthly_summary = {}

    income_categories = [
        "salary",
        "bonus",
        "investment",
        "freelance"
    ]

    for transaction in transactions:

        amount = float(transaction.get("amount", 0))

        category = transaction.get(
            "category",
            "Unknown"
        ).lower()

        date = transaction.get("date", "")

        month_name = date[:7]

        # Income
        if category in income_categories:

            total_income += amount

        # Expense
        else:

            total_expense += amount

            monthly_summary[month_name] = (

                monthly_summary.get(month_name, 0)

                + amount

            )

        # Category Summary
        category_summary[category] = (

            category_summary.get(category, 0)

            + amount

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

        "category_summary": category_summary,

        "monthly_summary": monthly_summary

    }


# ======================================================
# Monthly Insights
# ======================================================

@router.get("/monthly/{user_email}")
def monthly_insights(
    user_email: str,
    month: str = Query(None)
):

    return get_insights(user_email, month)