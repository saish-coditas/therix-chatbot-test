from pydantic import BaseModel, Field
from uuid import UUID


class Therix_Agent(BaseModel):
    name: str


class Agent_Create_Response(BaseModel):
    message: str
    agent_id: UUID | None = None


class Chat_Response(BaseModel):
    answer: str
    session_id: UUID | None = None
    source: str | None = None
    page_number: str | None = None


class Audio_Chat_Response(BaseModel):
    answer: str
    session_id: UUID | None = None
    file_name: str


class Sample_Questions_Response(BaseModel):
    questions: list[str] | None = None


class Therix_Agent_Response_With_Citations(BaseModel):
    answer: str = Field("AI answer output")
    citations: str | None = Field("Provide PDF file name")
    page_number: str | None = Field("Provide page number from the PDF file")
