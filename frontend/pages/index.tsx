import { useState, useEffect } from 'react';
import Head from 'next/head';
import { FiSearch, FiFilter, FiSun, FiMoon } from 'react-icons/fi';
import JobSkeleton from '../components/JobSkeleton';

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
  location?: string;
  jobType?: string;
  experienceLevel?: string;
}

const NAV_LINKS = [
  { name: 'Jobs', href: '#' },
  { name: 'Companies', href: '#' },
  { name: 'About', href: '#' },
  { name: 'Contact', href: '#' },
];

const JOB_TYPES = ['Full-time', 'Part-time', 'Contract', 'Freelance'];
const EXPERIENCE_LEVELS = ['Entry-level', 'Mid-level', 'Senior-level', 'Lead'];
// For simplicity, locations are not pre-defined, as they can be too varied.

export default function Home() {
  const [query, setQuery] = useState('');
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([]);
  const [darkMode, setDarkMode] = useState(false);
  const [location, setLocation] = useState('');
  const [jobType, setJobType] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 9;

  // Calculate jobs to display for the current page
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = jobs.slice(indexOfFirstJob, indexOfLastJob);
  const totalPages = Math.ceil(jobs.length / jobsPerPage);

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Load recent searches and dark mode preference from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('recentSearches');
    if (stored) {
      setRecentSearches(JSON.parse(stored));
    }

    const storedDarkMode = localStorage.getItem('darkMode');
    if (storedDarkMode) {
      setDarkMode(JSON.parse(storedDarkMode));
    }
  }, []);

  // Save recent searches to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('recentSearches', JSON.stringify(recentSearches));
  }, [recentSearches]);

  // Apply dark mode to document element and save preference
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  const searchJobs = async (searchQuery: string) => {
    setLoading(true);
    setError('');
    setJobs([]); // Clear previous jobs to show skeletons immediately

    // Construct query parameters
    const params = new URLSearchParams();
    params.append('q', searchQuery);
    if (location) params.append('location', location);
    if (jobType) params.append('job_type', jobType);
    if (experienceLevel) params.append('experience_level', experienceLevel);

    const queryString = params.toString();

    const found = recentSearches.find((s) => s.query === searchQuery && s.location === location && s.jobType === jobType && s.experienceLevel === experienceLevel);
    const now = Date.now();
    if (found && now - found.timestamp < 5 * 60 * 1000) { // 5 minutes
      setJobs(found.jobs);
      setCurrentPage(1); // Reset to first page on new search
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`/api/jobs?${queryString}`);
      const data = await response.json();
      setJobs(data.jobs);
      setCurrentPage(1); // Reset to first page on new search
      setRecentSearches((prev) => {
        const newSearch = { query: searchQuery, jobs: data.jobs, timestamp: now, location, jobType, experienceLevel };
        const filtered = prev.filter((s) => 
          !(s.query === searchQuery && s.location === location && s.jobType === jobType && s.experienceLevel === experienceLevel)
        );
        return [newSearch, ...filtered].slice(0, 15); // Limit to 15 recent searches
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
    setLocation(recent.location || '');
    setJobType(recent.jobType || '');
    setExperienceLevel(recent.experienceLevel || '');
    searchJobs(recent.query);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <Head>
        <title>Remote Job Search</title>
        <meta name="description" content="Search for remote jobs" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Header */}
      <header className="w-full bg-white/80 dark:bg-gray-800/80 shadow-sm sticky top-0 z-10 backdrop-blur-lg transition-colors duration-200">
        <div className="container mx-auto flex justify-between items-center py-4 px-4">
          <span className="text-2xl font-bold text-blue-600">Remote Job Search</span>
          <nav className="space-x-8 hidden md:block">
            {NAV_LINKS.map((link) => (
              <a key={link.name} href={link.href} className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium relative nav-link">
                {link.name}
              </a>
            ))}
          </nav>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
            aria-label="Toggle dark mode"
          >
            {darkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
          </button>
        </div>
      </header>

      {/* Search Bar and Filters */}
      <section className="w-full bg-gray-50 dark:bg-gray-900 py-6 transition-colors duration-200">
        <form onSubmit={handleSubmit} className="container mx-auto flex flex-col md:flex-row items-center gap-4 px-4">
          <div className="flex flex-1 items-center bg-white dark:bg-gray-800 rounded-lg shadow px-4 py-3 ring-blue-500/50 dark:ring-blue-400/50 focus-within:ring-2 focus-within:shadow-lg transition-all duration-200">
            <FiSearch className="text-gray-400 mr-2 text-xl" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for jobs (e.g., Software Engineer, React)"
              className="flex-1 bg-transparent outline-none text-gray-700 dark:text-gray-300 text-base placeholder-gray-400 dark:placeholder-gray-500"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-5 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
              tabIndex={-1}
            >
              <FiFilter size={20} className="text-gray-500 dark:text-gray-400" />
              <span className="text-gray-700 dark:text-gray-300 font-medium">Filters</span>
            </button>
            {/* Dropdown Filters */}
            {showFilters && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg z-20 p-4 space-y-3">
                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Location</label>
                  <input
                    type="text"
                    id="location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    placeholder="e.g., New York"
                  />
                </div>
                <div>
                  <label htmlFor="jobType" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Job Type</label>
                  <select
                    id="jobType"
                    value={jobType}
                    onChange={(e) => setJobType(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  >
                    <option value="">Any</option>
                    {JOB_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="experienceLevel" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Experience Level</label>
                  <select
                    id="experienceLevel"
                    value={experienceLevel}
                    onChange={(e) => setExperienceLevel(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  >
                    <option value="">Any</option>
                    {EXPERIENCE_LEVELS.map(level => <option key={level} value={level}>{level}</option>)}
                  </select>
                </div>
              </div>
            )}
          </div>
        </form>
        {/* Recent Searches */}
        {recentSearches.length > 0 && (
          <div className="container mx-auto px-4 mt-4">
            <div className="text-gray-500 dark:text-gray-400 text-sm mb-2">Recent Searches:</div>
            <div className="flex flex-nowrap gap-2 overflow-x-auto pb-1" style={{ WebkitOverflowScrolling: 'touch' }}>
              {recentSearches.map((s) => (
                <button
                  key={s.query}
                  onClick={() => handleRecentClick(s)}
                  className="px-3 py-1 bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-200 rounded-full text-sm hover:bg-blue-200 dark:hover:bg-blue-700 transition-colors duration-200 whitespace-nowrap"
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
          <div className="p-4 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded-lg text-center transition-colors duration-200">
            {error}
          </div>
        </div>
      )}

      {/* Job Cards Grid */}
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading && Array.from({ length: jobsPerPage }).map((_, i) => <JobSkeleton key={i} />)}
          {jobs.length === 0 && !loading && (
            <div className="col-span-full text-center text-gray-400 dark:text-gray-500 text-lg">No jobs found. Try searching above.</div>
          )}
          {Array.isArray(currentJobs) && currentJobs.map((job, index) => (
            typeof job.title === 'string' && typeof job.company === 'string' && typeof job.link === 'string' && typeof job.source === 'string' ? (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 flex flex-col justify-between min-h-[220px] transition-colors duration-200">
                <div className="flex flex-col flex-grow space-y-2">
                  <div className="flex items-start justify-between min-h-[3em]">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 leading-tight">{job.title}</h2>
                    <span className="bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-200 text-xs font-semibold px-3 py-1 rounded-full transition-colors duration-200 flex-shrink-0 whitespace-nowrap ml-2">
                      {job.source}
                    </span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 font-medium">{job.company}</p>
                  <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-2 min-h-[2.5em]">
                    {job.description}
                  </p>
                </div>
                <a
                  href={job.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 w-full inline-block text-center bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                >
                  Apply
                </a>
              </div>
            ) : null
          ))}
        </div>

        {/* Pagination */}
        {jobs.length > 0 && (
          <div className="flex justify-center mt-10">
            <nav className="inline-flex items-center gap-2">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1 || loading}
                className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition-colors duration-200"
              >
                &lt;
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                <button
                  key={number}
                  onClick={() => paginate(number)}
                  className={`w-8 h-8 flex items-center justify-center rounded ${currentPage === number ? 'bg-blue-600 text-white font-bold' : 'hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400'} transition-colors duration-200`}
                  disabled={loading}
                >
                  {number}
                </button>
              ))}
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages || loading}
                className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition-colors duration-200"
              >
                &gt;
              </button>
            </nav>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="w-full bg-gray-100 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-8 py-6 transition-colors duration-200">
        <div className="container mx-auto px-4 text-center text-gray-500 dark:text-gray-400 text-sm">
          © 2023 Remote Job Search. All rights reserved.<br />
          <a href="#" className="underline hover:text-blue-600 dark:hover:text-blue-400">Privacy Policy</a> | <a href="#" className="underline hover:text-blue-600 dark:hover:text-blue-400">Terms of Service</a>
        </div>
      </footer>
    </div>
  );
} 