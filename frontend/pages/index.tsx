import React, { useState, useEffect, useCallback } from 'react';
import Head from 'next/head';

import Header from '../components/Header';
import SearchAndFilters from '../components/SearchAndFilters';
import JobListing from '../components/JobListing';
import AppFooter from '../components/AppFooter';
import { Job, RecentSearch } from '../types';

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

  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 9;

  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = jobResults.slice(indexOfFirstJob, indexOfLastJob);
  const totalPages = Math.ceil(jobResults.length / jobsPerPage);

  const displayRecentSearches = React.useMemo(() => {
    const uniqueQueries = new Map<string, RecentSearch>();
    recentSearches.forEach((search) => {
      const existingSearch = uniqueQueries.get(search.query);
      if (!existingSearch || search.timestamp > existingSearch.timestamp) {
        uniqueQueries.set(search.query, search);
      }
    });
    const sortedSearches = Array.from(uniqueQueries.values()).sort((a, b) => b.timestamp - a.timestamp);
    return sortedSearches;
  }, [recentSearches]);

  const paginate = useCallback((pageNumber: number) => {
    setCurrentPage(pageNumber);
  }, []);

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

  useEffect(() => {
    localStorage.setItem('recentSearches', JSON.stringify(recentSearches));
  }, [recentSearches]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  const handleSearch = useCallback(async (
    query: string,
    loc?: string,
    jt?: string,
    el?: string
  ) => {
    setIsLoading(true);
    setFetchError('');
    setJobResults([]);

    const currentLoc = loc !== undefined ? loc : locationFilter;
    const currentJt = jt !== undefined ? jt : jobTypeFilter;
    const currentEl = el !== undefined ? el : experienceLevelFilter;

    const params = new URLSearchParams();
    params.append('q', query);
    if (currentLoc) params.append('location', currentLoc);
    if (currentJt) params.append('job_type', currentJt);
    if (currentEl) params.append('experience_level', currentEl);

    const queryString = params.toString();

    const foundRecentSearch = recentSearches.find(
      (s) =>
        s.query === query &&
        s.location === currentLoc &&
        s.jobType === currentJt &&
        s.experienceLevel === currentEl
    );
    const now = Date.now();

    if (foundRecentSearch && now - foundRecentSearch.timestamp < 5 * 60 * 1000) {
      setJobResults(foundRecentSearch.jobs);
      setCurrentPage(1);
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`/api/jobs?${queryString}`);
      const data = await response.json();
      setJobResults(data.jobs);
      setCurrentPage(1);
      setRecentSearches((prevSearches) => {
        const newSearchEntry = {
          query,
          jobs: data.jobs,
          timestamp: now,
          location: currentLoc,
          jobType: currentJt,
          experienceLevel: currentEl,
        };
        const filteredSearches = prevSearches.filter(
          (s) =>
            !(s.query === query &&
              s.location === currentLoc &&
              s.jobType === currentJt &&
              s.experienceLevel === currentEl)
        );
        return [newSearchEntry, ...filteredSearches].slice(0, 15);
      });
    } catch (err) {
      setFetchError('Failed to fetch jobs. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [recentSearches, locationFilter, jobTypeFilter, experienceLevelFilter]);

  const handleFormSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(searchQuery, locationFilter, jobTypeFilter, experienceLevelFilter);
  }, [searchQuery, locationFilter, jobTypeFilter, experienceLevelFilter, handleSearch]);

  const handleRecentSearchClick = useCallback((recent: RecentSearch) => {
    setSearchQuery(recent.query);
    setLocationFilter(recent.location || '');
    setJobTypeFilter(recent.jobType || '');
    setExperienceLevelFilter(recent.experienceLevel || '');
    handleSearch(recent.query, recent.location, recent.jobType, recent.experienceLevel);
  }, [handleSearch]);

  const handleApplyFilters = useCallback(() => {
    handleSearch(searchQuery, locationFilter, jobTypeFilter, experienceLevelFilter);
    setShowFilters(false);
  }, [searchQuery, locationFilter, jobTypeFilter, experienceLevelFilter, handleSearch]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <Head>
        <title>Remote Job Search</title>
        <meta name="description" content="Search for remote jobs" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />

      <SearchAndFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        isLoading={isLoading}
        showFilters={showFilters}
        setShowFilters={setShowFilters}
        locationFilter={locationFilter}
        setLocationFilter={setLocationFilter}
        jobTypeFilter={jobTypeFilter}
        setJobTypeFilter={setJobTypeFilter}
        experienceLevelFilter={experienceLevelFilter}
        setExperienceLevelFilter={setExperienceLevelFilter}
        handleFormSubmit={handleFormSubmit}
        handleApplyFilters={handleApplyFilters}
        displayRecentSearches={displayRecentSearches}
        handleRecentSearchClick={handleRecentSearchClick}
      />

      <JobListing
        isLoading={isLoading}
        jobResults={jobResults}
        currentJobs={currentJobs}
        jobsPerPage={jobsPerPage}
        totalPages={totalPages}
        currentPage={currentPage}
        paginate={paginate}
        fetchError={fetchError}
      />

      <AppFooter />
    </div>
  );
};

export default HomePage; 