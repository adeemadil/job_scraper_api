import React from 'react';

interface JobCardProps {
  job: {
    title: string;
    company: string;
    link: string;
    source: string;
    description?: string;
  };
}

const JobCard: React.FC<JobCardProps> = ({ job }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 flex flex-col justify-between min-h-[220px] transition-colors duration-200">
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
  );
};

export default JobCard; 