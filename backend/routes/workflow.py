from fastapi import APIRouter

router = APIRouter(
    prefix="/workflow",
    tags=["Workflow"]
)

@router.get("/")
def workflow():

    return {

        "Workflow":[

            "User enters transaction",

            "LinearSVC Prediction",

            "Store in MongoDB",

            "Return Response"

        ]

    }