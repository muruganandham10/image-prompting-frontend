
import { useEffect, useState } from 'react';
import {
  Menu,
  Clock3,
  Sparkles
} from 'lucide-react';

import './Navbar.css';

function Navbar({ setMobileOpen }) {
  const [indiaDateTime, setIndiaDateTime] = useState({
    date: '',
    time: ''
  });

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();

      const date = new Intl.DateTimeFormat('en-IN', {
        weekday: 'short',
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        timeZone: 'Asia/Kolkata'
      }).format(now);

      const time = new Intl.DateTimeFormat('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
        timeZone: 'Asia/Kolkata'
      }).format(now);

      setIndiaDateTime({ date, time });
    };

    updateDateTime();

    const timer = setInterval(updateDateTime, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <header className="navbar">

      <div className="navbar-left">

        <button
          className="mobile-menu-btn"
          onClick={() => setMobileOpen(true)}
          aria-label="Open navigation menu"
        >
          <Menu size={22} />
        </button>

        <div className="navbar-heading">

          <div className="navbar-breadcrumb">
            <Sparkles size={21} className="navbar-top-sparkle" />

            <span className="breadcrumb-brand">
              BRAYNEX AI
            </span>

            <span className="breadcrumb-divider">/</span>

            <span>CREATIVE WORKSPACE</span>
          </div>

          <div className="navbar-title-row">
            <div className="navbar-title-icon">
              <img
                src="/braynex-icon.png"
                alt="Braynex Logo"
                className="navbar-main-logo"
              />
            </div>

            <h1>Bring Your Ideas to Life</h1>
          </div>

          <p className="navbar-tagline">
            Imagine <span>•</span> Create <span>•</span> Innovate
          </p>

        </div>
      </div>

      <div className="navbar-right">

        <div className="navbar-datetime">
          <div className="datetime-icon">
            <Clock3 size={17} />
          </div>

          <div className="datetime-content">
            <span className="datetime-date">
              {indiaDateTime.date}
            </span>

            <strong className="datetime-time">
              {indiaDateTime.time}
              <span className="timezone-label">IST</span>
            </strong>
          </div>
        </div>

        <div className="navbar-welcome">
          <span className="welcome-status-dot" />
          <Sparkles size={17} />
          <span>Ready to Create</span>
        </div>

      </div>
    </header>
  );
}

export default Navbar;
