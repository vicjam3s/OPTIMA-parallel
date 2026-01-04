import { Link, NavLink } from "react-router-dom";
import { useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="navbar-wrapper">
      <nav className="navbar">
        {/* Logo */}
        <Link to="/" className="logo">
          OPTIMA
        </Link>

        {/* Desktop Nav */}
        <div className="nav-links desktop">
          <NavLink to="/" className="nav-item">
            Home
          </NavLink>
          <NavLink to="/login" className="nav-item">
            Login
          </NavLink>
          <NavLink to="/signup" className="nav-item cta">
            Sign Up
          </NavLink>
        </div>

        {/* Mobile Toggle */}
        <button
          className="menu-btn"
          onClick={() => setOpen(!open)}
          aria-label="Toggle navigation"
        >
          ☰
        </button>
      </nav>

      {/* Mobile Menu */}
      {open && (
        <div className="mobile-nav">
          <NavLink onClick={() => setOpen(false)} to="/" className="mobile-item">
            Home
          </NavLink>
          <NavLink onClick={() => setOpen(false)} to="/login" className="mobile-item">
            Login
          </NavLink>
          <NavLink
            onClick={() => setOpen(false)}
            to="/signup"
            className="mobile-item cta"
          >
            Sign Up
          </NavLink>
        </div>
      )}
    </header>
  );
}

