from fastapi import APIRouter

router = APIRouter(
    tags=["🏠 Home"]
)

@router.get("/")
def home():
    return {
        "application": "AI Personal Finance Tracker",
        "version": "1.0",
        "status": "Running",
        "developer": "Dharunya Balavelavan"
    }


@router.get("/about")
def about():
    return {
        "Project": "AI Personal Finance Tracker",
        "Description": "Automatically categorizes expenses, tracks budgets, forecasts spending and generates financial insights."
    }