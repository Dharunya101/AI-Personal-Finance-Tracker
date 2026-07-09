from fastapi import APIRouter
from database import transactions_collection

from fastapi.responses import StreamingResponse
import pandas as pd
import io

from reportlab.platypus import SimpleDocTemplate
from reportlab.platypus import Table
from reportlab.platypus import TableStyle
from reportlab.lib import colors

router = APIRouter(
    prefix="/reports",
    tags=["📄 Reports"]
)


# ==========================
# Financial Report
# ==========================

@router.get("/{user_email}")
def financial_report(user_email: str):

    transactions = list(
        transactions_collection.find(
            {"user_email": user_email},
            {"_id": 0}
        )
    )

    total_income = 0
    total_expense = 0

    category_summary = {}

    income_categories = [
        "salary",
        "bonus",
        "investment",
        "freelance"
    ]

    for transaction in transactions:

        amount = float(transaction.get("amount", 0))

        category = transaction.get("category", "Unknown")

        if category.lower() in income_categories:

            total_income += amount

        else:

            total_expense += amount

        category_summary[category] = (
            category_summary.get(category, 0) + amount
        )

    return {

        "total_income": total_income,

        "total_expense": total_expense,

        "savings": total_income - total_expense,

        "transactions": transactions,

        "category_summary": category_summary

    }


# ==========================
# Download CSV
# ==========================

@router.get("/download/csv/{user_email}")
def download_csv(user_email: str):

    transactions = list(
        transactions_collection.find(
            {"user_email": user_email},
            {"_id": 0}
        )
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


# ==========================
# Download PDF
# ==========================

@router.get("/download/pdf/{user_email}")
def download_pdf(user_email: str):

    transactions = list(
        transactions_collection.find(
            {"user_email": user_email},
            {"_id": 0}
        )
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
        ("BACKGROUND", (0, 0), (-1, 0), colors.grey),
        ("TEXTCOLOR", (0, 0), (-1, 0), colors.whitesmoke),
        ("GRID", (0, 0), (-1, -1), 1, colors.black),
        ("BACKGROUND", (0, 1), (-1, -1), colors.beige)
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