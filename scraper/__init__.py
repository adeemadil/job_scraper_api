"""
Scraper module for handling web scraping functionality.
"""

import logging
from .remoteok import scrape_jobs as scrape_remoteok
from .weworkremotely import scrape_weworkremotely

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def scrape_jobs(query: str):
    """
    Scrapes jobs from all available sources.
    Returns a list of dicts: { 'title': ..., 'company': ..., 'link': ... }
    """
    remote_ok_jobs = []
    we_work_remotely_jobs = []
    try:
        remote_ok_jobs += scrape_remoteok(query)
    except Exception as e:
        logger.error(f"Remote OK failed: {e}")
    try:
        we_work_remotely_jobs += scrape_weworkremotely(query)
    except Exception as e:
        logger.error(f"We Work Remotely failed: {e}")
    if len(remote_ok_jobs) == 0:
        logger.error("No jobs found on Remote OK")
    if len(we_work_remotely_jobs) == 0:
        logger.error("No jobs found on We Work Remotely")
    jobs = remote_ok_jobs + we_work_remotely_jobs
    return jobs