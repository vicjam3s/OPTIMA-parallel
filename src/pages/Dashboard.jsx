import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { user, logout } = useAuth();

  return (
    <section className="page">
      <h2>Welcome, {user?.displayName}</h2>

      <button className="btn secondary" onClick={logout}>
        Logout
      </button>
    </section>
  );
}


