from database import budgets_collection


def create_budget(category, limit):

    budgets_collection.insert_one({

        "category": category,

        "limit": limit

    })


def get_all_budgets():

    budgets = []

    for budget in budgets_collection.find({}, {"_id":0}):

        budgets.append(budget)

    return budgets