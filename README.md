# 🛠️ Job Scraper API

A simple FastAPI-based API that scrapes job postings from RemoteOK and returns them as JSON. Designed for easy local development and extensibility.

---

## 🚀 Features
- Scrapes job postings from RemoteOK
- REST API endpoints for health check and job search
- CORS enabled for frontend integration
- Ready for deployment (e.g., Vercel, serverless)

---

## 🧰 Tech Stack
- **Python 3.9+**
- **FastAPI**
- **BeautifulSoup4** (for HTML parsing)
- **Requests** (for HTTP requests)
- **Uvicorn** (for local server)

---

## ⚙️ Setup Instructions

1. **Clone the repository:**
   ```sh
   git clone <your-repo-url>
   cd job_scraper_api
   ```

2. **Install dependencies:**
   ```sh
   pip install -r requirements.txt
   ```

3. **(Optional) Set up a virtual environment:**
   ```sh
   python -m venv venv
   .\venv\Scripts\activate  # On Windows
   source venv/bin/activate  # On Linux/Mac
   ```

---

## ▶️ How to Run Locally

```sh
uvicorn main:app --reload
```

The API will be available at [http://127.0.0.1:8000](http://127.0.0.1:8000)

---

## 📚 Example API Usage

### Health Check
```
GET /api/health
Response: { "status": "healthy" }
```

### Search for Jobs
```
GET /api/jobs?q=python
Response: { "jobs": [ { "title": ..., "company": ..., "link": ... }, ... ] }
```

---

## 📦 Project Structure

- `main.py` - FastAPI app entry point
- `api/routes.py` - API endpoints
- `scraper/__init__.py` - Web scraping logic
- `requirements.txt` - Python dependencies

---

## 📝 License
MIT
