import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import BackToTop from "./components/BackToTop";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

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
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            <Route path="/notes" element={<Notes />} />
            <Route path="/focus" element={<Focus />} />
            <Route path="/library" element={<Library />} />
            <Route path="/movies" element={<Movies />} />
            <Route path="/music" element={<Music />} />
            <Route path="/news" element={<News />} />
            <Route path="/calendar" element={<Calendar />} />
          </Routes>
        </main>
      </div>

      {showFeatureUI && <BackToTop />}
    </>
  );
}





