import requests
from bs4 import BeautifulSoup

def scrape_weworkremotely(query: str, location: str = None, job_type: str = None, experience_level: str = None):
    """
    Scrapes We Work Remotely for jobs matching the query.
    Returns a list of dicts: { 'title': ..., 'company': ..., 'link': ..., 'source': 'We Work Remotely', 'description': ... }
    """
    # Construct the base URL
    search_term = query.replace(' ', '+')

    # We Work Remotely often treats job type/experience/location as keywords
    if location:
        search_term = f"{search_term}+{location.replace(' ', '+')}"
    if job_type:
        search_term = f"{search_term}+{job_type.replace(' ', '+')}"
    if experience_level:
        search_term = f"{search_term}+{experience_level.replace(' ', '+')}"

    url = f"https://weworkremotely.com/remote-jobs/search?term={search_term}"
    headers = {
        "User-Agent": "Mozilla/5.0"
    }
    response = requests.get(url, headers=headers)
    if response.status_code != 200:
        return []

    soup = BeautifulSoup(response.text, "html.parser")
    jobs = []
    for job_row in soup.find_all("li", class_="feature"):
        title_elem = job_row.find("span", class_="title")
        company_elem = job_row.find("span", class_="company")
        link_elem = job_row.find("a", class_="job_link")
        desc_elem = job_row.find("span", class_="region company")
        description = desc_elem.get_text(strip=True)[:200] if desc_elem else ""
        if title_elem and company_elem and link_elem:
            jobs.append({
                "title": title_elem.get_text(strip=True),
                "company": company_elem.get_text(strip=True),
                "link": "https://weworkremotely.com" + link_elem.get("href"),
                "source": "We Work Remotely",
                "description": description
            })
    return jobs 