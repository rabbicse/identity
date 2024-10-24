from pydantic import BaseModel


class LogoutRequestModel(BaseModel):
    session_token: str