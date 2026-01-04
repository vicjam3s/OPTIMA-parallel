import { useNavigate } from "react-router-dom";

export default function Signup() {
  const navigate = useNavigate();

  return (
    <section className="auth-page">
      <div className="auth-card">
        <h2>Create an Account</h2>
        <p className="muted">Sign-up coming soon</p>

        <button
          className="btn primary full"
          onClick={() => navigate("/dashboard")}
        >
          Get Started (Demo)
        </button>
      </div>
    </section>
  );
}
