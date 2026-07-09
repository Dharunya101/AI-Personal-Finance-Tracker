from fastapi import APIRouter

from database import transactions_collection
from services.dashboard_service import dashboard_summary

router = APIRouter(
    prefix="/dashboard",
    tags=["📊 Dashboard"]
)

# ==============================
# Dashboard Overview
# ==============================

@router.get("/overview/{user_email}")
def overview(user_email: str):

    return dashboard_summary(user_email)


# ==============================
# Category Summary
# ==============================

income_categories = [
    "salary",
    "bonus",
    "investment",
    "freelance"
]

@router.get("/category-summary/{user_email}")
def category_summary(user_email: str):

    summary = {}

    transactions = transactions_collection.find(
        {"user_email": user_email}
    )

    for t in transactions:

        category = t.get("category", "Unknown").lower()

        if category in income_categories:
            continue

        amount = float(t.get("amount", 0))

        summary[category] = summary.get(category, 0) + amount

    return summary


# ==============================
# Monthly Summary
# ==============================

@router.get("/monthly-summary/{user_email}")
def monthly_summary(user_email: str):

    summary = {}

    transactions = transactions_collection.find(
        {"user_email": user_email}
    )

    for t in transactions:

        month = t["date"][:7]

        summary[month] = summary.get(
            month,
            0
        ) + float(t["amount"])

    return dict(sorted(summary.items()))


# ==============================
# Recent Transactions
# ==============================

@router.get("/recent-transactions/{user_email}")
def recent_transactions(user_email: str):

    transactions = []

    cursor = transactions_collection.find(
        {"user_email": user_email}
    ).sort("date", -1).limit(10)

    for t in cursor:

        t["_id"] = str(t["_id"])

        transactions.append(t)

    return transactions