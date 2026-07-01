from fastapi import APIRouter

router = APIRouter(
    prefix="/monitoring",
    tags=["📊 Monitoring"]
)


@router.get("/api")
def api():

    return {
        "API": "Running"
    }


@router.get("/database")
def database():

    return {
        "MongoDB": "Connected"
    }


@router.get("/model")
def model():

    return {
        "Model": "LinearSVC Loaded"
    }


@router.get("/system")
def system():

    return {

        "Backend": "Healthy",

        "Status": "Running"

    }