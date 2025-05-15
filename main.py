from fastapi import FastAPI
from api.routes import router as api_router

app = FastAPI(
    title="Job Scraper API",
    description="API for scraping job listings",
    version="1.0.0"
)

app.include_router(api_router, prefix="/api")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 