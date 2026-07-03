from fastapi import APIRouter
from database import transactions_collection

router = APIRouter(
    prefix="/analytics",
    tags=["📊 Analytics"]
)


@router.get("/category-summary")
def category_summary():

    summary = {}

    for transaction in transactions_collection.find():

        category = transaction.get("category", "Unknown")

        amount = float(transaction.get("amount", 0))

        summary[category] = summary.get(category, 0) + amount

    return summary


@router.get("/payment-mode")
def payment_mode():

    summary = {}

    for transaction in transactions_collection.find():

        mode = transaction.get("payment_mode", "Unknown")

        summary[mode] = summary.get(mode, 0) + 1

    return summary


@router.get("/location")
def location():

    summary = {}

    for transaction in transactions_collection.find():

        location = transaction.get("location", "Unknown")

        summary[location] = summary.get(location, 0) + 1

    return summary


@router.get("/income-vs-expense")
def income_vs_expense():

    income_categories = [
        "salary",
        "bonus",
        "investment",
        "freelance"
    ]

    income = 0
    expense = 0

    for transaction in transactions_collection.find():

        category = transaction.get("category", "").lower()

        amount = float(transaction.get("amount", 0))

        if category in income_categories:
            income += amount
        else:
            expense += amount

    return {
        "Income": income,
        "Expense": expense
    }


@router.get("/top-categories")
def top_categories():

    summary = {}

    for transaction in transactions_collection.find():

        category = transaction.get("category", "Unknown")

        amount = float(transaction.get("amount", 0))

        summary[category] = summary.get(category, 0) + amount

    sorted_summary = dict(
        sorted(summary.items(), key=lambda x: x[1], reverse=True)
    )

    return sorted_summary