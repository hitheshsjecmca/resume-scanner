from fastapi import FastAPI, UploadFile, File, Form
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
        if page.extract_text():
            text += page.extract_text()

    return text


def analyze_without_ai(resume_text, job_desc):
    resume_words = set(resume_text.lower().split())
    job_words = set(job_desc.lower().split())

    matched = resume_words.intersection(job_words)
    missing = job_words - resume_words

    score = int((len(matched) / len(job_words)) * 100) if job_words else 0

    # Suggestions
    suggestions = []
    if missing:
        suggestions.append("Add missing skills to your resume")
    if score < 50:
        suggestions.append("Improve your resume with more relevant experience")

    return {
        "match_score": score,
        "matched_skills": list(matched),
        "missing_skills": list(missing),
        "suggestions": suggestions
    }


@app.post("/analyze")
async def analyze_resume(
    file: UploadFile = File(...),
    job_desc: str = Form(...)
):
    resume_text = extract_text_from_pdf(file)

    result = analyze_without_ai(resume_text, job_desc)

    return {
        "analysis": result
    }