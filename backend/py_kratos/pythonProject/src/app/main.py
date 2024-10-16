from fastapi import FastAPI, HTTPException, Request, Depends
import requests
from pydantic import BaseModel

import src.app.features.auth as auth_router

app = FastAPI()
app.include_router(auth_router.router)

# # Ory Kratos public endpoint
# ORY_KRATOS_PUBLIC_URL = "http://localhost:4433"  # Change this to your Ory Kratos public API URL
#
# # Ory Kratos API Endpoints
# KRATOS_LOGIN_FLOW = f"{ORY_KRATOS_PUBLIC_URL}/self-service/login/api"
# KRATOS_REGISTRATION_FLOW = f"{ORY_KRATOS_PUBLIC_URL}/self-service/registration/api"
# KRATOS_LOGOUT_FLOW = f"{ORY_KRATOS_PUBLIC_URL}/self-service/logout"
# KRATOS_RECOVERY_FLOW = f"{ORY_KRATOS_PUBLIC_URL}/self-service/recovery/api"
# KRATOS_VERIFICATION_FLOW = f"{ORY_KRATOS_PUBLIC_URL}/self-service/verification/api"
# KRATOS_SETTINGS_FLOW = f"{ORY_KRATOS_PUBLIC_URL}/self-service/settings/api"
# KRATOS_SESSIONS = f"{ORY_KRATOS_PUBLIC_URL}/sessions/whoami"
# KRATOS_IDENTITIES = f"{ORY_KRATOS_PUBLIC_URL}/identities"
# KRATOS_ERRORS = f"{ORY_KRATOS_PUBLIC_URL}/self-service/errors"
#
# # ------------------------------------------
# # Helper class for form submissions
# # ------------------------------------------
#
# class SubmitForm(BaseModel):
#     flow_id: str
#     # csrf_token: str
#     email: str = None
#     password: str = None
#     method: str = None
#
# # ------------------------------------------
# # Ory Kratos Authentication Flows
# # ------------------------------------------
#
# @app.get("/auth/login")
# async def login():
#     """Initiates the login flow."""
#     try:
#         response = requests.get(KRATOS_LOGIN_FLOW)
#         if response.status_code != 200:
#             raise HTTPException(status_code=response.status_code, detail="Failed to initiate login flow")
#         return response.json()
#     except requests.RequestException as e:
#         raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")
#
#
# @app.post("/auth/login/submit")
# async def submit_login(form_data: SubmitForm):
#     """Submit a login form."""
#     try:
#         flow_id = form_data.flow_id
#         payload = {
#             "method": form_data.method,
#             "identifier": form_data.email,
#             "password": form_data.password
#         }
#         print(payload)
#         headers = {'Content-type': 'application/json'}
#         response = requests.post(f"{ORY_KRATOS_PUBLIC_URL}/self-service/login?flow={flow_id}", json=payload, headers=headers)
#         print(response.json())
#         if response.status_code != 200:
#             raise HTTPException(status_code=response.status_code, detail="Login failed")
#         return response.json()
#     except requests.RequestException as e:
#         raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")
#
#
# @app.get("/auth/registration")
# async def registration():
#     """Initiates the registration flow."""
#     try:
#         response = requests.get(KRATOS_REGISTRATION_FLOW)
#         if response.status_code != 200:
#             raise HTTPException(status_code=response.status_code, detail="Failed to initiate registration flow")
#         return response.json()
#     except requests.RequestException as e:
#         raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")
#
#
# @app.post("/auth/registration/submit")
# async def submit_registration(form_data: SubmitForm):
#     """Submit a registration form."""
#     try:
#         payload = {
#             "flow": form_data.flow_id,
#             "csrf_token": form_data.csrf_token,
#             "method": form_data.method,
#             "traits.email": form_data.email,
#             "password": form_data.password
#         }
#         response = requests.post(f"{ORY_KRATOS_PUBLIC_URL}/self-service/registration", data=payload)
#         if response.status_code != 200:
#             raise HTTPException(status_code=response.status_code, detail="Registration failed")
#         return response.json()
#     except requests.RequestException as e:
#         raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")
#
#
# @app.post("/auth/logout")
# async def submit_logout(form_data: SubmitForm):
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
#
#
# @app.get("/auth/recovery")
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
# @app.post("/auth/recovery/submit")
# async def submit_recovery(form_data: SubmitForm):
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
# @app.get("/auth/verification")
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
# @app.post("/auth/verification/submit")
# async def submit_verification(form_data: SubmitForm):
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
#
#
# # ------------------------------------------
# # Ory Kratos Identity Management
# # ------------------------------------------
#
# @app.post("/identities")
# async def create_identity(identity_data: dict):
#     """Create a new identity."""
#     try:
#         response = requests.post(KRATOS_IDENTITIES, json=identity_data)
#         if response.status_code != 201:
#             raise HTTPException(status_code=response.status_code, detail="Failed to create identity")
#         return response.json()
#     except requests.RequestException as e:
#         raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")
#
#
# @app.put("/identities/{identity_id}")
# async def update_identity(identity_id: str, identity_data: dict):
#     """Update an identity."""
#     try:
#         response = requests.put(f"{KRATOS_IDENTITIES}/{identity_id}", json=identity_data)
#         if response.status_code != 200:
#             raise HTTPException(status_code=response.status_code, detail="Failed to update identity")
#         return response.json()
#     except requests.RequestException as e:
#         raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")
#
#
# # ------------------------------------------
# # Start FastAPI application
# # ------------------------------------------

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
