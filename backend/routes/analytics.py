from fastapi import APIRouter

from database import transactions_collection

router = APIRouter(
    prefix="/analytics",
    tags=["📊 Analytics"]
)


# ===============================
# Category Summary
# ===============================

@router.get("/category-summary/{user_email}")
def category_summary(user_email: str):

    summary = {}

    transactions = transactions_collection.find(
        {"user_email": user_email}
    )

    for transaction in transactions:

        category = transaction.get("category", "Unknown")

        amount = float(transaction.get("amount", 0))

        summary[category] = summary.get(category, 0) + amount

    return summary


# ===============================
# Payment Mode
# ===============================

@router.get("/payment-mode/{user_email}")
def payment_mode(user_email: str):

    summary = {}

    transactions = transactions_collection.find(
        {"user_email": user_email}
    )

    for transaction in transactions:

        mode = transaction.get("payment_mode", "Unknown")

        summary[mode] = summary.get(mode, 0) + 1

    return summary


# ===============================
# Location Summary
# ===============================

@router.get("/location/{user_email}")
def location(user_email: str):

    summary = {}

    transactions = transactions_collection.find(
        {"user_email": user_email}
    )

    for transaction in transactions:

        loc = transaction.get("location", "Unknown")

        summary[loc] = summary.get(loc, 0) + 1

    return summary


# ===============================
# Income vs Expense
# ===============================

income_categories = [
    "salary",
    "bonus",
    "investment",
    "freelance"
]

@router.get("/income-vs-expense/{user_email}")
def income_vs_expense(user_email: str):

    income = 0
    expense = 0

    transactions = transactions_collection.find(
        {"user_email": user_email}
    )

    for transaction in transactions:

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


# ===============================
# Top Categories
# ===============================

@router.get("/top-categories/{user_email}")
def top_categories(user_email: str):

    summary = {}

    transactions = transactions_collection.find(
        {"user_email": user_email}
    )

    for transaction in transactions:

        category = transaction.get("category", "Unknown")

        amount = float(transaction.get("amount", 0))

        summary[category] = summary.get(category, 0) + amount

    sorted_summary = dict(
        sorted(
            summary.items(),
            key=lambda x: x[1],
            reverse=True
        )
    )

    return sorted_summary