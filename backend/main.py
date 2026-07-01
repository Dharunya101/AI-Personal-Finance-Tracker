from fastapi import FastAPI

from routes.home import router as home_router
from routes.auth import router as auth_router
from routes.users import router as users_router
from routes.settings import router as settings_router
from routes.monitoring import router as monitoring_router
from routes.transactions import router as transaction_router
from routes.categorization import router as categorization_router
from routes.dashboard import router as dashboard_router
from routes.upload import router as upload_router
from routes.forecasting import router as forecasting_router

from routes.budgets import router as budget_router

app = FastAPI(
    title="AI Personal Finance Tracker",
    version="1.0"
)

app.include_router(home_router)
app.include_router(auth_router)
app.include_router(users_router)
app.include_router(settings_router)
app.include_router(monitoring_router)
app.include_router(transaction_router)
app.include_router(categorization_router)
app.include_router(dashboard_router)
app.include_router(upload_router)
app.include_router(budget_router)
app.include_router(forecasting_router)