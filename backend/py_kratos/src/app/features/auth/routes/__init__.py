from fastapi import APIRouter

router = APIRouter(
    prefix='/auth',
    tags=['Authentication'],
)

# Ory Kratos public endpoint
ORY_KRATOS_PUBLIC_URL = "http://localhost:4433"  # Change this to your Ory Kratos public API URL