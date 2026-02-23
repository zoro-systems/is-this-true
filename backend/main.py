# FastAPI backend for Is This True?

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional, List
import base64
import asyncio

app = FastAPI(title="Is This True? API")

class AnalyzeRequest(BaseModel):
    image: str  # Base64 encoded image

class AnalysisResult(BaseModel):
    claim: str
    percentage: int
    summary: str
    sources: List[str]

class AnalyzeResponse(BaseModel):
    success: bool
    result: Optional[AnalysisResult] = None
    error: Optional[str] = None

@app.post("/analyze", response_model=AnalyzeResponse)
async def analyze_image(request: AnalyzeRequest):
    """
    Analyze an image to fact-check claims.
    
    In a production environment, this would:
    1. Decode the base64 image
    2. Use OCR to extract text from the image
    3. Parse the text to identify claims
    4. Search the web for each claim
    5. Return a truth percentage based on sources
    """
    try:
        # For now, return a mock response
        # In production, implement actual OCR and fact-checking
        
        # Decode image (if needed)
        # image_data = base64.b64decode(request.image)
        
        # Simulate processing time
        await asyncio.sleep(2)
        
        # Mock response
        result = AnalysisResult(
            claim="Sample claim from image",
            percentage=23,
            summary="No credible evidence found. This appears to be misinformation based on multiple fact-checking sources.",
            sources=["Reuters", "Snopes", "FactCheck.org", "PolitiFact"]
        )
        
        return AnalyzeResponse(success=True, result=result)
        
    except Exception as e:
        return AnalyzeResponse(
            success=False,
            error=str(e)
        )

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

@app.get("/")
async def root():
    return {
        "name": "Is This True? API",
        "version": "1.0.0",
        "description": "Fact-checking API for the Is This True? mobile app"
    }
