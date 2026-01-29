import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import BackToTop from "./components/BackToTop";
import ProtectedRoute from "./components/ProtectedRoute";
import MiniPlayer from "./components/MiniPlayer";
import AdminRoute from "./components/AdminRoute";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";

import Notes from "./pages/Notes";
import Focus from "./pages/Focus";
import Library from "./pages/Library";
import Movies from "./pages/Movies";
import Music from "./pages/Music";
import News from "./pages/News";
import Calendar from "./pages/Calendar";
import Settings from "./pages/Settings";

export default function App() {
  const location = useLocation();

  // FIX: get user from AuthContext
  const { user, loading } = useAuth();

  // Routes where sidebar & back-to-top should NOT show
  const hideUIRoutes = ["/", "/login", "/signup"];
  const showFeatureUI = !hideUIRoutes.includes(location.pathname);

  // Prevent blank screen during auth check
  if (loading) {
    return <div className="auth-loading">Loading…</div>;
  }

  return (
    <>
      <Navbar />
      <MiniPlayer />

      <div className={showFeatureUI ? "app-layout" : ""}>
        {showFeatureUI && <Sidebar />}

        <main className="app-main">
          <div className="content-container">
            <Routes>
              <Route path="/" element={<Landing />} />

              <Route
                path="/login"
                element={user ? <Navigate to="/landing" /> : <Login />}
              />

              <Route
                path="/signup"
                element={user ? <Navigate to="/landing" /> : <Signup />}
              />

              <Route
                path="/landing"
                element={
                  user ? <Landing /> : <Navigate to="/login" />
                }
              />

              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <Settings />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/notes"
                element={
                  <ProtectedRoute>
                    <Notes />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/focus"
                element={
                  <ProtectedRoute>
                    <Focus />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/library"
                element={
                  <ProtectedRoute>
                    <Library />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/movies"
                element={
                  <ProtectedRoute>
                    <Movies />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/music"
                element={
                  <ProtectedRoute>
                    <Music />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/news"
                element={
                  <ProtectedRoute>
                    <News />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/calendar"
                element={
                  <ProtectedRoute>
                    <Calendar />
                  </ProtectedRoute>
                }
              />

              {/* FINAL FALLBACK */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </main>
      </div>

      {showFeatureUI && <BackToTop />}
    </>
  );
}






