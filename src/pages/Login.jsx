import { useNavigate, useLocation } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from || "/notes";

  const handleLogin = () => {
    // TEMP auth (replace with Firebase)
    localStorage.setItem("optima_auth", "true");
    navigate(from, { replace: true });
  };

  return (
    <section className="auth-page">
      <div className="auth-card">
        <h2>Login to OPTIMA</h2>
        <p className="muted">Demo mode</p>

        <button
          className="btn primary full"
          onClick={handleLogin}
        >
          Continue
        </button>
      </div>
    </section>
  );
}

