from fastapi import APIRouter, UploadFile, File, Form, HTTPException
import pandas as pd
import joblib
import pdfplumber
import io

from database import transactions_collection

router = APIRouter(
    prefix="/upload",
    tags=["📂 Statement Upload"]
)

# Load ML model
model = joblib.load("../saved_models/expense_classifier.pkl")


@router.post("/statement")
async def upload_statement(
    file: UploadFile = File(...),
    user_email: str = Form(...)
):

    filename = file.filename.lower()

    # ======================================================
    # CSV Upload
    # ======================================================

    if filename.endswith(".csv"):

        df = pd.read_csv(file.file)

        rows_inserted = 0

        for _, row in df.iterrows():

            notes = str(row.get("notes", "")).strip()
            payment_mode = str(row.get("payment_mode", "")).strip()
            location = str(row.get("location", "")).strip()

            try:
                amount = float(row.get("amount", 0))
            except:
                amount = 0

            date = str(row.get("date", "")).strip()

            text = notes + " " + payment_mode + " " + location

            predicted_category = model.predict([text])[0]

            transactions_collection.insert_one({

                "user_email": user_email,
                "date": date,
                "notes": notes,
                "payment_mode": payment_mode,
                "location": location,
                "amount": amount,
                "category": predicted_category

            })

            rows_inserted += 1

        return {

            "message": "CSV uploaded successfully",

            "rows_inserted": rows_inserted

        }

    # ======================================================
    # PDF Upload
    # ======================================================

    elif filename.endswith(".pdf"):

        pdf_bytes = await file.read()

        extracted_text = ""

        with pdfplumber.open(io.BytesIO(pdf_bytes)) as pdf:

            for page in pdf.pages:

                page_text = page.extract_text()

                if page_text:

                    extracted_text += page_text + "\n"

        lines = extracted_text.split("\n")

        rows_inserted = 0

        payment_modes = [
            "Credit Card",
            "Bank Transfer",
            "Net Banking",
            "Debit Card",
            "UPI",
            "Cash"
        ]

        for line in lines:

            line = line.strip()

            if (
                line == "" or
                line.startswith("Sample") or
                line.startswith("Account") or
                line.startswith("Statement") or
                line.startswith("Date Description")
            ):
                continue

            try:

                parts = line.split()

                date = parts[0]

                amount = float(parts[-1])

                location = parts[-2]

                remaining = " ".join(parts[1:-2])

                payment_mode = ""

                notes = ""

                for mode in payment_modes:

                    if remaining.endswith(mode):

                        payment_mode = mode

                        notes = remaining[:-len(mode)].strip()

                        break

                if payment_mode == "":

                    payment_mode = "Unknown"

                    notes = remaining

                text = notes + " " + payment_mode + " " + location

                predicted_category = model.predict([text])[0]

                transactions_collection.insert_one({

                    "user_email": user_email,
                    "date": date,
                    "notes": notes,
                    "payment_mode": payment_mode,
                    "location": location,
                    "amount": amount,
                    "category": predicted_category

                })

                rows_inserted += 1

            except Exception as e:

                print("Skipping line:", line)
                print(e)

        return {

            "message": "PDF uploaded successfully",

            "rows_inserted": rows_inserted

        }

    # ======================================================
    # Unsupported File
    # ======================================================

    else:

        raise HTTPException(

            status_code=400,

            detail="Only CSV and PDF files are supported."

        )


@router.get("/history")
def upload_history():

    return {

        "message": "Upload History will appear here."

    }