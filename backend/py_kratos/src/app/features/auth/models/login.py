from pydantic import BaseModel


class LoginRequestModel(BaseModel):
    flow_id: str
    csrf_token: str = None
    email: str = None
    password: str = None
    method: str = None