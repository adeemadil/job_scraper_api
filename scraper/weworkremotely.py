import requests
from bs4 import BeautifulSoup

def scrape_weworkremotely(query: str):
    """
    Scrapes We Work Remotely for jobs matching the query.
    Returns a list of dicts: { 'title': ..., 'company': ..., 'link': ..., 'source': 'We Work Remotely' }
    """
    url = f"https://weworkremotely.com/remote-jobs/search?term={query.replace(' ', '+')}"
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
        if title_elem and company_elem and link_elem:
            jobs.append({
                "title": title_elem.get_text(strip=True),
                "company": company_elem.get_text(strip=True),
                "link": "https://weworkremotely.com" + link_elem.get("href"),
                "source": "We Work Remotely"
            })
    return jobs 