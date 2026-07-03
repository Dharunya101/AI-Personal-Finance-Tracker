from fastapi import APIRouter, UploadFile, File
import pandas as pd
import joblib

from database import transactions_collection

router = APIRouter(
    prefix="/upload",
    tags=["📂 Statement Upload"]
)

# Load ML model once when FastAPI starts
model = joblib.load("../saved_models/expense_classifier.pkl")


@router.post("/csv")
async def upload_csv(file: UploadFile = File(...)):

    df = pd.read_csv(file.file)

    rows_inserted = 0

    for _, row in df.iterrows():

        notes = str(row.get("notes", "")).strip()
        payment_mode = str(row.get("payment_mode", "")).strip()
        location = str(row.get("location", "")).strip()

        amount = float(row.get("amount", 0))
        date = str(row.get("date", "")).strip()

        text = notes + " " + payment_mode + " " + location

        predicted_category = model.predict([text])[0]

        transactions_collection.insert_one({

            "date": date,
            "notes": notes,
            "payment_mode": payment_mode,
            "location": location,
            "amount": amount,
            "category": predicted_category

        })

        rows_inserted += 1

    return {

        "message": "Transactions uploaded successfully",
        "rows_inserted": rows_inserted

    }


@router.get("/history")
def upload_history():

    return {

        "message": "Upload History will appear here."

    }


@router.post("/pdf")
async def upload_pdf(file: UploadFile = File(...)):

    return {

        "Filename": file.filename,
        "Status": "PDF Uploaded Successfully"

    }