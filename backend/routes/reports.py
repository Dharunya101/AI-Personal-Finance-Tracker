from fastapi import APIRouter, Query
from fastapi.responses import StreamingResponse

from database import transactions_collection

import pandas as pd
import io

from collections import defaultdict
from datetime import datetime

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch

from reportlab.platypus import (
    SimpleDocTemplate,
    Table,
    TableStyle,
    Paragraph,
    Spacer
)

router = APIRouter(
    prefix="/reports",
    tags=["📄 Reports"]
)

# =====================================================
# Financial Report
# =====================================================

@router.get("/{user_email}")
def financial_report(
    user_email: str,
    month: str = Query(None)
):

    transactions = list(
        transactions_collection.find(
            {"user_email": user_email},
            {"_id": 0}
        )
    )

    # ---------------------------------------
    # Filter by Month
    # ---------------------------------------

    if month:

        transactions = [

            t for t in transactions

            if t.get("date", "").startswith(month)

        ]

    total_income = 0
    total_expense = 0

    category_summary = defaultdict(float)

    income_categories = [

        "salary",
        "bonus",
        "investment",
        "freelance"

    ]

    for transaction in transactions:

        amount = float(transaction.get("amount", 0))

        category = transaction.get(
            "category",
            "Unknown"
        )

        if category.lower() in income_categories:

            total_income += amount

        else:

            total_expense += amount

        category_summary[category] += amount

    savings = total_income - total_expense

    highest_category = ""

    highest_amount = 0

    for category, amount in category_summary.items():

        if amount > highest_amount:

            highest_amount = amount
            highest_category = category

    if total_income > 0:

        savings_rate = round(

            (savings / total_income) * 100,

            2

        )

    else:

        savings_rate = 0

    return {

        "total_income": total_income,

        "total_expense": total_expense,

        "savings": savings,

        "transactions": transactions,

        "category_summary": dict(category_summary),

        "total_transactions": len(transactions),

        "highest_category": highest_category,

        "highest_amount": highest_amount,

        "savings_rate": savings_rate

    }


# =====================================================
# Download CSV
# =====================================================

@router.get("/download/csv/{user_email}")
def download_csv(

    user_email: str,

    month: str = Query(None)

):

    transactions = list(

        transactions_collection.find(

            {"user_email": user_email},

            {"_id": 0}

        )

    )

    if month:

        transactions = [

            t for t in transactions

            if t.get("date", "").startswith(month)

        ]

    df = pd.DataFrame(transactions)

    stream = io.StringIO()

    df.to_csv(

        stream,

        index=False

    )

    stream.seek(0)

    filename = "finance_report.csv"

    if month:

        filename = f"Finance_Report_{month}.csv"

    response = StreamingResponse(

        iter([stream.getvalue()]),

        media_type="text/csv"

    )

    response.headers["Content-Disposition"] = (

        f'attachment; filename="{filename}"'

    )

    return response
# =====================================================
# Download Professional PDF
# =====================================================

