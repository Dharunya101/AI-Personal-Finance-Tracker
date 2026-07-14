from fastapi import APIRouter

from database import budgets_collection, transactions_collection
from models.schemas import Budget

router = APIRouter(
    prefix="/budgets",
    tags=["💰 Budget Management"]
)

# ======================================================
# Create Budget
# ======================================================

@router.post("/")
def create_budget(budget: Budget):

    budgets_collection.insert_one({

        "category": budget.category,

        "monthly_budget": budget.monthly_budget

    })

    return {

        "message": "Budget Created Successfully"

    }


# ======================================================
# Get All Budgets
# ======================================================

@router.get("/")
def get_budgets():

    budgets = []

    for budget in budgets_collection.find({}, {"_id": 0}):

        budgets.append(budget)

    return budgets


# ======================================================
# Update Budget
# ======================================================

@router.put("/{category}")
def update_budget(category: str, budget: Budget):

    budgets_collection.update_one(

        {"category": category},

        {

            "$set": {

                "monthly_budget": budget.monthly_budget

            }

        }

    )

    return {

        "message": "Budget Updated"

    }


# ======================================================
# Delete Budget
# ======================================================

@router.delete("/{category}")
def delete_budget(category: str):

    budgets_collection.delete_one(

        {

            "category": category

        }

    )

    return {

        "message": "Budget Deleted"

    }


# ======================================================
# Budget Status
# ======================================================

@router.get("/status/{user_email}")
def budget_status(user_email: str):

    result = []

    budgets = list(

        budgets_collection.find({}, {"_id": 0})

    )

    transactions = list(

        transactions_collection.find(

            {

                "user_email": user_email

            }

        )

    )

    for budget in budgets:

        spent = 0

        for transaction in transactions:

            if transaction.get("category") == budget["category"]:

                spent += float(transaction.get("amount", 0))

        result.append({

            "category": budget["category"],

            "budget": budget["monthly_budget"],

            "spent": spent,

            "remaining": budget["monthly_budget"] - spent

        })

    return result


# ======================================================
# Budget Alerts
# ======================================================

@router.get("/alerts/{user_email}")
def budget_alerts(user_email: str):

    alerts = []

    budgets = list(

        budgets_collection.find({}, {"_id": 0})

    )

    transactions = list(

        transactions_collection.find(

            {

                "user_email": user_email

            }

        )

    )

    for budget in budgets:

        spent = 0

        for transaction in transactions:

            if transaction.get("category") == budget["category"]:

                spent += float(transaction.get("amount", 0))

        if spent > budget["monthly_budget"]:

            alerts.append({

                "category": budget["category"],

                "message": "Budget Exceeded"

            })

    return alerts