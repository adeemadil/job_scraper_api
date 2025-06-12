import React from 'react';

const AppFooter: React.FC = () => {
  return (
    <footer className="w-full bg-gray-100 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-8 py-6 transition-colors duration-200">
      <div className="container mx-auto px-4 text-center text-gray-500 dark:text-gray-400 text-sm">
        © {new Date().getFullYear()} Remote Job Search. All rights reserved.<br />
        <a href="#" className="underline hover:text-blue-600 dark:hover:text-blue-400">Privacy Policy</a> | <a href="#" className="underline hover:text-blue-600 dark:hover:text-blue-400">Terms of Service</a>
      </div>
    </footer>
  );
};

export default AppFooter; 