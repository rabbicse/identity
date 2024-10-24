import requests
from fastapi import HTTPException

from app.features.auth.routes import router
from app.features.auth.models.login import LoginRequestModel

# Ory Kratos public endpoint
ORY_KRATOS_PUBLIC_URL = "http://localhost:4433"  # Change this to your Ory Kratos public API URL


@router.get("/settings/api")
async def settings_api():
    """Create Auth Settings flow"""
    try:
        url = f'{ORY_KRATOS_PUBLIC_URL}/self-service/settings/api'
        headers = {'Accept': 'application/json'}
        response = requests.get(url, headers=headers)
        if response.status_code != 200:
            raise HTTPException(status_code=response.status_code, detail="Failed to initiate login flow")
        return response.json()
    except requests.RequestException as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@router.get("/settings/browser")
async def settings_browser():
    """Get Auth Settings"""
    try:
        url = f'{ORY_KRATOS_PUBLIC_URL}/self-service/settings/browser'
        headers = {'Accept': 'application/json'}
        response = requests.get(url, headers=headers)
        if response.status_code != 200:
            raise HTTPException(status_code=response.status_code, detail="Failed to initiate login flow")
        return response.json()
    except requests.RequestException as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")
