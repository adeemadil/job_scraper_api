from fastapi import APIRouter, Query
from scraper import scrape_jobs

router = APIRouter()

@router.get("/health")
async def health_check():
    """
    Health check endpoint to verify API is running.
    """
    return {"status": "healthy"}

@router.get("/jobs")
async def get_jobs(q: str = Query(..., description="Job title or keyword to search for")):
    """
    Fetch jobs from remoteok.com matching the query.
    """
    jobs = scrape_jobs(q)
    return {"jobs": jobs}