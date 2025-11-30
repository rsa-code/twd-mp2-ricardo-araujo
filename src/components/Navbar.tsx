import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Characters', href: '/characters' },
    { name: 'Anime Episodes', href: '/jikan-episodes' },
    { name: 'Manga Volumes', href: '/nana-volumes' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800 py-4' : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex justify-between items-center">
          <Link to="/" className="group text-4xl font-black font-cinzel text-zinc-100 tracking-tighter hover:text-rose-600 transition-colors">
            NANA
          <span className="text-rose-600 group-hover:text-white transition-colors">
              .
          </span>
          </Link>

        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.href}
              className={`text-sm font-medium uppercase tracking-widest transition-colors ${
                location.pathname === link.href ? 'text-rose-600' : 'text-zinc-400 hover:text-rose-600'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        <button
          className="md:hidden text-zinc-100 hover:text-rose-600 transition-colors"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-zinc-950 border-b border-zinc-800 md:hidden">
          <div className="flex flex-col p-4 space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className={`font-medium uppercase tracking-widest transition-colors ${
                  location.pathname === link.href ? 'text-rose-600' : 'text-zinc-400 hover:text-rose-600'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};
