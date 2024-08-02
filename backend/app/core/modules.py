from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os
from app.api.routers.all_apis import router
from app.core.constants import STATIC_FOLDER_NAME
from starlette.exceptions import HTTPException as StarletteHttpException
from fastapi.templating import Jinja2Templates


def init_routers(app_: FastAPI) -> None:
    app_.include_router(router)


origins = [
    "*",
]


def attach_middlewares(app_: FastAPI) -> None:
    app_.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_methods=["*"],
        allow_headers=["*"],
    )


def attach_static_folder(app_: FastAPI):
    # os.makedirs(f"{STATIC_FOLDER_NAME}", exist_ok=True)
    app_.mount(
        f"/{STATIC_FOLDER_NAME}",
        StaticFiles(directory=f"{STATIC_FOLDER_NAME}"),
        name=f"{STATIC_FOLDER_NAME}",
    )


def attach_index_file(app_: FastAPI):
    templates = Jinja2Templates(directory="static/frontend")

    @app_.exception_handler(StarletteHttpException)
    async def redirect_404_to_chatbot(request: Request, exc: StarletteHttpException):
        if exc.status_code == 404:
            return templates.TemplateResponse(request=request, name="index.html")
