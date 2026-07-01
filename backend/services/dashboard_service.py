from database import transactions_collection


income_categories=[

    "salary",

    "bonus",

    "investment",

    "freelance"

]


def dashboard_summary():

    transactions=list(

        transactions_collection.find()

    )

    income=0

    expense=0

    for t in transactions:

        amount=float(

            t.get("amount",0)

        )

        category=t.get(

            "category",""

        )

        if category in income_categories:

            income+=amount

        else:

            expense+=amount

    return{

        "Total Transactions":len(transactions),

        "Total Income":income,

        "Total Expense":expense,

        "Balance":income-expense

    }