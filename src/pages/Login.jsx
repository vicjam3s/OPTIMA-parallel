import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
//Default redirect to home dash.
  const from = location.state?.from || "/";

  const handleLogin = () => {
    login();
    navigate(from, { replace: true });
  };

  return (
    <section className="auth-page">
      <div className="auth-card">
        <h2>Login to OPTIMA</h2>
        <p className="muted">Welcome back</p>

        <button className="btn primary full" onClick={handleLogin}>
          Continue
        </button>

        <p className="muted">
          Don’t have an account? <a href="/signup">Sign up</a>
        </p>
      </div>
    </section>
  );
}


