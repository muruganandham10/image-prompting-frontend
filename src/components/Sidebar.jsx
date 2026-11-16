
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Images,
  PanelLeftClose,
  PanelLeftOpen,
  ChevronLeft,
  Sun,
  Moon
} from 'lucide-react';

import './Sidebar.css';

function Sidebar({
  collapsed,
  setCollapsed,
  mobileOpen,
  setMobileOpen,
  theme,
  toggleTheme
}) {
  const closeMobile = () => setMobileOpen(false);

  return (
    <>
      {mobileOpen && (
        <div
          className="sidebar-overlay"
          onClick={closeMobile}
        />
      )}

      <aside
        className={`sidebar
          ${collapsed ? 'collapsed' : ''}
          ${mobileOpen ? 'mobile-open' : ''}`}
      >
        <div className="sidebar-header">
          <div className="sidebar-brand">

            <div className="sidebar-logo">
              <img
                src="/braynex-icon.png"
                alt="Braynex AI Logo"
                className="sidebar-logo-image"
              />
            </div>

            {!collapsed && (
              <div className="sidebar-brand-text">
                <h2>BRAYNEX</h2>
                <span>AI WORKSPACE</span>
              </div>
            )}

          </div>

          <button
            className="sidebar-collapse-btn"
            onClick={() => setCollapsed(!collapsed)}
            title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {collapsed
              ? <PanelLeftOpen size={18} />
              : <PanelLeftClose size={18} />}
          </button>
        </div>

        {!collapsed && (
          <div className="sidebar-workspace">
            <span className="workspace-status" />
            <span>Creative Workspace</span>
          </div>
        )}

        <nav className="sidebar-nav">
          {!collapsed && (
            <p className="sidebar-nav-label">MAIN MENU</p>
          )}

          <NavLink
            to="/"
            end
            onClick={closeMobile}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? 'active' : ''}`
            }
            title="Dashboard"
          >
            <LayoutDashboard size={19} />
            {!collapsed && <span>Dashboard</span>}
          </NavLink>

          <NavLink
            to="/gallery"
            onClick={closeMobile}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? 'active' : ''}`
            }
            title="AI Gallery"
          >
            <Images size={19} />
            {!collapsed && <span>AI Gallery</span>}
          </NavLink>
        </nav>

        <div className="sidebar-bottom">
          <button
            className="sidebar-theme-toggle"
            onClick={toggleTheme}
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          >
            <span className="theme-toggle-icon">
              {theme === 'dark'
                ? <Sun size={19} />
                : <Moon size={19} />}
            </span>

            {!collapsed && (
              <>
                <span className="theme-toggle-text">
                  {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                </span>

                <span className={`theme-switch ${theme}`}>
                  <span />
                </span>
              </>
            )}
          </button>

          <div className="sidebar-bottom-divider" />

          {!collapsed && (
            <div className="sidebar-status">
              <span className="status-indicator" />
              <span>Workspace Active</span>
            </div>
          )}

          <button
            className="sidebar-mobile-close"
            onClick={closeMobile}
          >
            Close Sidebar
            <ChevronLeft size={16} />
          </button>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
