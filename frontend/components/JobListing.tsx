import React from 'react';
import JobSkeleton from './JobSkeleton';
import JobCard from './JobCard';
import Pagination from './Pagination';
import { Job } from '../types';

interface JobListingProps {
  isLoading: boolean;
  jobResults: Job[];
  currentJobs: Job[];
  jobsPerPage: number;
  totalPages: number;
  currentPage: number;
  paginate: (pageNumber: number) => void;
  fetchError: string;
}

const JobListing: React.FC<JobListingProps> = React.memo((
  {
    isLoading,
    jobResults,
    currentJobs,
    jobsPerPage,
    totalPages,
    currentPage,
    paginate,
    fetchError,
  }
) => {
  return (
    <main className="flex-1 container mx-auto px-4 py-8">
      {fetchError && (
        <div className="container mx-auto px-4 mb-4">
          <div className="p-4 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded-lg text-center transition-colors duration-200">
            {fetchError}
          </div>
        </div>
      )}

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

      {jobResults.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          paginate={paginate}
          loading={isLoading}
        />
      )}
    </main>
  );
});

export default JobListing; 