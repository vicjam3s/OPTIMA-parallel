import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <section className="notfound">
      <h1>404</h1>
      <p className="muted">Page not found.</p>
      <Link to="/" className="btn primary">
        Back to Home
      </Link>
    </section>
  );
}
