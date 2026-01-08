import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [theme, setTheme] = useState("dark");
  const [menuOpen, setMenuOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  // Load saved theme
  useEffect(() => {
    const saved = localStorage.getItem("optima_theme") || "dark";
    setTheme(saved);
    document.documentElement.setAttribute("data-theme", saved);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("optima_theme", newTheme);
  };

  const handleLogout = () => {
    const confirmed = window.confirm(
      "Are you sure you want to log out?"
    );
    if (!confirmed) return;

    setMenuOpen(false);
    setLoggingOut(true);

    setTimeout(() => {
      logout();
      setLoggingOut(false);
    }, 2000);
  };

  return (
    <>
      <header className="navbar">
        <div className="navbar-inner">
          <Link to="/" className="navbar-brand">
            OPTIMA
          </Link>

          {/* DESKTOP ACTIONS */}
          <nav className="navbar-actions desktop-only">
            
            {user ? (
              <button className="btn btn-ghost" onClick={handleLogout}>
                Logout
              </button>
            ) : (
              <>
                <Link to="/login" className="btn btn-ghost">
                  Login
                </Link>
                <Link to="/signup" className="btn btn-primary">
                  Sign up
                </Link>
              </>
            )}
          </nav>

          {/* HAMBURGER */}
          <button
            className="hamburger"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Menu"
          >
            ☰
          </button>
        </div>

        {/* MOBILE MENU */}
        {menuOpen && (
          <div className="mobile-menu">
            

            {user ? (
              <button
                className="btn btn-ghost"
                onClick={handleLogout}
              >
                Logout
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  className="btn btn-ghost"
                  onClick={() => setMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="btn btn-primary"
                  onClick={() => setMenuOpen(false)}
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
        )}
      </header>

      {/* LOGGING OUT OVERLAY */}
      {loggingOut && (
        <div className="logout-overlay">
          <div className="logout-card">
            <div className="spinner" />
            <p>Logging out…</p>
          </div>
        </div>
      )}
    </>
  );
}


