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
async def get_jobs(
    q: str = Query(..., description="Job title or keyword to search for"),
    location: str = Query(None, description="Job location"),
    job_type: str = Query(None, description="Type of job (e.g., Full-time, Part-time)"),
    experience_level: str = Query(None, description="Experience level (e.g., Entry-level, Senior-level)"),
):
    """
    Fetch jobs from remoteok.com matching the query and optional filters.
    """
    jobs = scrape_jobs(q, location, job_type, experience_level)
    return {"jobs": jobs}