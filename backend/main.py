from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

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
from routes.insights import router as insights_router
from routes.analytics import router as analytics_router
from routes.budgets import router as budget_router
from routes.reports import router as reports_router

app = FastAPI(
    title="AI Personal Finance Tracker",
    version="1.0"
)

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
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
app.include_router(insights_router)
app.include_router(analytics_router)
app.include_router(reports_router)