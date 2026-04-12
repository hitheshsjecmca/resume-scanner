from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def home():
    return {"message": "Resume Scanner API is running"}
