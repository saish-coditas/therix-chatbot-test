from uuid import UUID, uuid4
from fastapi.params import Param, Query
from app.models.agent import (
    Agent_Create_Response,
    Audio_Chat_Response,
    Chat_Response,
    Sample_Questions_Response,
    Therix_Agent,
    Therix_Agent_Response_With_Citations,
)
from fastapi import APIRouter, HTTPException
from therix.core.agent import Agent
import os, json, requests, random
from therix.core.inference_models import GroqLlama38b
from therix.core.system_prompt_config import SystemPromptConfig
from fastapi.responses import JSONResponse, StreamingResponse, FileResponse
from elevenlabs.client import ElevenLabs
from elevenlabs import save
from therix.core.output_parser import OutputParserWrapper

from app.core.constants import PRE_DEFINED_QUESTIONS, STATIC_FOLDER_NAME

GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")
THERIX_AGENT_ID = os.getenv("THERIX_AGENT_ID", "")
ELEVENLABS_API_KEY = os.getenv("ELEVENLABS_API_KEY", "")
ELEVENLABS_VOICE_ID = os.getenv("ELEVENLABS_VOICE_ID", "")

template_module = APIRouter()


@template_module.post("/agent", response_model=Agent_Create_Response)
async def create_therix_agent(agent_options: Therix_Agent):
    try:
        agent = Agent(name=agent_options.name)
        (
            agent.add(GroqLlama38b(config={"groq_api_key": GROQ_API_KEY}))
            .add(SystemPromptConfig(config={"system_prompt": "Philosopher_bot"}))
            .save()
        )
        response = {"message": "Agent is created on Therix"}
        if agent.id:
            response.update({"agent_id": agent.id})
        return response
    except Exception as e:
        print("Error in create_therix_agent: ", e)
        raise HTTPException(status_code=500, detail="Internal server error")


@template_module.get("/chat", response_model=Chat_Response)
async def chat_with_therix_agent(
    user_input: str, session_id: UUID | str = Param(..., example=uuid4())
):
    try:
        output = await get_answer(user_input=user_input, session_id=session_id)
        return output
    except Exception as e:
        print("Error in chat_with_therix_agent: ", e)
        raise HTTPException(status_code=500, detail="Internal server error")


@template_module.get("/audio-chat", response_model=Audio_Chat_Response)
async def audio_chat(
    user_input: str, session_id: UUID | str = Param(..., example=uuid4())
):
    try:
        output = await get_answer(user_input=user_input, session_id=session_id)

        if output and output["answer"]:
            eleven_labs_client = ElevenLabs(api_key=ELEVENLABS_API_KEY)

            audio_response = eleven_labs_client.generate(
                text=output["answer"],
                voice=ELEVENLABS_VOICE_ID,
                model="eleven_multilingual_v2",
                output_format="mp3_44100_128",
            )

            file_name = f"{session_id}.mp3"
            audio_file_path = f"{STATIC_FOLDER_NAME}/{file_name}"
            print("saving audio")
            save(audio_response, audio_file_path)
            print("audio saved")

            return Audio_Chat_Response(
                answer=output["answer"],
                file_name=f"{file_name}",
                session_id=session_id,
            )

        else:
            return None
    except Exception as e:
        print("Error in chat_with_therix_agent: ", e)
        raise HTTPException(status_code=500, detail="Internal server error")


async def get_answer(
    user_input: str, session_id: UUID | str = Param(..., example=uuid4())
):
    agent = Agent.from_id(THERIX_AGENT_ID)

    response = agent.invoke(
        question=user_input,
        session_id=session_id,
        output_parser=OutputParserWrapper.parse_output(
            pydantic_object=Therix_Agent_Response_With_Citations
        ),
    )

    if response and response["answer"] and response["answer"]:
        if isinstance(response["answer"], str):
            extracted_data = extract_answer_with_type(response)

            if extracted_data["data_type"] == "json":
                return {
                    "answer": extracted_data["answer"]["answer"],
                    "session_id": session_id,
                    "source": extracted_data["answer"]["citations"],
                    "page_number": extracted_data["answer"]["page_number"],
                }

    return response


def extract_answer_with_type(response):
    answer = response.get("answer")
    data_type = str(type(answer))

    if isinstance(answer, str):
        try:
            answer = json.loads(answer)
            data_type = "json"
        except json.JSONDecodeError:
            pass

    return {"answer": answer, "data_type": data_type}


@template_module.get("/sample-questions", response_model=Sample_Questions_Response)
async def get_predefined_questions(
    num_of_questions: int = Query(..., le=10, example=5)
):
    return {"questions": random.sample(PRE_DEFINED_QUESTIONS, num_of_questions)}


# TODO: Uncomment and verify below after therix enables streaming response
# @template_module.get("/audio-stream-chat")
# async def fetch_audio(user_input: str, session_id: UUID | str = Param(..., example=uuid4())):
#     agent = Agent.from_id(THERIX_AGENT_ID)

#     output = agent.invoke(question=user_input, session_id=session_id)
#     CHUNK_SIZE = 1024  # Size of chunks to read/write at a time
#     XI_API_KEY = ELEVENLABS_API_KEY  # Your API key for authentication
#     VOICE_ID = ELEVENLABS_VOICE_ID  # ID of the voice model to use

#     # Construct the URL for the Text-to-Speech API request
#     tts_url = f"https://api.elevenlabs.io/v1/text-to-speech/{VOICE_ID}/stream"

#     # Set up headers for the API request, including the API key for authentication
#     headers = {"Accept": "application/json", "xi-api-key": XI_API_KEY}

#     # Set up the data payload for the API request, including the text and voice settings
#     data = {
#         "text": output,
#         "model_id": "eleven_multilingual_v2",
#         "voice_settings": {
#             "stability": 0.5,
#             "similarity_boost": 0.8,
#             "style": 0.0,
#             "use_speaker_boost": True,
#         },
#     }

#     # Make the POST request to the TTS API with headers and data, enabling streaming response
#     response = requests.post(tts_url, headers=headers, json=data, stream=True)

#     # Check if the request was successful
#     if response.ok:

#         def generate():
#             for chunk in response.iter_content(chunk_size=CHUNK_SIZE):
#                 if chunk:
#                     yield chunk

#         return StreamingResponse(generate(), media_type="audio/wav")
#     else:
#         # Print the error message if the request was not successful
#         print(response.text)
