from fastapi import APIRouter
from app.api.endpoints.api import template_module

template_router = APIRouter()

template_router.include_router(
    template_module,
    responses={404: {"description": "Not found"}},
)
