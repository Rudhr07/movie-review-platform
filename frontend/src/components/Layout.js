import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import './Layout.css';

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: 'Home', path: '/' },
    { name: 'Movies', path: '/movies' },
    { name: 'Profile', path: '/profile' },
    { name: 'Admin', path: '/admin' },
  ];


  return (
    <div className="app">
  {/* Sidebar removed for Movies page cleanliness */}

      {/* Main Content */}
      <main className="main-content">
        {location.pathname !== '/movies' && (
          <header className="header">
            <div className="header-content">
              <div className="header-left">
                <button
                  className="sidebar-toggle"
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  aria-label="Toggle navigation"
                >
                  <span style={{display:'block',width:18,height:2,background:'currentColor',boxShadow:'0 6px 0 currentColor, 0 -6px 0 currentColor'}} />
                </button>
                <h1 className="header-title">
                  {navigation.find(nav => nav.path === location.pathname)?.name || 'Dashboard'}
                </h1>
              </div>
              <div className="header-actions" />
            </div>
          </header>
        )}

        <div className="content">
          {children}
        </div>
      </main>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="mobile-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default Layout;
