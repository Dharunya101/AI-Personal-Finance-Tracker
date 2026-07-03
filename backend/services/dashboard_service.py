from database import transactions_collection

income_categories = [
    "salary",
    "bonus",
    "investment",
    "freelance"
]

def dashboard_summary():

    transactions = list(transactions_collection.find())

    total_income = 0
    total_expense = 0

    for t in transactions:

        amount = float(t.get("amount", 0))
        category = t.get("category", "").lower()

        if category in income_categories:
            total_income += amount
        else:
            total_expense += amount

    savings = total_income - total_expense

    budget_remaining = 50000 - total_expense

    return {
        "total_transactions": len(transactions),
        "total_income": total_income,
        "total_expense": total_expense,
        "savings": savings,
        "budget_remaining": budget_remaining
    }