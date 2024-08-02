# Python image for the backend
FROM public.ecr.aws/lambda/python:3.12

# Set working directory 
WORKDIR ${LAMBDA_TASK_ROOT}/app

# Install system dependencies
RUN pip install --upgrade pip

# Install Poetry
RUN python -m pip install poetry==1.8.3

# Add Poetry to PATH
ENV PATH="/root/.local/bin:${PATH}"

# Copy poetry.lock and pyproject.toml files
COPY backend/pyproject.toml backend/poetry.lock* ${LAMBDA_TASK_ROOT}/app/

# Install project dependencies
RUN poetry config virtualenvs.create false && poetry install --no-interaction --no-ansi --no-root --no-dev

# Copy backend code
COPY backend/ ${LAMBDA_TASK_ROOT}

# Create static folder in the backend to store frontend build
RUN mkdir -p ${LAMBDA_TASK_ROOT}/static

# Set working directory: /var/task
WORKDIR ${LAMBDA_TASK_ROOT}

# Expose the port the app runs on
EXPOSE 8000

# Define environment variable
ENV PYTHONUNBUFFERED=1

# Command to run the FastAPI application
CMD ["main.handler"]