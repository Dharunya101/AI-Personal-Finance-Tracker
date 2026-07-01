from fastapi import APIRouter

router = APIRouter(
    prefix="/reports",
    tags=["Reports"]
)

@router.get("/export-csv")
def export_csv():

    return {
        "message":"CSV Export"
    }

@router.get("/export-pdf")
def export_pdf():

    return {
        "message":"PDF Export"
    }