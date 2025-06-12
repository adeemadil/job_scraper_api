import requests
from bs4 import BeautifulSoup

def scrape_jobs(query: str, location: str = None, job_type: str = None, experience_level: str = None):
    """
    Scrapes remoteok.com for jobs matching the query.
    Returns a list of dicts: { 'title': ..., 'company': ..., 'link': ..., 'description': ... }
    """
    # Construct the base URL
    search_term = query.replace(' ', '-')
    if location:
        search_term = f"{search_term}-in-{location.replace(' ', '-')}"

    # RemoteOK often treats job type/experience as keywords, so append them to the search term
    if job_type:
        search_term = f"{search_term}-{job_type.replace(' ', '-')}"
    if experience_level:
        search_term = f"{search_term}-{experience_level.replace(' ', '-')}"

    url = f"https://remoteok.com/remote-{search_term}-jobs"

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
            job_link = "https://remoteok.com" + link_elem.get("href")
            # Fetch job detail page for description
            description = ""
            try:
                job_resp = requests.get(job_link, headers=headers)
                if job_resp.status_code == 200:
                    job_soup = BeautifulSoup(job_resp.text, "html.parser")
                    desc_elem = job_soup.find("div", {"class": "description"})
                    if desc_elem:
                        description = desc_elem.get_text(strip=True)[:200]
            except Exception:
                pass
            jobs.append({
                "title": title_elem.get_text(strip=True),
                "company": company_elem.get_text(strip=True),
                "link": job_link,
                "source": "Remote OK",
                "description": description
            })
    return jobs 