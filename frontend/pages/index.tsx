import React, { useState, useEffect, useCallback } from 'react';
import Head from 'next/head';
import { FiSearch, FiFilter, FiSun, FiMoon } from 'react-icons/fi';
import JobSkeleton from '../components/JobSkeleton';
import JobCard from '../components/JobCard';
import Pagination from '../components/Pagination';

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
  timestamp: number;
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

const HomePage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [jobResults, setJobResults] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState('');
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [locationFilter, setLocationFilter] = useState('');
  const [jobTypeFilter, setJobTypeFilter] = useState('');
  const [experienceLevelFilter, setExperienceLevelFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 9;

  // Calculate jobs to display for the current page
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = jobResults.slice(indexOfFirstJob, indexOfLastJob);
  const totalPages = Math.ceil(jobResults.length / jobsPerPage);

  // Change page
  const paginate = useCallback((pageNumber: number) => {
    setCurrentPage(pageNumber);
  }, []);

  // Load recent searches and dark mode preference from localStorage on mount
  useEffect(() => {
    const storedSearches = localStorage.getItem('recentSearches');
    if (storedSearches) {
      setRecentSearches(JSON.parse(storedSearches));
    }

    const storedDarkMode = localStorage.getItem('darkMode');
    if (storedDarkMode) {
      setIsDarkMode(JSON.parse(storedDarkMode));
    }
  }, []);

  // Save recent searches to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('recentSearches', JSON.stringify(recentSearches));
  }, [recentSearches]);

  // Apply dark mode to document element and save preference
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  const handleSearch = useCallback(async (query: string) => {
    setIsLoading(true);
    setFetchError('');
    setJobResults([]); // Clear previous jobs to show skeletons immediately

    // Construct query parameters
    const params = new URLSearchParams();
    params.append('q', query);
    if (locationFilter) params.append('location', locationFilter);
    if (jobTypeFilter) params.append('job_type', jobTypeFilter);
    if (experienceLevelFilter) params.append('experience_level', experienceLevelFilter);

    const queryString = params.toString();

    const foundRecentSearch = recentSearches.find(
      (s) =>
        s.query === query &&
        s.location === locationFilter &&
        s.jobType === jobTypeFilter &&
        s.experienceLevel === experienceLevelFilter
    );
    const now = Date.now();

    if (foundRecentSearch && now - foundRecentSearch.timestamp < 5 * 60 * 1000) { // 5 minutes
      setJobResults(foundRecentSearch.jobs);
      setCurrentPage(1); // Reset to first page on new search
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`/api/jobs?${queryString}`);
      const data = await response.json();
      setJobResults(data.jobs);
      setCurrentPage(1); // Reset to first page on new search
      setRecentSearches((prevSearches) => {
        const newSearchEntry = {
          query,
          jobs: data.jobs,
          timestamp: now,
          location: locationFilter,
          jobType: jobTypeFilter,
          experienceLevel: experienceLevelFilter,
        };
        const filteredSearches = prevSearches.filter(
          (s) =>
            !(s.query === query &&
              s.location === locationFilter &&
              s.jobType === jobTypeFilter &&
              s.experienceLevel === experienceLevelFilter)
        );
        return [newSearchEntry, ...filteredSearches].slice(0, 15); // Limit to 15 recent searches
      });
    } catch (err) {
      setFetchError('Failed to fetch jobs. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [locationFilter, jobTypeFilter, experienceLevelFilter, recentSearches]);

  const handleFormSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(searchQuery);
  }, [searchQuery, handleSearch]);

  const handleRecentSearchClick = useCallback((recent: RecentSearch) => {
    setSearchQuery(recent.query);
    setLocationFilter(recent.location || '');
    setJobTypeFilter(recent.jobType || '');
    setExperienceLevelFilter(recent.experienceLevel || '');
    handleSearch(recent.query);
  }, [handleSearch]);

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
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
            aria-label="Toggle dark mode"
          >
            {isDarkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
          </button>
        </div>
      </header>

      {/* Search Bar and Filters */}
      <section className="w-full bg-gray-50 dark:bg-gray-900 py-6 transition-colors duration-200">
        <form onSubmit={handleFormSubmit} className="container mx-auto flex flex-col md:flex-row items-center gap-4 px-4">
          <div className="flex flex-1 items-center bg-white dark:bg-gray-800 rounded-lg shadow px-4 py-3 ring-blue-500/50 dark:ring-blue-400/50 focus-within:ring-2 focus-within:shadow-lg transition-all duration-200">
            <FiSearch className="text-gray-400 mr-2 text-xl" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for jobs (e.g., Software Engineer, React)"
              className="flex-1 bg-transparent outline-none text-gray-700 dark:text-gray-300 text-base placeholder-gray-400 dark:placeholder-gray-500"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
          >
            {isLoading ? 'Searching...' : 'Search'}
          </button>
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-5 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
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
                    value={locationFilter}
                    onChange={(e) => setLocationFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    placeholder="e.g., New York"
                  />
                </div>
                <div>
                  <label htmlFor="jobType" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Job Type</label>
                  <select
                    id="jobType"
                    value={jobTypeFilter}
                    onChange={(e) => setJobTypeFilter(e.target.value)}
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
                    value={experienceLevelFilter}
                    onChange={(e) => setExperienceLevelFilter(e.target.value)}
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
            <div className="flex flex-nowrap gap-2 overflow-x-auto pb-1 safari-scroll-hide">
              {recentSearches.map((s) => (
                <button
                  key={s.query}
                  onClick={() => handleRecentSearchClick(s)}
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
      {fetchError && (
        <div className="container mx-auto px-4 mb-4">
          <div className="p-4 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded-lg text-center transition-colors duration-200">
            {fetchError}
          </div>
        </div>
      )}

      {/* Job Cards Grid */}
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading && Array.from({ length: jobsPerPage }).map((_, i) => <JobSkeleton key={i} />)}
          {jobResults.length === 0 && !isLoading && (
            <p className="col-span-full text-center text-gray-400 dark:text-gray-500 text-lg">No jobs found. Try searching above.</p>
          )}
          {Array.isArray(currentJobs) && currentJobs.map((job, index) => (
            typeof job.title === 'string' && typeof job.company === 'string' && typeof job.link === 'string' && typeof job.source === 'string' ? (
              <JobCard key={index} job={job} />
            ) : null
          ))}
        </div>

        {/* Pagination */}
        {jobResults.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            paginate={paginate}
            loading={isLoading}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="w-full bg-gray-100 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-8 py-6 transition-colors duration-200">
        <div className="container mx-auto px-4 text-center text-gray-500 dark:text-gray-400 text-sm">
          © {new Date().getFullYear()} Remote Job Search. All rights reserved.<br />
          <a href="#" className="underline hover:text-blue-600 dark:hover:text-blue-400">Privacy Policy</a> | <a href="#" className="underline hover:text-blue-600 dark:hover:text-blue-400">Terms of Service</a>
        </div>
      </footer>
    </div>
  );
};

export default HomePage; 