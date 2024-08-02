from fastapi import APIRouter
from app.api.routers.template import template_router

router = APIRouter()

router.include_router(template_router)
