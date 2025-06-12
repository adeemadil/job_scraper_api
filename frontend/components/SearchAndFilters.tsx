import React, { useState, useCallback } from 'react';
import { FiSearch, FiFilter } from 'react-icons/fi';
import { Job, RecentSearch } from '../types';

interface SearchAndFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isLoading: boolean;
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
  locationFilter: string;
  setLocationFilter: (location: string) => void;
  jobTypeFilter: string;
  setJobTypeFilter: (jobType: string) => void;
  experienceLevelFilter: string;
  setExperienceLevelFilter: (level: string) => void;
  handleFormSubmit: (e: React.FormEvent) => void;
  handleApplyFilters: () => void;
  displayRecentSearches: RecentSearch[];
  handleRecentSearchClick: (recent: RecentSearch) => void;
}

const JOB_TYPES = ['Full-time', 'Part-time', 'Contract', 'Freelance'];
const EXPERIENCE_LEVELS = ['Entry-level', 'Mid-level', 'Senior-level', 'Lead'];

const SearchAndFilters: React.FC<SearchAndFiltersProps> = React.memo((
  {
    searchQuery,
    setSearchQuery,
    isLoading,
    showFilters,
    setShowFilters,
    locationFilter,
    setLocationFilter,
    jobTypeFilter,
    setJobTypeFilter,
    experienceLevelFilter,
    setExperienceLevelFilter,
    handleFormSubmit,
    handleApplyFilters,
    displayRecentSearches,
    handleRecentSearchClick,
  }
) => {
  return (
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
              <button
                type="button"
                onClick={handleApplyFilters}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 transition"
              >
                Apply Filters
              </button>
            </div>
          )}
        </div>
      </form>
      {displayRecentSearches.length > 0 && (
        <div className="container mx-auto px-4 mt-4">
          <div className="text-gray-500 dark:text-gray-400 text-sm mb-2">Recent Searches:</div>
          <div className="flex flex-nowrap gap-2 overflow-x-auto pb-1 safari-scroll-hide">
            {displayRecentSearches.map((s) => (
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
  );
});

export default SearchAndFilters; 