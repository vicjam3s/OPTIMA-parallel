import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../services/firebase";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const login = async () => {
    await signInWithPopup(auth, googleProvider);
    navigate("/dashboard");
  };

  return (
    <section className="page center">
      <button className="btn primary" onClick={login}>
        Continue with Google
      </button>
    </section>
  );
}

