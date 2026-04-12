from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import PyPDF2

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"message": "Resume Scanner API running 🚀"}


def extract_text_from_pdf(file):
    pdf_reader = PyPDF2.PdfReader(file.file)
    text = ""

    for page in pdf_reader.pages:
        text += page.extract_text()

    return text


@app.post("/upload-resume")
async def upload_resume(file: UploadFile = File(...)):
    text = extract_text_from_pdf(file)

    return {
        "filename": file.filename,
        "extracted_text": text[:1000]  # limit preview
    }