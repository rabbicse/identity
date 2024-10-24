import requests
from fastapi import HTTPException

from app.features.auth.routes import router, ORY_KRATOS_PUBLIC_URL
from app.features.auth.models.login import LoginRequestModel


@router.get("/login/api")
async def login_api():
    """Create Login Flow for Native Apps"""
    try:
        url = f'{ORY_KRATOS_PUBLIC_URL}/self-service/login/api'
        headers = {'Accept': 'application/json'}
        response = requests.get(url, headers=headers)
        if response.status_code != 200:
            raise HTTPException(status_code=response.status_code, detail="Failed to initiate login flow")
        return response.json()
    except requests.RequestException as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@router.get("/login/browser")
async def login_browser():
    """Create Login Flow for Browsers"""
    try:
        url = f'{ORY_KRATOS_PUBLIC_URL}/self-service/login/browser'
        headers = {'Accept': 'application/json'}
        response = requests.get(url, headers=headers)
        if response.status_code != 200:
            raise HTTPException(status_code=response.status_code, detail="Failed to initiate login flow")
        return response.json()
    except requests.RequestException as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@router.get("/login/{flow}")
async def get_login_flow(flow: str):
    """Get Login Flow by flow id"""
    try:
        headers = {'Accept': 'application/json'}
        url = f"{ORY_KRATOS_PUBLIC_URL}/self-service/login/flows?id={flow}"
        response = requests.get(url, headers=headers)
        if response.status_code != 200:
            raise HTTPException(status_code=response.status_code, detail="Failed to initiate login flow")
        return response.json()
    except requests.RequestException as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@router.post("/login/submit")
async def submit_login(form_data: LoginRequestModel):
    """Submit a login form."""
    try:
        flow_id = form_data.flow_id
        payload = {
            "method": form_data.method,
            "identifier": form_data.email,
            "password": form_data.password
        }
        headers = {'Content-type': 'application/json'}
        response = requests.post(f"{ORY_KRATOS_PUBLIC_URL}/self-service/login?flow={flow_id}",
                                 json=payload,
                                 headers=headers)
        if response.status_code != 200:
            raise HTTPException(status_code=response.status_code, detail="Login failed")
        return response.json()
    except requests.RequestException as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")
