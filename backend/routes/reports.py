from fastapi import APIRouter
from database import transactions_collection

from fastapi.responses import StreamingResponse
import pandas as pd
import io

from reportlab.platypus import SimpleDocTemplate
from reportlab.platypus import Table
from reportlab.platypus import TableStyle
from reportlab.lib import colors
import io

router = APIRouter(
    prefix="/reports",
    tags=["📄 Reports"]
)

@router.get("/")
def financial_report():

    transactions = list(
        transactions_collection.find({}, {"_id":0})
    )

    total_income = 0
    total_expense = 0

    category_summary = {}

    for transaction in transactions:

        amount = float(transaction["amount"])

        category = transaction["category"]

        if category.lower() == "salary":
            total_income += amount
        else:
            total_expense += amount

        category_summary[category] = (
            category_summary.get(category, 0) + amount
        )

    return {

        "total_income": total_income,

        "total_expense": total_expense,

        "savings": total_income-total_expense,

        "transactions": transactions,

        "category_summary": category_summary

    }
@router.get("/download/csv")
def download_csv():

    transactions = list(
        transactions_collection.find({}, {"_id": 0})
    )

    df = pd.DataFrame(transactions)

    stream = io.StringIO()

    df.to_csv(stream, index=False)

    response = StreamingResponse(
        iter([stream.getvalue()]),
        media_type="text/csv"
    )

    response.headers["Content-Disposition"] = \
        "attachment; filename=finance_report.csv"

    return response

@router.get("/download/pdf")
def download_pdf():

    transactions = list(
        transactions_collection.find({}, {"_id": 0})
    )

    buffer = io.BytesIO()

    pdf = SimpleDocTemplate(buffer)

    data = [["Date", "Category", "Amount", "Location"]]

    for t in transactions:

        data.append([
            t["date"],
            t["category"],
            str(t["amount"]),
            t["location"]
        ])

    table = Table(data)

    table.setStyle(TableStyle([
        ("BACKGROUND", (0,0), (-1,0), colors.grey),
        ("TEXTCOLOR", (0,0), (-1,0), colors.whitesmoke),
        ("GRID", (0,0), (-1,-1), 1, colors.black),
        ("BACKGROUND", (0,1), (-1,-1), colors.beige)
    ]))

    pdf.build([table])

    buffer.seek(0)

    return StreamingResponse(
        buffer,
        media_type="application/pdf",
        headers={
            "Content-Disposition":
            "attachment; filename=finance_report.pdf"
        }
    )