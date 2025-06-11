from scraper import scrape_jobs

def main():
    # Test the scraper with a search query
    query = "python"
    print(f"Searching for {query} jobs...")
    
    # Get jobs from all sources
    jobs = scrape_jobs(query)
    
    # Print results
    print(f"\nFound {len(jobs)} jobs:")
    print("-" * 80)
    for job in jobs:
        print(f"Title: {job['title']}")
        print(f"Company: {job['company']}")
        print(f"Description: {job['description']}")
        print(f"Link: {job['link']}")
        print("-" * 80)

if __name__ == "__main__":
    main() 