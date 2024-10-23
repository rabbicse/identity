# generated by fastapi-codegen:
#   filename:  openapi.json
#   timestamp: 2024-10-22T11:04:04+00:00

from __future__ import annotations

from fastapi import APIRouter

from ..dependencies import *

router = APIRouter(tags=['oidc'])


@router.get(
    '/.well-known/openid-configuration',
    response_model=OidcConfiguration,
    responses={'default': {'model': ErrorOAuth2}},
    tags=['oidc'],
)
def discover_oidc_configuration() -> Union[OidcConfiguration, ErrorOAuth2]:
    """
    OpenID Connect Discovery
    """
    pass


@router.post(
    '/credentials',
    response_model=VerifiableCredentialResponse,
    responses={
        '400': {'model': VerifiableCredentialPrimingResponse},
        'default': {'model': ErrorOAuth2},
    },
    tags=['oidc'],
)
def create_verifiable_credential(
    body: CreateVerifiableCredentialRequestBody = None,
) -> Union[
    VerifiableCredentialResponse, VerifiableCredentialPrimingResponse, ErrorOAuth2
]:
    """
    Issues a Verifiable Credential
    """
    pass


@router.post(
    '/oauth2/register',
    response_model=None,
    responses={
        '201': {'model': OAuth2Client},
        '400': {'model': ErrorOAuth2},
        'default': {'model': ErrorOAuth2},
    },
    tags=['oidc'],
)
def create_oidc_dynamic_client(
    body: OAuth2Client,
) -> Optional[Union[OAuth2Client, ErrorOAuth2]]:
    """
    Register OAuth2 Client using OpenID Dynamic Client Registration
    """
    pass


@router.delete(
    '/oauth2/register/{id}',
    response_model=None,
    responses={'default': {'model': GenericError}},
    tags=['oidc'],
)
def delete_oidc_dynamic_client(id: str) -> Optional[GenericError]:
    """
    Delete OAuth 2.0 Client using the OpenID Dynamic Client Registration Management Protocol
    """
    pass


@router.get(
    '/oauth2/register/{id}',
    response_model=OAuth2Client,
    responses={'default': {'model': ErrorOAuth2}},
    tags=['oidc'],
)
def get_oidc_dynamic_client(id: str) -> Union[OAuth2Client, ErrorOAuth2]:
    """
    Get OAuth2 Client using OpenID Dynamic Client Registration
    """
    pass


@router.put(
    '/oauth2/register/{id}',
    response_model=OAuth2Client,
    responses={'404': {'model': ErrorOAuth2}, 'default': {'model': ErrorOAuth2}},
    tags=['oidc'],
)
def set_oidc_dynamic_client(
    id: str, body: OAuth2Client = ...
) -> Union[OAuth2Client, ErrorOAuth2]:
    """
    Set OAuth2 Client using OpenID Dynamic Client Registration
    """
    pass


@router.get('/oauth2/sessions/logout', response_model=None, tags=['oidc'])
def revoke_oidc_session() -> None:
    """
    OpenID Connect Front- and Back-channel Enabled Logout
    """
    pass


@router.get(
    '/userinfo',
    response_model=OidcUserInfo,
    responses={'default': {'model': ErrorOAuth2}},
    tags=['oidc'],
)
def get_oidc_user_info() -> Union[OidcUserInfo, ErrorOAuth2]:
    """
    OpenID Connect Userinfo
    """
    pass