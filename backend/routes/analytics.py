from fastapi import APIRouter, Query
from database import transactions_collection

router = APIRouter(
    prefix="/analytics",
    tags=["📊 Analytics"]
)


@router.get("/category-summary/{user_email}")
def category_summary(
    user_email: str,
    month: str = Query(None)
):

    transactions = list(
        transactions_collection.find(
            {"user_email": user_email}
        )
    )

    # ============================
    # Monthly Filter
    # ============================

    if month:

        transactions = [

            t for t in transactions

            if t.get("date", "").startswith(month)

        ]

    category_summary = {}
    monthly_summary = {}
    expense_values = []

    income_categories = [
        "salary",
        "bonus",
        "investment",
        "freelance"
    ]

    for transaction in transactions:

        amount = float(transaction["amount"])

        category = transaction["category"].lower()

        date = transaction["date"]

        month_name = date[:7]

        if category not in income_categories:

            expense_values.append(amount)

            category_summary[category] = (

                category_summary.get(category, 0)

                + amount

            )

            monthly_summary[month_name] = (

                monthly_summary.get(month_name, 0)

                + amount

            )

    monthly_summary = dict(sorted(monthly_summary.items()))

    return {

        "category_summary": category_summary,

        "monthly_summary": monthly_summary,

        "expense_values": expense_values

    }