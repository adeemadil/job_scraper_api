import { useState, useEffect } from 'react';
import Head from 'next/head';
import { FiSearch, FiFilter } from 'react-icons/fi';

interface Job {
  title: string;
  company: string;
  link: string;
  source: string;
  description?: string;
}

interface RecentSearch {
  query: string;
  jobs: Job[];
  timestamp: number; // ms since epoch
}

const NAV_LINKS = [
  { name: 'Jobs', href: '#' },
  { name: 'Companies', href: '#' },
  { name: 'About', href: '#' },
  { name: 'Contact', href: '#' },
];

export default function Home() {
  const [query, setQuery] = useState('');
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([]);
  // Pagination (static for now)
  const [page] = useState(1);

  // Load recent searches from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('recentSearches');
    if (stored) {
      setRecentSearches(JSON.parse(stored));
    }
  }, []);

  // Save recent searches to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('recentSearches', JSON.stringify(recentSearches));
  }, [recentSearches]);

  const searchJobs = async (searchQuery: string) => {
    setLoading(true);
    setError('');

    const found = recentSearches.find((s) => s.query === searchQuery);
    const now = Date.now();
    if (found && now - found.timestamp < 5 * 60 * 1000) { // 5 minutes
      setJobs(found.jobs);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`/api/jobs?q=${encodeURIComponent(searchQuery)}`);
      const data = await response.json();
      setJobs(data.jobs);
      setRecentSearches((prev) => {
        const filtered = prev.filter((s) => s.query !== searchQuery);
        return [
          { query: searchQuery, jobs: data.jobs, timestamp: now },
          ...filtered
        ].slice(0, 15); // Limit to 15 recent searches
      });
    } catch (err) {
      setError('Failed to fetch jobs. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    searchJobs(query);
  };

  const handleRecentClick = (recent: RecentSearch) => {
    setQuery(recent.query);
    searchJobs(recent.query);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Head>
        <title>Remote Job Search</title>
        <meta name="description" content="Search for remote jobs" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Header */}
      <header className="w-full bg-white shadow-sm">
        <div className="container mx-auto flex justify-between items-center py-4 px-4">
          <span className="text-2xl font-bold text-blue-600">Remote Job Search</span>
          <nav className="space-x-8 hidden md:block">
            {NAV_LINKS.map((link) => (
              <a key={link.name} href={link.href} className="text-gray-700 hover:text-blue-600 font-medium">
                {link.name}
              </a>
            ))}
          </nav>
        </div>
      </header>

      {/* Search Bar */}
      <section className="w-full bg-gray-50 py-6">
        <form onSubmit={handleSubmit} className="container mx-auto flex flex-col md:flex-row items-center gap-4 px-4">
          <div className="flex flex-1 items-center bg-white rounded-lg shadow px-4 py-3">
            <FiSearch className="text-gray-400 mr-2 text-xl" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for jobs (e.g., Software Engineer, React)"
              className="flex-1 bg-transparent outline-none text-gray-700 text-base"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
          <button
            type="button"
            className="flex items-center gap-2 px-5 py-3 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 transition"
            tabIndex={-1}
          >
            <FiFilter size={20} className="text-gray-500" />
            <span className="text-gray-700 font-medium">Filters</span>
          </button>
        </form>
        {/* Recent Searches */}
        {recentSearches.length > 0 && (
          <div className="container mx-auto px-4 mt-4">
            <div className="text-gray-500 text-sm mb-2">Recent Searches:</div>
            <div className="flex flex-nowrap gap-2 overflow-x-auto pb-1" style={{ WebkitOverflowScrolling: 'touch' }}>
              {recentSearches.map((s) => (
                <button
                  key={s.query}
                  onClick={() => handleRecentClick(s)}
                  className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm hover:bg-blue-200 transition whitespace-nowrap"
                >
                  {s.query}
                </button>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Error */}
      {error && (
        <div className="container mx-auto px-4 mb-4">
          <div className="p-4 bg-red-100 text-red-700 rounded-lg text-center">
            {error}
          </div>
        </div>
      )}

      {/* Job Cards Grid */}
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.length === 0 && !loading && (
            <div className="col-span-full text-center text-gray-400 text-lg">No jobs found. Try searching above.</div>
          )}
          {Array.isArray(jobs) && jobs.map((job, index) => (
            typeof job.title === 'string' && typeof job.company === 'string' && typeof job.link === 'string' && typeof job.source === 'string' ? (
              <div key={index} className="bg-white rounded-xl shadow p-6 flex flex-col justify-between min-h-[220px]">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-lg font-bold text-gray-900">{job.title}</h2>
                    <span className="bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">
                      {job.source}
                    </span>
                  </div>
                  <div className="text-gray-600 font-medium mb-2">{job.company}</div>
                  {job.description && (
                    <div className="text-gray-500 text-sm mb-4 line-clamp-2">{job.description}</div>
                  )}
                </div>
                <a
                  href={job.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 w-full inline-block text-center bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  Apply
                </a>
              </div>
            ) : null
          ))}
        </div>

        {/* Pagination (static, for demo) */}
        <div className="flex justify-center mt-10">
          <nav className="inline-flex items-center gap-2">
            <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-200 text-gray-500" disabled>
              &lt;
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded bg-blue-600 text-white font-bold">{page}</button>
            <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-200 text-gray-500">
              &gt;
            </button>
          </nav>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full bg-gray-100 border-t mt-8 py-6">
        <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
          © 2023 Remote Job Search. All rights reserved.<br />
          <a href="#" className="underline hover:text-blue-600">Privacy Policy</a> | <a href="#" className="underline hover:text-blue-600">Terms of Service</a>
        </div>
      </footer>
    </div>
  );
} 