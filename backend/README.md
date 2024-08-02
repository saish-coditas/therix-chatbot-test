# Prerequisites
### Python 3.11 and later: 
Ensure you have Python 3.11 installed. You can check the version by running python --version in your terminal. If not installed, download it from the official website: https://www.python.org/downloads/.

### Poetry: 
Assuming you already have Poetry installed and configured.

# Running the Server
```bash
$ cd backend
```

### Install dependencies:

```bash
$ poetry install
```

### Run the server:

```bash
$ poetry run uvicorn main:app --reload  # For automatic code reloading during development
```

This starts the development server using uvicorn, listening on http://localhost:8000/ by default. 

### Swagger documentation URL
http://localhost:8000/docs/

## You can customize the host and port using the following options:

```bash
$ poetry run uvicorn main:app --host 0.0.0.0 --port 8080
```
