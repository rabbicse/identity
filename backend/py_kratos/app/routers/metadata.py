# generated by fastapi-codegen:
#   filename:  openapi.json
#   timestamp: 2024-10-22T11:04:04+00:00

from __future__ import annotations

from fastapi import APIRouter

from ..dependencies import *

router = APIRouter(tags=['metadata'])


@router.get('/version', response_model=VersionGetResponse, tags=['metadata'])
def get_version() -> VersionGetResponse:
    """
    Return Running Software Version.
    """
    pass
