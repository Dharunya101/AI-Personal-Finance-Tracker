from fastapi import APIRouter

from database import transactions_collection

from services.dashboard_service import dashboard_summary

router=APIRouter(

    prefix="/dashboard",

    tags=["📊 Dashboard"]

)
@router.get("/overview")
def overview():

    return dashboard_summary()
@router.get("/category-summary")
def category_summary():

    summary={}

    for t in transactions_collection.find():

        category=t["category"]

        amount=float(

            t["amount"]

        )

        summary[category]=summary.get(

            category,0

        )+amount

    return summary
@router.get("/monthly-summary")
def monthly_summary():

    summary={}

    for t in transactions_collection.find():

        month=t["date"][:7]

        summary[month]=summary.get(

            month,0

        )+float(t["amount"])

    return summary
@router.get("/recent-transactions")
def recent_transactions():

    transactions=[]

    for t in transactions_collection.find().sort(

        "date",-1

    ).limit(10):

        t["_id"]=str(

            t["_id"]

        )

        transactions.append(t)

    return transactions