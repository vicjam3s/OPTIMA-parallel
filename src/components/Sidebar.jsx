import { NavLink } from "react-router-dom";

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <h2 className="sidebar-logo">OPTIMA</h2>

      <nav className="sidebar-nav">
        <NavLink to="/dashboard" end className="sidebar-link">
          Dashboard
        </NavLink>
        <NavLink to="/dashboard/library" className="sidebar-link">
          📚 E-Library
        </NavLink>
        <NavLink to="/dashboard/music" className="sidebar-link">
          🎧 Music
        </NavLink>
        <NavLink to="/dashboard/focus" className="sidebar-link">
          ⏱ Focus
        </NavLink>
        <NavLink to="/dashboard/movies" className="sidebar-link">
          🎬 Movies
        </NavLink>
        <NavLink to="/dashboard/calendar" className="sidebar-link">
          🗓 Calendar
        </NavLink>
        <NavLink to="/dashboard/news" className="sidebar-link">
          📰 News
        </NavLink>
        <NavLink to="/dashboard/notes" className="sidebar-link">
          📝 Notes
        </NavLink>
      </nav>
    </aside>
  );
}
