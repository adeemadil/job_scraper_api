"""
Scraper module for handling web scraping functionality.
"""

import requests
from bs4 import BeautifulSoup

def scrape_jobs(query: str):
    """
    Scrapes remoteok.com for jobs matching the query.
    Returns a list of dicts: { 'title': ..., 'company': ..., 'link': ... }
    """
    url = f"https://remoteok.com/remote-{query.replace(' ', '-')}-jobs"
    headers = {
        "User-Agent": "Mozilla/5.0"
    }
    response = requests.get(url, headers=headers)
    if response.status_code != 200:
        return []

    soup = BeautifulSoup(response.text, "html.parser")
    jobs = []
    for job_row in soup.find_all("tr", class_="job"):
        title_elem = job_row.find("h2", itemprop="title")
        company_elem = job_row.find("h3", itemprop="name")
        link_elem = job_row.find("a", class_="preventLink")
        if title_elem and company_elem and link_elem:
            jobs.append({
                "title": title_elem.get_text(strip=True),
                "company": company_elem.get_text(strip=True),
                "link": "https://remoteok.com" + link_elem.get("href")
            })
    return jobs