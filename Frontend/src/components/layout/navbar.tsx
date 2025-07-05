import { useState } from 'react';
import { Link } from 'react-router-dom';
import ThemeToggle from '../mini-components/theme-toggle';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        <Link 
          to="/" 
          className="text-2xl font-bold bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text  inline-block"
        >
          Travel AI
        </Link>

        {/* Mobile menu button */}
        <button
          className="md:hidden p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          aria-label="Toggle menu"
          onClick={() => setIsOpen(!isOpen)}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {isOpen
              ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8h16M4 16h16" />}
          </svg>
        </button>

        {/* Desktop menu */}
        <nav className="hidden md:flex items-center gap-8">
          <div className="flex gap-6">
            <Link 
              to="#features" 
              className="text-gray-600 dark:text-gray-300 hover:text-green-500 dark:hover:text-green-400 transition-colors font-medium"
            >
              Features
            </Link>
            <Link 
              to="#about" 
              className="text-gray-600 dark:text-gray-300 hover:text-green-500 dark:hover:text-green-400 transition-colors font-medium"
            >
              About
            </Link>
            <Link 
              to="#contact" 
              className="text-gray-600 dark:text-gray-300 hover:text-green-500 dark:hover:text-green-400 transition-colors font-medium"
            >
              Contact
            </Link>
          </div>
          
          <div className="flex items-center gap-4 ml-4">
            <Link 
              to="/signin" 
              className="px-4 py-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors font-medium"
            >
              Sign in
            </Link>
            <Link 
              to="/signup" 
              className="px-4 py-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors font-medium"
            >
              Sign up
            </Link>
            <ThemeToggle />
          </div>
        </nav>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden px-6 transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'max-h-96 py-4' : 'max-h-0 py-0'}`}>
        <div className="flex flex-col gap-4">
          <Link 
            to="#features" 
            className="py-2 text-gray-600 dark:text-gray-300 hover:text-green-500 dark:hover:text-green-400 transition-colors font-medium"
            onClick={() => setIsOpen(false)}
          >
            Features
          </Link>
          <Link 
            to="#about" 
            className="py-2 text-gray-600 dark:text-gray-300 hover:text-green-500 dark:hover:text-green-400 transition-colors font-medium"
            onClick={() => setIsOpen(false)}
          >
            About
          </Link>
          <Link 
            to="#contact" 
            className="py-2 text-gray-600 dark:text-gray-300 hover:text-green-500 dark:hover:text-green-400 transition-colors font-medium"
            onClick={() => setIsOpen(false)}
          >
            Contact
          </Link>
          
          <div className="flex flex-col gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
            <Link 
              to="/signin" 
              className="w-full py-2 text-center rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors font-medium"
              onClick={() => setIsOpen(false)}
            >
              Sign in
            </Link>
            <Link 
              to="/signup" 
              className="w-full py-2 text-center rounded-md bg-gradient-to-r from-green-500 to-blue-500 text-white font-medium hover:opacity-90 transition-opacity"
              onClick={() => setIsOpen(false)}
            >
              Sign up
            </Link>
          </div>
          
          <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;