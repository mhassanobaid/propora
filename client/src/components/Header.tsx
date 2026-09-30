import { useState, useEffect, type FormEvent } from 'react';
import { FaSearch, FaBars, FaTimes } from 'react-icons/fa';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../app/store';

export default function Header() {
  const { currentUser } = useSelector(
    (state: RootState) => state.user,
  );

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const urlParams = new URLSearchParams(location.search);
    urlParams.set('searchTerm', searchTerm);

    const searchQuery = urlParams.toString();

    navigate(`/search?${searchQuery}`);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');

    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);

  return (
    <header className="bg-slate-200 shadow-md">
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Brand */}
          <Link to="/" className="shrink-0">
            <h1 className="font-bold text-xl text-slate-700">
              Propora
            </h1>
          </Link>

          {/* Search */}
          <form
            onSubmit={handleSubmit}
            className="bg-slate-100 p-3 rounded-lg flex items-center"
          >
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent focus:outline-none w-24 sm:w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <button type="submit">
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

            <Link to="/profile">
              {currentUser ? (
                <img
                  className="rounded-full h-7 w-7 object-cover"
                  src={currentUser.avatar}
                  alt="profile"
                />
              ) : (
                <span className="text-slate-700 hover:underline">
                  Sign in
                </span>
              )}
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
              to="/profile"
              onClick={() => setIsMenuOpen(false)}
            >
              {currentUser ? (
                <img
                  className="rounded-full h-7 w-7 object-cover"
                  src={currentUser.avatar}
                  alt="profile"
                />
              ) : (
                <span className="text-slate-700 hover:underline">
                  Sign in
                </span>
              )}
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
