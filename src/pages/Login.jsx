import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  return (
    <section className="auth-page">
      <div className="auth-card">
        <h2>Login to OPTIMA</h2>
        <p className="muted">Authentication coming soon</p>

        <button
          className="btn primary full"
          onClick={() => navigate("/dashboard")}
        >
          Continue (Demo)
        </button>
      </div>
    </section>
  );
}
