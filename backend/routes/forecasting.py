from fastapi import APIRouter

from services.forecast_service import forecast_next_month

router = APIRouter(
    prefix="/forecast",
    tags=["📈 Forecasting"]
)


@router.get("/next-month")
def next_month():

    return forecast_next_month()