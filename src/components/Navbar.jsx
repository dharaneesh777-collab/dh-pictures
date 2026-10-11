import React, { useState } from 'react';
import { 
  Tv, 
  Film, 
  Search, 
  X, 
  Settings, 
  Sparkles, 
  Terminal, 
  Heart, 
  Languages, 
  Compass
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

  const navItems = [
    { id: 'all', label: 'Discover', icon: Compass },
    { id: 'movies', label: 'Movies', icon: Film },
    { id: 'tv', label: 'TV Shows', icon: Tv },
    { id: 'hindi', label: 'Hindi Cinema', icon: Languages, highlight: 'Server 6' },
    { id: 'anime', label: 'Anime Hub', icon: Sparkles, highlight: 'AniList' },
    { id: 'launcher', label: 'Direct ID Launcher', icon: Terminal, highlight: 'API' },
    { id: 'watchlist', label: `My List (${watchlistCount})`, icon: Heart }
  ];

  return (
    <header className="navbar-header">
      <div className="navbar-container">
        {/* Brand Logo */}
        <div 
          className="brand-logo" 
          onClick={() => { setActiveTab('all'); setSearchQuery(''); }}
        >
          <div className="logo-icon-wrap">
            <Film size={22} className="logo-film-icon" />
          </div>
          <div className="logo-text-wrap">
            <span className="brand-name">STREAM<span className="brand-accent">VERSE</span></span>
            <span className="brand-badge">Multi-Server v2.0</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className={`nav-links ${mobileMenuOpen ? 'mobile-open' : ''}`}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                className={`nav-btn ${isActive ? 'active' : ''}`}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
              >
                <Icon size={16} />
                <span>{item.label}</span>
                {item.highlight && (
                  <span className="nav-tag-badge">{item.highlight}</span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Search and Settings */}
        <div className="nav-right">
          <form 
            className="search-form" 
            onSubmit={(e) => { e.preventDefault(); onSearchSubmit(); }}
          >
            <Search size={16} className="search-icon" />
            <input
              type="text"
              placeholder="Search movie, TV or anime..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            {searchQuery && (
              <button
                type="button"
                className="search-clear-btn"
                onClick={() => setSearchQuery('')}
              >
                <X size={14} />
              </button>
            )}
          </form>

          <button
            className="btn-icon nav-settings-btn"
            onClick={onOpenSettings}
            title="API & Player Settings"
            aria-label="Settings"
          >
            <Settings size={18} />
          </button>
        </div>
      </div>
    </header>
  );
}
