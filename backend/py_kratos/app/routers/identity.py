# generated by fastapi-codegen:
#   filename:  openapi.json
#   timestamp: 2024-10-22T11:04:04+00:00

from __future__ import annotations

from fastapi import APIRouter

from ..dependencies import *

router = APIRouter(tags=['identity'])


@router.get(
    '/admin/identities',
    response_model=List[Identity],
    responses={'default': {'model': ErrorGeneric}},
    tags=['identity'],
)
def list_identities(
    per_page: Optional[conint(ge=1, le=1000)] = 250,
    page: Optional[int] = None,
    page_size: Optional[conint(ge=1, le=500)] = 250,
    page_token: Optional[str] = '1',
    consistency: Optional[Consistency2] = None,
    ids: Optional[List[str]] = None,
    credentials_identifier: Optional[str] = None,
    preview_credentials_identifier_similar: Optional[str] = None,
    include_credential: Optional[List[str]] = None,
) -> Union[List[Identity], ErrorGeneric]:
    """
    List Identities
    """
    pass


@router.patch(
    '/admin/identities',
    response_model=BatchPatchIdentitiesResponse,
    responses={
        '400': {'model': ErrorGeneric},
        '409': {'model': ErrorGeneric},
        'default': {'model': ErrorGeneric},
    },
    tags=['identity'],
)
def batch_patch_identities(
    body: PatchIdentitiesBody = None,
) -> Union[BatchPatchIdentitiesResponse, ErrorGeneric]:
    """
    Create multiple identities
    """
    pass


@router.post(
    '/admin/identities',
    response_model=None,
    responses={
        '201': {'model': Identity},
        '400': {'model': ErrorGeneric},
        '409': {'model': ErrorGeneric},
        'default': {'model': ErrorGeneric},
    },
    tags=['identity'],
)
def create_identity(
    body: CreateIdentityBody = None,
) -> Optional[Union[Identity, ErrorGeneric]]:
    """
    Create an Identity
    """
    pass


@router.delete(
    '/admin/identities/{id}',
    response_model=None,
    responses={'404': {'model': ErrorGeneric}, 'default': {'model': ErrorGeneric}},
    tags=['identity'],
)
def delete_identity(id: str) -> Optional[ErrorGeneric]:
    """
    Delete an Identity
    """
    pass


@router.get(
    '/admin/identities/{id}',
    response_model=Identity,
    responses={'404': {'model': ErrorGeneric}, 'default': {'model': ErrorGeneric}},
    tags=['identity'],
)
def get_identity(
    id: str, include_credential: Optional[List[IncludeCredentialEnum1]] = None
) -> Union[Identity, ErrorGeneric]:
    """
    Get an Identity
    """
    pass


@router.patch(
    '/admin/identities/{id}',
    response_model=Identity,
    responses={
        '400': {'model': ErrorGeneric},
        '404': {'model': ErrorGeneric},
        '409': {'model': ErrorGeneric},
        'default': {'model': ErrorGeneric},
    },
    tags=['identity'],
)
def patch_identity(
    id: str, body: List[JsonPatch] = None
) -> Union[Identity, ErrorGeneric]:
    """
    Patch an Identity
    """
    pass


@router.put(
    '/admin/identities/{id}',
    response_model=Identity,
    responses={
        '400': {'model': ErrorGeneric},
        '404': {'model': ErrorGeneric},
        '409': {'model': ErrorGeneric},
        'default': {'model': ErrorGeneric},
    },
    tags=['identity'],
)
def update_identity(
    id: str, body: UpdateIdentityBody = None
) -> Union[Identity, ErrorGeneric]:
    """
    Update an Identity
    """
    pass


@router.delete(
    '/admin/identities/{id}/credentials/{type}',
    response_model=None,
    responses={'404': {'model': ErrorGeneric}, 'default': {'model': ErrorGeneric}},
    tags=['identity'],
)
def delete_identity_credentials(
    id: str, type: Type8 = ..., identifier: Optional[str] = None
) -> Optional[ErrorGeneric]:
    """
    Delete a credential for a specific identity
    """
    pass


@router.delete(
    '/admin/identities/{id}/sessions',
    response_model=None,
    responses={
        '400': {'model': ErrorGeneric},
        '401': {'model': ErrorGeneric},
        '404': {'model': ErrorGeneric},
        'default': {'model': ErrorGeneric},
    },
    tags=['identity'],
)
def delete_identity_sessions(id: str) -> Optional[ErrorGeneric]:
    """
    Delete & Invalidate an Identity's Sessions
    """
    pass


