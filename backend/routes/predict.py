from fastapi import APIRouter
from models.schemas import Transaction
from model_loader import model

router = APIRouter(
    prefix="/predict",
    tags=["Prediction"]
)

@router.post("/")
def predict(transaction: Transaction):

    text = (
        transaction.notes
        + " "
        + transaction.payment_mode
        + " "
        + transaction.location
    )

    prediction = model.predict([text])[0]

    return {
        "Predicted Category": prediction
    }