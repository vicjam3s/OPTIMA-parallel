import { NavLink } from "react-router-dom";

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        <NavLink to="/library" className="sidebar-btn">
          <span>📚</span>
        </NavLink>

        <NavLink to="/music" className="sidebar-btn">
          <span>🎧</span>
        </NavLink>

        <NavLink to="/focus" className="sidebar-btn">
          <span>⏱</span>
        </NavLink>

        <NavLink to="/movies" className="sidebar-btn">
          <span>🎬</span>
        </NavLink>

        <NavLink to="/calendar" className="sidebar-btn">
          <span>🗓</span>
        </NavLink>

        <NavLink to="/news" className="sidebar-btn">
          <span>📰</span>
        </NavLink>

        <NavLink to="/notes" className="sidebar-btn">
          <span>📝</span>
        </NavLink>
      </nav>
    </aside>
  );
}

