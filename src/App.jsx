import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import BackToTop from "./components/BackToTop";
import ProtectedRoute from "./components/ProtectedRoute";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NotFound from "./pages/NotFound";

import Notes from "./pages/Notes";
import Focus from "./pages/Focus";
import Library from "./pages/Library";
import Movies from "./pages/Movies";
import Music from "./pages/Music";
import News from "./pages/News";
import Calendar from "./pages/Calendar";

export default function App() {
  const location = useLocation();

  // Routes where sidebar & back-to-top should NOT show
  const hideUIRoutes = ["/", "/login", "/signup"];
  const showFeatureUI = !hideUIRoutes.includes(location.pathname);

  return (
    <>
      <Navbar />

      <div className={showFeatureUI ? "app-layout" : ""}>
        {showFeatureUI && <Sidebar />}

        <main className="app-main">
          <div className="content-container">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="*" element={<NotFound />} />
      
      
            <Route path="/notes" element={<ProtectedRoute><Notes /></ProtectedRoute>} />
            <Route path="/focus" element={<ProtectedRoute><Focus /></ProtectedRoute>} />
            <Route path="/library" element={<ProtectedRoute><Library /></ProtectedRoute>} />
            <Route path="/movies" element={<ProtectedRoute><Movies /></ProtectedRoute>} />
            <Route path="/music" element={<ProtectedRoute><Music /></ProtectedRoute>} />
            <Route path="/news" element={<ProtectedRoute><News /></ProtectedRoute>} />
            <Route path="/calendar" element={<ProtectedRoute><Calendar /></ProtectedRoute>} />
          </Routes>
          </div>
        </main>
      </div>

      {showFeatureUI && <BackToTop />}
    </>
  );
}





