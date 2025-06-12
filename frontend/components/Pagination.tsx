import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  paginate: (pageNumber: number) => void;
  loading: boolean;
}

const Pagination: React.FC<PaginationProps> = React.memo(({ currentPage, totalPages, paginate, loading }) => {
  return (
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
  );
});

export default Pagination; 