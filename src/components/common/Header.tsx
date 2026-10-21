import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useSite } from '../../context/SiteContext';
import {
  Menu,
  X,
  Cpu,
  User,
  ShieldCheck,
  LogOut,
  FolderKanban,
  Wrench,
  Globe,
  ChevronDown,
} from 'lucide-react';

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const location = useLocation();
  const { currentUser, isAdmin, logOut } = useAuth();
  const { settings, language, setLanguage } = useSite();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About Me', path: '/about' },
    { name: 'Portfolio', path: '/portfolio' },
    { name: 'Services', path: '/services' },
    { name: 'Skills & Tech', path: '/skills' },
    { name: 'Profiles', path: '/profiles' },
    { name: 'Contact Me', path: '/contact' },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-50 bg-[#070B12]/90 backdrop-blur-md border-b border-[#00D5FF]/15 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Brand Name */}
          <Link to="/" className="flex items-center space-x-3 group">
            {settings.logoUrl ? (
              <img
                src={settings.logoUrl}
                alt={settings.brandName}
                className="h-10 w-auto object-contain rounded"
              />
            ) : (
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#00D5FF] to-[#3B82F6] flex items-center justify-center text-[#070B12] shadow-lg shadow-[#00D5FF]/20 group-hover:scale-105 transition-transform">
                <Cpu className="w-6 h-6 stroke-[2.2]" />
              </div>
            )}
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-wider text-[#F5F7FA] group-hover:text-[#00D5FF] transition-colors">
                {settings.brandName || 'ZIHAD AUTIVEX'}
              </span>
              <span className="text-[10px] tracking-widest text-[#00D5FF] uppercase font-semibold">
                {settings.brandSubtitle || 'AI AUTOMATION SERVICE'}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-all ${
                  isActive(link.path)
                    ? 'text-[#00D5FF] bg-[#111B2A] border border-[#00D5FF]/30 shadow-sm'
                    : 'text-[#A0AEC0] hover:text-[#F5F7FA] hover:bg-[#0D1420]'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Language toggle */}
            <button
              onClick={() => setLanguage(language === 'en' ? 'bn' : 'en')}
              className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-[#111B2A] border border-white/10 text-[#A0AEC0] hover:text-[#00D5FF] transition"
              title="Toggle English / বাংলা"
            >
              <Globe className="w-3.5 h-3.5 text-[#00D5FF]" />
              <span>{language === 'en' ? 'EN' : 'বাং'}</span>
            </button>

            {/* Auth / Account */}
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-[#111B2A] border border-[#00D5FF]/30 text-sm text-[#F5F7FA] hover:border-[#00D5FF] transition"
                >
                  <div className="w-6 h-6 rounded-full bg-[#00D5FF]/20 text-[#00D5FF] flex items-center justify-center font-bold text-xs">
                    {currentUser.displayName ? currentUser.displayName[0].toUpperCase() : 'U'}
                  </div>
                  <span className="max-w-[100px] truncate text-xs font-medium">
                    {currentUser.displayName || currentUser.email?.split('@')[0]}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-[#A0AEC0]" />
                </button>

                {userDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-52 rounded-xl bg-[#111B2A] border border-[#00D5FF]/20 shadow-2xl py-2 z-50 backdrop-blur-xl"
                    onMouseLeave={() => setUserDropdownOpen(false)}
                  >
                    <div className="px-4 py-2 border-b border-white/10">
                      <p className="text-xs text-[#A0AEC0]">Signed in as</p>
                      <p className="text-xs font-medium text-[#F5F7FA] truncate">{currentUser.email}</p>
                      {isAdmin && (
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-[#00D5FF]/20 text-[#00D5FF] mt-1">
                          Administrator
                        </span>
                      )}
                    </div>

                    <Link
                      to="/dashboard"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center space-x-2 px-4 py-2 text-xs text-[#A0AEC0] hover:text-[#00D5FF] hover:bg-[#0D1420]"
                    >
                      <User className="w-4 h-4" />
                      <span>User Dashboard</span>
                    </Link>

                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center space-x-2 px-4 py-2 text-xs text-[#00D5FF] hover:bg-[#0D1420] font-medium"
                      >
                        <ShieldCheck className="w-4 h-4" />
                        <span>Admin Panel</span>
                      </Link>
                    )}

                    <button
                      onClick={async () => {
                        setUserDropdownOpen(false);
                        await logOut();
                      }}
                      className="w-full flex items-center space-x-2 px-4 py-2 text-xs text-red-400 hover:bg-[#0D1420] border-t border-white/5 mt-1"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-[#F5F7FA] hover:text-[#00D5FF] transition"
                >
                  Sign In
                </Link>
                <Link
                  to="/contact"
                  className="px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-[#00D5FF] to-[#3B82F6] text-[#070B12] hover:shadow-lg hover:shadow-[#00D5FF]/25 transition-all transform hover:-translate-y-0.5"
                >
                  Hire Me
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center space-x-2 md:hidden">
            <button
              onClick={() => setLanguage(language === 'en' ? 'bn' : 'en')}
              className="px-2 py-1 rounded bg-[#111B2A] text-xs font-semibold text-[#00D5FF]"
            >
              {language === 'en' ? 'EN' : 'বাং'}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-[#111B2A] text-[#A0AEC0] hover:text-[#00D5FF]"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0D1420] border-b border-[#00D5FF]/20 px-4 pt-3 pb-6 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive(link.path)
                  ? 'text-[#00D5FF] bg-[#111B2A]'
                  : 'text-[#A0AEC0] hover:text-white'
              }`}
            >
              {link.name}
            </Link>
          ))}

          <div className="pt-4 border-t border-white/10 flex flex-col space-y-2">
            {currentUser ? (
              <>
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm text-[#A0AEC0] bg-[#111B2A]"
                >
                  <User className="w-4 h-4 text-[#00D5FF]" />
                  <span>Dashboard ({currentUser.displayName || currentUser.email?.split('@')[0]})</span>
                </Link>
                {isAdmin && (
                  <Link
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm text-[#00D5FF] bg-[#111B2A] font-semibold"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>Admin Panel</span>
                  </Link>
                )}
                <button
                  onClick={async () => {
                    setMobileMenuOpen(false);
                    await logOut();
                  }}
                  className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm text-red-400 bg-[#111B2A]"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2 px-4 rounded-lg bg-[#111B2A] text-sm font-semibold text-[#F5F7FA]"
                >
                  Sign In
                </Link>
                <Link
                  to="/contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2 px-4 rounded-lg bg-gradient-to-r from-[#00D5FF] to-[#3B82F6] text-[#070B12] text-sm font-bold"
                >
                  Contact Me
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
