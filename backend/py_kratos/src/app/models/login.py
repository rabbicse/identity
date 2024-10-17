from pydantic import BaseModel


class LoginRequestModel(BaseModel):
    flow_id: str
    csrf_token: str
    email: str = None
    password: str = None
    method: str = None