import React, { useState } from 'react';
import { 
  Home,
  Film, 
  Tv, 
  Sparkles, 
  Flame,
  Search, 
  X, 
  User, 
  ChevronDown,
  Terminal,
  Heart
} from 'lucide-react';

export default function Navbar({
  activeTab,
  setActiveTab,
  searchQuery,
  setSearchQuery,
  onSearchSubmit,
  watchlistCount = 0,
  onOpenSettings
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [animeDropdownOpen, setAnimeDropdownOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(Boolean(searchQuery));

  const navLinks = [
    { id: 'all', label: 'Home', icon: Home },
    { id: 'movies', label: 'Movies', icon: Film },
    { id: 'tv', label: 'Tv Shows', icon: Tv },
    { 
      id: 'anime', 
      label: 'Anime', 
      icon: Sparkles, 
      hasDropdown: true 
    },
    { id: 'trending', label: 'Trending', icon: Flame },
    { id: 'hindi', label: 'Bollywood', highlight: 'Server 6' },
    { id: 'launcher', label: 'Direct ID', icon: Terminal }
  ];

  return (
    <header className="navbar-header">
      <div className="navbar-container">
        {/* Brand Logo - DH PICTURES */}
        <div 
          className="brand-logo" 
          onClick={() => { setActiveTab('all'); setSearchQuery(''); }}
          title="DH PICTURES"
          aria-label="DH PICTURES"
        >
          <span className="brand-dh">DH</span>
          <span className="brand-pictures">PICTURES</span>
        </div>

        {/* Navigation Tabs */}
        <nav className={`nav-links ${mobileMenuOpen ? 'mobile-open' : ''}`}>
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            if (item.hasDropdown) {
              return (
                <div 
                  key={item.id} 
                  className="nav-dropdown-wrapper"
                  onMouseEnter={() => setAnimeDropdownOpen(true)}
                  onMouseLeave={() => setAnimeDropdownOpen(false)}
                >
                  <button
                    className={`nav-btn ${isActive ? 'active' : ''}`}
                    onClick={() => {
                      setActiveTab('anime');
                      setMobileMenuOpen(false);
                    }}
                  >
                    {Icon && <Icon size={16} />}
                    <span>{item.label}</span>
                    <ChevronDown size={14} className="dropdown-chevron" />
                  </button>

                  {animeDropdownOpen && (
                    <div className="nav-dropdown-menu">
                      <button
                        className="dropdown-item"
                        onClick={() => {
                          setActiveTab('anime');
                          setAnimeDropdownOpen(false);
                          setMobileMenuOpen(false);
                        }}
                      >
                        AniList Popular
                      </button>
                      <button
                        className="dropdown-item"
                        onClick={() => {
                          setActiveTab('anime');
                          setAnimeDropdownOpen(false);
                          setMobileMenuOpen(false);
                        }}
                      >
                        Sub & Dub Stream
                      </button>
                    </div>
                  )}
                </div>
              );
            }

            return (
              <button
                key={item.id}
                className={`nav-btn ${isActive ? 'active' : ''}`}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
              >
                {Icon && <Icon size={16} />}
                <span>{item.label}</span>
                {item.highlight && (
                  <span className="nav-tag-badge">{item.highlight}</span>
                )}
              </button>
            );
          })}

          {/* Watchlist Quick Pill */}
          <button
            className={`nav-btn watchlist-btn ${activeTab === 'watchlist' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('watchlist');
              setMobileMenuOpen(false);
            }}
          >
            <Heart size={15} />
            <span>My List</span>
            {watchlistCount > 0 && <span className="nav-count-badge">{watchlistCount}</span>}
          </button>
        </nav>

        {/* Right Search, Discord icon, and User Avatar */}
        <div className="nav-right">
          {searchOpen || searchQuery ? (
            <form 
              className="search-form" 
              onSubmit={(e) => { e.preventDefault(); onSearchSubmit(); }}
            >
              <Search size={16} className="search-icon" />
              <input
                type="text"
                autoFocus
                placeholder="Search movies, tv, anime..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
              <button
                type="button"
                className="search-clear-btn"
                onClick={() => { setSearchQuery(''); setSearchOpen(false); }}
                title="Close search"
              >
                <X size={14} />
              </button>
            </form>
          ) : (
            <button
              type="button"
              className="nav-icon-link nav-search-trigger"
              onClick={() => setSearchOpen(true)}
              title="Search movies, tv, anime"
              aria-label="Search"
            >
              <Search size={18} />
            </button>
          )}

          {/* Discord/Community Button */}
          <a
            href="https://discord.com"
            target="_blank"
            rel="noreferrer"
            className="nav-icon-link"
            title="Join Discord Community"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.893.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
            </svg>
          </a>

          {/* User Profile / Settings Avatar */}
          <button
            className="nav-user-avatar"
            onClick={onOpenSettings}
            title="Settings & Servers Configuration"
            aria-label="Settings"
          >
            <User size={18} />
          </button>
        </div>
      </div>
    </header>
  );
}
