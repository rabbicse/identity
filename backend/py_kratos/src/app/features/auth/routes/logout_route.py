import requests
from fastapi import HTTPException

from app.features.auth.models.logout import LogoutRequestModel
from app.features.auth.routes import router, ORY_KRATOS_PUBLIC_URL


@router.delete("/logout/api")
async def logout_api(logout_request: LogoutRequestModel):
    """Perform logout for api"""
    try:
        payload = {
            "session_token": logout_request.session_token
        }

        response = requests.delete(f"{ORY_KRATOS_PUBLIC_URL}/self-service/logout/api", data=payload)
        if response.status_code != 200:
            raise HTTPException(status_code=response.status_code, detail="Logout failed")
        return {"message": "Logged out successfully"}

    except requests.RequestException as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@router.get("/logout/browser")
async def logout_api(return_to: str):
    """Perform logout for api"""
    try:
        url = f"{ORY_KRATOS_PUBLIC_URL}/self-service/logout/browser?return_to={return_to}"
        response = requests.post(url)
        if response.status_code != 200:
            raise HTTPException(status_code=response.status_code, detail="Logout failed")
        return {"message": "Logged out successfully"}

    except requests.RequestException as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")
