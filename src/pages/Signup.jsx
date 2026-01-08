import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Signup() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from || "/";

  const handleSignup = () => {
    login();
    navigate(from, { replace: true });
  };

  return (
    <section className="auth-page">
      <div className="auth-card">
        <h2>Create an OPTIMA Account</h2>
        <p className="muted">Get started in seconds</p>

        <button className="btn primary full" onClick={handleSignup}>
          Create Account
        </button>

        <p className="muted">
          Already have an account? <a href="/login">Log in</a>
        </p>
      </div>
    </section>
  );
}

