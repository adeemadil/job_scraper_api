import React from 'react';
import { FiSun, FiMoon } from 'react-icons/fi';

interface HeaderProps {
  isDarkMode: boolean;
  setIsDarkMode: (darkMode: boolean) => void;
}

const NAV_LINKS = [
  { name: 'Jobs', href: '#' },
  { name: 'Companies', href: '#' },
  { name: 'About', href: '#' },
  { name: 'Contact', href: '#' },
];

const Header: React.FC<HeaderProps> = ({ isDarkMode, setIsDarkMode }) => {
  return (
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
  );
};

export default Header; 