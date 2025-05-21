import pytest
from unittest.mock import patch
from scraper import scrape_jobs

MOCK_HTML = '''
<table>
<tr class="job">
  <td>
    <a class="preventLink" href="/remote-jobs/1234">
      <h2 itemprop="title">Python Developer</h2>
      <h3 itemprop="name">Acme Corp</h3>
    </a>
  </td>
</tr>
<tr class="job">
  <td>
    <a class="preventLink" href="/remote-jobs/5678">
      <h2 itemprop="title">Data Engineer</h2>
      <h3 itemprop="name">Data Inc</h3>
    </a>
  </td>
</tr>
</table>
'''

class MockResponse:
    def __init__(self, text, status_code=200):
        self.text = text
        self.status_code = status_code

def test_scrape_jobs_success():
    with patch('scraper.requests.get') as mock_get:
        mock_get.return_value = MockResponse(MOCK_HTML)
        jobs = scrape_jobs('python')
        assert len(jobs) == 2
        assert jobs[0]['title'] == 'Python Developer'
        assert jobs[0]['company'] == 'Acme Corp'
        assert jobs[0]['link'] == 'https://remoteok.com/remote-jobs/1234'
        assert jobs[1]['title'] == 'Data Engineer'
        assert jobs[1]['company'] == 'Data Inc'
        assert jobs[1]['link'] == 'https://remoteok.com/remote-jobs/5678'

def test_scrape_jobs_non_200():
    with patch('scraper.requests.get') as mock_get:
        mock_get.return_value = MockResponse('', status_code=404)
        jobs = scrape_jobs('python')
        assert jobs == []