@router.get("/download/pdf/{user_email}")
def download_pdf(

    user_email: str,

    month: str = Query(None)

):

    transactions = list(

        transactions_collection.find(

            {"user_email": user_email},

            {"_id": 0}

        )

    )

    # ------------------------------------------
    # Filter by Month
    # ------------------------------------------

    if month:

        transactions = [

            t for t in transactions

            if t.get("date", "").startswith(month)

        ]

    total_income = 0
    total_expense = 0

    category_summary = defaultdict(float)

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

        category_summary[category] += amount

    savings = total_income - total_expense

    buffer = io.BytesIO()

    pdf = SimpleDocTemplate(

        buffer,

        rightMargin=35,

        leftMargin=35,

        topMargin=35,

        bottomMargin=35

    )

    styles = getSampleStyleSheet()

    title_style = ParagraphStyle(

        "Title",

        parent=styles["Heading1"],

        alignment=TA_CENTER,

        fontSize=22,

        textColor=colors.HexColor("#1E3A8A"),

        spaceAfter=15

    )

    heading_style = ParagraphStyle(

        "Heading",

        parent=styles["Heading2"],

        textColor=colors.HexColor("#2563EB"),

        spaceAfter=10

    )

    normal_style = styles["BodyText"]

    elements = []

    # =====================================================
    # Report Title
    # =====================================================

    elements.append(

        Paragraph(

            "AI PERSONAL FINANCE TRACKER",

            title_style

        )

    )

    elements.append(

        Paragraph(

            "Monthly Financial Report",

            styles["Heading2"]

        )

    )

    elements.append(

        Spacer(1, 0.25 * inch)

    )

    # =====================================================
    # User Information
    # =====================================================

    elements.append(

        Paragraph(

            "User Information",

            heading_style

        )

    )

    user_table = Table([

        ["Email", user_email],

        ["Month", month if month else "All Months"],

        [

            "Generated On",

            datetime.now().strftime(

                "%d-%m-%Y %I:%M %p"

            )

        ]

    ])

    user_table.setStyle(

        TableStyle([

            ("BACKGROUND", (0,0), (0,-1), colors.HexColor("#DBEAFE")),

            ("GRID", (0,0), (-1,-1), 0.5, colors.grey),

            ("BOTTOMPADDING", (0,0), (-1,-1), 8),

            ("TOPPADDING", (0,0), (-1,-1), 8)

        ])

    )

    elements.append(user_table)

    elements.append(

        Spacer(1, 0.30 * inch)

    )

    # =====================================================
    # Financial Summary
    # =====================================================

    elements.append(

        Paragraph(

            "Financial Summary",

            heading_style

        )

    )

    summary_table = Table([

        ["Total Income",

         f"₹ {total_income:,.2f}"],

        ["Total Expense",

         f"₹ {total_expense:,.2f}"],

        ["Savings",

         f"₹ {savings:,.2f}"],

        ["Transactions",

         str(len(transactions))]

    ])

    summary_table.setStyle(

        TableStyle([

            ("BACKGROUND", (0,0), (-1,0), colors.HexColor("#2563EB")),

            ("TEXTCOLOR", (0,0), (-1,0), colors.white),

            ("GRID", (0,0), (-1,-1), 0.5, colors.grey),

            ("BACKGROUND", (0,1), (-1,-1), colors.whitesmoke),

            ("BOTTOMPADDING", (0,0), (-1,-1), 8),

            ("TOPPADDING", (0,0), (-1,-1), 8)

        ])

    )

    elements.append(summary_table)

    elements.append(

        Spacer(1, 0.30 * inch)

    )

    # =====================================================
    # Category Summary
    # =====================================================

    elements.append(

        Paragraph(

            "Expense Category Summary",

            heading_style

        )

    )

    category_data = [

        [

            "Category",

            "Amount"

        ]

    ]

    for category, amount in category_summary.items():

        category_data.append([

            category,

            f"₹ {amount:,.2f}"

        ])

    category_table = Table(category_data)

    category_table.setStyle(

        TableStyle([

            ("BACKGROUND",(0,0),(-1,0),colors.HexColor("#2563EB")),

            ("TEXTCOLOR",(0,0),(-1,0),colors.white),

            ("GRID",(0,0),(-1,-1),0.5,colors.grey),

            ("BACKGROUND",(0,1),(-1,-1),colors.beige),

            ("BOTTOMPADDING",(0,0),(-1,-1),8),

            ("TOPPADDING",(0,0),(-1,-1),8)

        ])

    )

    elements.append(category_table)

    elements.append(

        Spacer(1,0.30*inch)

    )
        # =====================================================
    # Transaction History
    # =====================================================

    elements.append(
        Paragraph(
            "Transaction History",
            heading_style
        )
    )

    transaction_data = [[
        "Date",
        "Description",
        "Category",
        "Payment",
        "Amount"
    ]]

    for t in transactions:

        transaction_data.append([

            t.get("date", ""),

            t.get("notes", "-"),

            t.get("category", "-"),

            t.get("payment_mode", "-"),

            f"₹ {float(t.get('amount',0)):,.2f}"

        ])

    transaction_table = Table(transaction_data)

    transaction_table.setStyle(

        TableStyle([

            ("BACKGROUND",(0,0),(-1,0),colors.HexColor("#1E40AF")),

            ("TEXTCOLOR",(0,0),(-1,0),colors.white),

            ("GRID",(0,0),(-1,-1),0.5,colors.grey),

            ("BACKGROUND",(0,1),(-1,-1),colors.whitesmoke),

            ("BOTTOMPADDING",(0,0),(-1,-1),8),

            ("TOPPADDING",(0,0),(-1,-1),8),

            ("FONTSIZE",(0,0),(-1,-1),9)

        ])

    )

    elements.append(transaction_table)

    elements.append(
        Spacer(1,0.30*inch)
    )

    # =====================================================
    # AI Insights
    # =====================================================

    elements.append(

        Paragraph(

            "AI Insights",

            heading_style

        )

    )

    highest_category = ""

    highest_amount = 0

    for category, amount in category_summary.items():

        if amount > highest_amount:

            highest_amount = amount

            highest_category = category

    if total_income > 0:

        savings_rate = round(

            (savings / total_income) * 100,

            2

        )

    else:

        savings_rate = 0

    insights = [

        f"• Total Income : ₹ {total_income:,.2f}",

        f"• Total Expense : ₹ {total_expense:,.2f}",

        f"• Savings : ₹ {savings:,.2f}",

        f"• Total Transactions : {len(transactions)}"

    ]

    if highest_category != "":

        insights.append(

            f"• Highest Spending Category : {highest_category}"

        )

    insights.append(

        f"• Savings Rate : {savings_rate}%"

    )

    if highest_category != "":

        insights.append(

            f"• Recommendation : Reduce spending on {highest_category} to increase savings."

        )

    for item in insights:

        elements.append(

            Paragraph(

                item,

                normal_style

            )

        )

    elements.append(
        Spacer(1,0.30*inch)
    )

    # =====================================================
    # Footer
    # =====================================================

    footer = Paragraph(

        "<b>Generated by AI Personal Finance Tracker</b><br/>"
        "This report was automatically generated using your recorded financial transactions.",

        ParagraphStyle(

            "Footer",

            parent=styles["Normal"],

            alignment=TA_CENTER,

            textColor=colors.grey,

            fontSize=10

        )

    )

    elements.append(footer)

    # =====================================================
    # Build PDF
    # =====================================================

    pdf.build(elements)

    buffer.seek(0)

    filename = "finance_report.pdf"

    if month:

        filename = f"Finance_Report_{month}.pdf"

    return StreamingResponse(

        buffer,

        media_type="application/pdf",

        headers={

            "Content-Disposition":

            f'attachment; filename="{filename}"'

        }

    )