@router.get(
    '/admin/identities/{id}/sessions',
    response_model=List[Session],
    responses={
        '400': {'model': ErrorGeneric},
        '404': {'model': ErrorGeneric},
        'default': {'model': ErrorGeneric},
    },
    tags=['identity'],
)
def list_identity_sessions(
    per_page: Optional[conint(ge=1, le=1000)] = 250,
    page: Optional[int] = None,
    page_size: Optional[conint(ge=1, le=500)] = 250,
    page_token: Optional[str] = '1',
    id: str = ...,
    active: Optional[bool] = None,
) -> Union[List[Session], ErrorGeneric]:
    """
    List an Identity's Sessions
    """
    pass


@router.post(
    '/admin/recovery/code',
    response_model=None,
    responses={
        '201': {'model': RecoveryCodeForIdentity},
        '400': {'model': ErrorGeneric},
        '404': {'model': ErrorGeneric},
        'default': {'model': ErrorGeneric},
    },
    tags=['identity'],
)
def create_recovery_code_for_identity(
    body: CreateRecoveryCodeForIdentityBody = None,
) -> Optional[Union[RecoveryCodeForIdentity, ErrorGeneric]]:
    """
    Create a Recovery Code
    """
    pass


@router.post(
    '/admin/recovery/link',
    response_model=RecoveryLinkForIdentity,
    responses={
        '400': {'model': ErrorGeneric},
        '404': {'model': ErrorGeneric},
        'default': {'model': ErrorGeneric},
    },
    tags=['identity'],
)
def create_recovery_link_for_identity(
    return_to: Optional[str] = None, body: CreateRecoveryLinkForIdentityBody = None
) -> Union[RecoveryLinkForIdentity, ErrorGeneric]:
    """
    Create a Recovery Link
    """
    pass


@router.get(
    '/admin/sessions',
    response_model=List[Session],
    responses={'400': {'model': ErrorGeneric}, 'default': {'model': ErrorGeneric}},
    tags=['identity'],
)
def list_sessions(
    page_size: Optional[conint(ge=1, le=1000)] = 250,
    page_token: Optional[str] = None,
    active: Optional[bool] = None,
    expand: Optional[List[ExpandEnum1]] = None,
) -> Union[List[Session], ErrorGeneric]:
    """
    List All Sessions
    """
    pass


@router.delete(
    '/admin/sessions/{id}',
    response_model=None,
    responses={
        '400': {'model': ErrorGeneric},
        '401': {'model': ErrorGeneric},
        'default': {'model': ErrorGeneric},
    },
    tags=['identity'],
)
def disable_session(id: str) -> Optional[ErrorGeneric]:
    """
    Deactivate a Session
    """
    pass


@router.get(
    '/admin/sessions/{id}',
    response_model=Session,
    responses={'400': {'model': ErrorGeneric}, 'default': {'model': ErrorGeneric}},
    tags=['identity'],
)
def get_session(
    expand: Optional[List[ExpandEnum3]] = None, id: str = ...
) -> Union[Session, ErrorGeneric]:
    """
    Get Session
    """
    pass


@router.patch(
    '/admin/sessions/{id}/extend',
    response_model=Session,
    responses={
        '400': {'model': ErrorGeneric},
        '404': {'model': ErrorGeneric},
        'default': {'model': ErrorGeneric},
    },
    tags=['identity'],
)
def extend_session(id: str) -> Union[Session, ErrorGeneric]:
    """
    Extend a Session
    """
    pass


@router.get(
    '/schemas',
    response_model=List[IdentitySchemaContainer],
    responses={'default': {'model': ErrorGeneric}},
    tags=['identity'],
)
def list_identity_schemas(
    per_page: Optional[conint(ge=1, le=1000)] = 250,
    page: Optional[int] = None,
    page_size: Optional[conint(ge=1, le=500)] = 250,
    page_token: Optional[str] = '1',
) -> Union[List[IdentitySchemaContainer], ErrorGeneric]:
    """
    Get all Identity Schemas
    """
    pass


@router.get(
    '/schemas/{id}',
    response_model=IdentitySchema,
    responses={'404': {'model': ErrorGeneric}, 'default': {'model': ErrorGeneric}},
    tags=['identity'],
)
def get_identity_schema(id: str) -> Union[IdentitySchema, ErrorGeneric]:
    """
    Get Identity JSON Schema
    """
    pass
