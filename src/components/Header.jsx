import { useState } from 'react';
import { FaSearch, FaBars, FaTimes } from 'react-icons/fa';
import { Link } from 'react-router-dom';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-slate-200 shadow-md">
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Brand */}
          <Link to="/" className="shrink-0">
            <h1 className="font-bold text-xl text-slate-700">Propora</h1>
          </Link>

          {/* Search */}
          <form className="bg-slate-100 p-3 rounded-lg flex items-center flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search properties..."
              className="bg-transparent focus:outline-none w-full text-sm"
            />
            <button type="submit" aria-label="Search">
              <FaSearch className="text-slate-600" />
            </button>
          </form>

          {/* Desktop Navigation */}
          <nav className="hidden sm:flex items-center gap-5">
            <Link
              to="/"
              className="text-slate-700 hover:text-slate-900 transition-colors"
            >
              Home
            </Link>

            <Link
              to="/about-us"
              className="text-slate-700 hover:text-slate-900 transition-colors"
            >
              About
            </Link>

            <Link
              to="/sign-in"
              className="text-slate-700 hover:text-slate-900 transition-colors"
            >
              Sign In
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="sm:hidden text-slate-700 text-xl"
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="sm:hidden mt-3 pt-3 border-t border-slate-300 flex flex-col gap-3">
            <Link
              to="/"
              onClick={() => setIsMenuOpen(false)}
              className="text-slate-700 hover:text-slate-900"
            >
              Home
            </Link>

            <Link
              to="/about-us"
              onClick={() => setIsMenuOpen(false)}
              className="text-slate-700 hover:text-slate-900"
            >
              About
            </Link>

            <Link
              to="/sign-in"
              onClick={() => setIsMenuOpen(false)}
              className="text-slate-700 hover:text-slate-900"
            >
              Sign In
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
