import { useState } from "react";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "../firebase";
import { Link } from "react-router-dom";

const googleProvider = new GoogleAuthProvider();

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirm) {
      return setError("Passwords do not match.");
    }

    try {
      setLoading(true);
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Create Account</h2>
        <p className="muted">Join OPTIMA and stay productive</p>

        {error && <p className="error">{error}</p>}

        <button className="btn google full" onClick={handleGoogleSignup}>
          Continue with Google
        </button>

        <div className="auth-divider">OR</div>

        <form onSubmit={handleSignup}>
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Confirm password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
          />

          <button
            className="btn primary full"
            type="submit"
            disabled={loading}
          >
            {loading ? "Creating account…" : "Sign Up"}
          </button>
        </form>

        <p className="muted auth-switch">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </div>
    </div>
  );
}

