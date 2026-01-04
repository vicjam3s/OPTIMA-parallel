import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

export default function Dashboard() {
  return (
    <div className="dashboard-layout">
      <Sidebar />

      <main className="dashboard-main">
        <Outlet />
      </main>
    </div>
  );
}

