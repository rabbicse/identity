import requests
from fastapi import HTTPException

from app.features.auth.routes import router
from app.features.auth.models.login import LoginRequestModel

# Ory Kratos public endpoint
ORY_KRATOS_PUBLIC_URL = "http://localhost:4433"  # Change this to your Ory Kratos public API URL

# Ory Kratos API Endpoints
# KRATOS_LOGIN_FLOW_API = f"{ORY_KRATOS_PUBLIC_URL}/self-service/login/api"
# KRATOS_LOGIN_FLOW_BROWSER = f"{ORY_KRATOS_PUBLIC_URL}/self-service/login/browser"
KRATOS_REGISTRATION_FLOW = f"{ORY_KRATOS_PUBLIC_URL}/self-service/registration/api"
# KRATOS_LOGOUT_FLOW = f"{ORY_KRATOS_PUBLIC_URL}/self-service/logout"
# KRATOS_RECOVERY_FLOW = f"{ORY_KRATOS_PUBLIC_URL}/self-service/recovery/api"
# KRATOS_VERIFICATION_FLOW = f"{ORY_KRATOS_PUBLIC_URL}/self-service/verification/api"
# KRATOS_SETTINGS_FLOW = f"{ORY_KRATOS_PUBLIC_URL}/self-service/settings/api"
# KRATOS_SESSIONS = f"{ORY_KRATOS_PUBLIC_URL}/sessions/whoami"
# KRATOS_IDENTITIES = f"{ORY_KRATOS_PUBLIC_URL}/identities"
# KRATOS_ERRORS = f"{ORY_KRATOS_PUBLIC_URL}/self-service/errors"


# ------------------------------------------
# Helper class for form submissions
# ------------------------------------------


# ------------------------------------------
# Ory Kratos Authentication Flows
# ------------------------------------------


@router.get("/registration")
async def registration():
    """Initiates the registration flow."""
    try:
        response = requests.get(KRATOS_REGISTRATION_FLOW)
        if response.status_code != 200:
            raise HTTPException(status_code=response.status_code, detail="Failed to initiate registration flow")
        return response.json()
    except requests.RequestException as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@router.post("/registration/submit")
async def submit_registration(form_data: LoginRequestModel):
    """Submit a registration form."""
    try:
        payload = {
            "flow": form_data.flow_id,
            "csrf_token": form_data.csrf_token,
            "method": form_data.method,
            "traits.email": form_data.email,
            "password": form_data.password
        }
        response = requests.post(f"{ORY_KRATOS_PUBLIC_URL}/self-service/registration", data=payload)
        if response.status_code != 200:
            raise HTTPException(status_code=response.status_code, detail="Registration failed")
        return response.json()
    except requests.RequestException as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


# @router.post("/logout/submit")
# async def submit_logout(form_data: LoginRequestModel):
#     """Perform logout."""
#     try:
#         payload = {
#             "flow": form_data.flow_id,
#             "csrf_token": form_data.csrf_token,
#         }
#         response = requests.post(f"{ORY_KRATOS_PUBLIC_URL}/self-service/logout", data=payload)
#         if response.status_code != 200:
#             raise HTTPException(status_code=response.status_code, detail="Logout failed")
#         return {"message": "Logged out successfully"}
#     except requests.RequestException as e:
#         raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


# @router.get("/recovery")
# async def recovery():
#     """Initiates the recovery flow (password recovery)."""
#     try:
#         response = requests.get(KRATOS_RECOVERY_FLOW)
#         if response.status_code != 200:
#             raise HTTPException(status_code=response.status_code, detail="Failed to initiate recovery flow")
#         return response.json()
#     except requests.RequestException as e:
#         raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")
#
#
# @router.post("/recovery/submit")
# async def submit_recovery(form_data: LoginRequestModel):
#     """Submit a recovery request (password reset)."""
#     try:
#         payload = {
#             "flow": form_data.flow_id,
#             "csrf_token": form_data.csrf_token,
#             "method": form_data.method,
#             "email": form_data.email
#         }
#         response = requests.post(f"{ORY_KRATOS_PUBLIC_URL}/self-service/recovery", data=payload)
#         if response.status_code != 200:
#             raise HTTPException(status_code=response.status_code, detail="Recovery failed")
#         return response.json()
#     except requests.RequestException as e:
#         raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")
#
#
# @router.get("/verification")
# async def verification():
#     """Initiates the verification flow (e.g., email verification)."""
#     try:
#         response = requests.get(KRATOS_VERIFICATION_FLOW)
#         if response.status_code != 200:
#             raise HTTPException(status_code=response.status_code, detail="Failed to initiate verification flow")
#         return response.json()
#     except requests.RequestException as e:
#         raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")
#
#
# @router.post("/verification/submit")
# async def submit_verification(form_data: LoginRequestModel):
#     """Submit a verification request (e.g., email verification)."""
#     try:
#         payload = {
#             "flow": form_data.flow_id,
#             "csrf_token": form_data.csrf_token,
#             "method": form_data.method,
#             "email": form_data.email
#         }
#         response = requests.post(f"{ORY_KRATOS_PUBLIC_URL}/self-service/verification", data=payload)
#         if response.status_code != 200:
#             raise HTTPException(status_code=response.status_code, detail="Verification failed")
#         return response.json()
#     except requests.RequestException as e:
#         raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")
