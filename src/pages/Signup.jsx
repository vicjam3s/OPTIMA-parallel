import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../services/firebase";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const navigate = useNavigate();

  const signup = async () => {
    await signInWithPopup(auth, googleProvider);
    navigate("/dashboard");
  };

  return (
    <section className="page center">
      <button className="btn primary" onClick={signup}>
        Sign up with Google
      </button>
    </section>
  );
}
