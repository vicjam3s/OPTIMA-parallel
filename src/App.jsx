import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";

// dashboard pages
import DashboardHome from "./pages/dashboard/DashboardHome";
import Library from "./pages/dashboard/Library";
import Music from "./pages/dashboard/Music";
import Focus from "./pages/dashboard/Focus";
import Movies from "./pages/dashboard/Movies";
import Calendar from "./pages/dashboard/Calendar";
import News from "./pages/dashboard/News";
import Notes from "./pages/dashboard/Notes";

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route path="/dashboard" element={<Dashboard />}>
          <Route index element={<DashboardHome />} />
          <Route path="library" element={<Library />} />
          <Route path="music" element={<Music />} />
          <Route path="focus" element={<Focus />} />
          <Route path="movies" element={<Movies />} />
          <Route path="calendar" element={<Calendar />} />
          <Route path="news" element={<News />} />
          <Route path="notes" element={<Notes />} />
        </Route>
      </Routes>
    </>
  );
}


