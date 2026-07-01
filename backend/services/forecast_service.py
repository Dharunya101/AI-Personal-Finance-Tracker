import pandas as pd
from statsmodels.tsa.holtwinters import ExponentialSmoothing

from database import transactions_collection


def prepare_monthly_data():

    transactions = list(transactions_collection.find())

    if len(transactions) == 0:
        return None

    df = pd.DataFrame(transactions)

    df["date"] = pd.to_datetime(df["date"])

    monthly = (
        df.groupby(df["date"].dt.to_period("M"))["amount"]
        .sum()
        .reset_index()
    )

    monthly["date"] = monthly["date"].astype(str)

    return monthly


def forecast_next_month():

    monthly = prepare_monthly_data()

    if monthly is None or len(monthly) < 3:
        return {
            "message": "Not enough historical data for forecasting."
        }

    series = monthly["amount"]

    model = ExponentialSmoothing(
        series,
        trend="add"
    ).fit()

    prediction = model.forecast(1)

    return {
        "Next Month Prediction": round(float(prediction.iloc[0]), 2)
    }