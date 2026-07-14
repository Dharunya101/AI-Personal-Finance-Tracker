from fastapi import APIRouter, Query
from database import transactions_collection, budgets_collection

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

    budgets = list(
        budgets_collection.find({}, {"_id": 0})
    )

    # ==========================================
    # Month Filter (Optional)
    # ==========================================

    if month:

        transactions = [

            t for t in transactions

            if t.get("date", "").startswith(month)

        ]

    income_categories = [
        "salary",
        "bonus",
        "investment",
        "freelance"
    ]

    # ==========================================
    # Dictionaries
    # ==========================================

    category_summary = {}

    monthly_summary = {}

    monthly_category_summary = {}

    expense_values = []

    # Budget vs Expense
    budget_vs_expense = {}

    # Initialize budgets

    for budget in budgets:

        category = budget["category"].lower()

        budget_vs_expense[category] = {

            "budget": float(budget["monthly_budget"]),

            "expense": 0

        }

    # ==========================================
    # Process Transactions
    # ==========================================

    for transaction in transactions:

        amount = float(transaction.get("amount", 0))

        category = transaction.get("category", "unknown").lower()

        date = transaction.get("date", "")

        month_name = date[:7]

        if category not in income_categories:

            expense_values.append(amount)

            # -----------------------------
            # Category Summary
            # -----------------------------

            category_summary[category] = (

                category_summary.get(category, 0)

                + amount

            )

            # -----------------------------
            # Monthly Summary
            # -----------------------------

            monthly_summary[month_name] = (

                monthly_summary.get(month_name, 0)

                + amount

            )

            # -----------------------------
            # Month-wise Category Summary
            # -----------------------------

            if month_name not in monthly_category_summary:

                monthly_category_summary[month_name] = {}

            monthly_category_summary[month_name][category] = (

                monthly_category_summary[month_name].get(category, 0)

                + amount

            )

            # -----------------------------
            # Budget vs Expense
            # -----------------------------

            if category not in budget_vs_expense:

                budget_vs_expense[category] = {

                    "budget": 0,

                    "expense": amount

                }

            else:

                budget_vs_expense[category]["expense"] += amount

    monthly_summary = dict(sorted(monthly_summary.items()))

    monthly_category_summary = dict(
        sorted(monthly_category_summary.items())
    )

    return {

        "category_summary": category_summary,

        "monthly_summary": monthly_summary,

        "monthly_category_summary": monthly_category_summary,

        "budget_vs_expense": budget_vs_expense,

        "expense_values": expense_values

    }