import React from 'react';

const JobSkeleton = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 flex flex-col justify-between min-h-[220px] animate-pulse transition-colors duration-200">
      <div className="space-y-4">
        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
      </div>
      <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg w-full mt-4"></div>
    </div>
  );
};

export default JobSkeleton; 