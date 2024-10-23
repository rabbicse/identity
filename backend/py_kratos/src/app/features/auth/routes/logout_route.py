import requests
from fastapi import HTTPException

from app.features.auth.routes import router
from app.models.login import LoginRequestModel

# Ory Kratos public endpoint
ORY_KRATOS_PUBLIC_URL = "http://localhost:4433"  # Change this to your Ory Kratos public API URL

# Ory Kratos API Endpoints
KRATOS_LOGIN_FLOW_API = f"{ORY_KRATOS_PUBLIC_URL}/self-service/login/api"
KRATOS_REGISTRATION_FLOW = f"{ORY_KRATOS_PUBLIC_URL}/self-service/registration/api"
KRATOS_LOGOUT_FLOW = f"{ORY_KRATOS_PUBLIC_URL}/self-service/logout"
KRATOS_RECOVERY_FLOW = f"{ORY_KRATOS_PUBLIC_URL}/self-service/recovery/api"
KRATOS_VERIFICATION_FLOW = f"{ORY_KRATOS_PUBLIC_URL}/self-service/verification/api"
KRATOS_SETTINGS_FLOW = f"{ORY_KRATOS_PUBLIC_URL}/self-service/settings/api"
KRATOS_SESSIONS = f"{ORY_KRATOS_PUBLIC_URL}/sessions/whoami"
KRATOS_IDENTITIES = f"{ORY_KRATOS_PUBLIC_URL}/identities"
KRATOS_ERRORS = f"{ORY_KRATOS_PUBLIC_URL}/self-service/errors"


# ------------------------------------------
# Helper class for form submissions
# ------------------------------------------


# ------------------------------------------
# Ory Kratos Authentication Flows
# ------------------------------------------

@router.post("/logout/submit")
async def submit_logout(form_data: LoginRequestModel):
    """Perform logout."""
    try:
        payload = {
            "flow": form_data.flow_id,
            "csrf_token": form_data.csrf_token,
        }
        response = requests.post(f"{ORY_KRATOS_PUBLIC_URL}/self-service/logout", data=payload)
        if response.status_code != 200:
            raise HTTPException(status_code=response.status_code, detail="Logout failed")
        return {"message": "Logged out successfully"}
    except requests.RequestException as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")
