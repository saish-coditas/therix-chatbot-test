from fastapi import FastAPI

from app.core.modules import (
    attach_index_file,
    attach_middlewares,
    attach_static_folder,
    init_routers,
)
from dotenv import load_dotenv
from mangum import Mangum

load_dotenv()


def create_app() -> FastAPI:
    app_ = FastAPI(title="Therix Chatbot Template")
    init_routers(app_=app_)
    attach_middlewares(app_=app_)
    attach_static_folder(app_=app_)
    attach_index_file(app_=app_)
    openapi_schema = app_.openapi()
    openapi_schema["info"][
        "description"
    ] = "This API serves audio files at `/static/<file_name>` URL path. "
    return app_


app = create_app()

handler = Mangum(app)