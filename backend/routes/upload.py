from fastapi import APIRouter, UploadFile, File
import pandas as pd

router = APIRouter(
    prefix="/upload",
    tags=["📂 Statement Upload"]
)
@router.post("/csv")
async def upload_csv(file: UploadFile = File(...)):

    df = pd.read_csv(file.file)

    return {

        "Filename": file.filename,

        "Rows": len(df),

        "Columns": list(df.columns)

    }
@router.get("/history")
def upload_history():

    return {

        "message":"Upload History will appear here."

    }
@router.post("/pdf")
async def upload_pdf(file: UploadFile = File(...)):

    return {

        "Filename": file.filename,

        "Status":"PDF Uploaded Successfully"

    }