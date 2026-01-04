import Sidebar from "../components/Sidebar";

export default function Dashboard() {
  return (
    <div className="dashboard-layout">
      <Sidebar />

      <main className="dashboard-main">
        <h1>Dashboard</h1>
        <p className="muted">
          Select a tool from the sidebar to get started.
        </p>
      </main>
    </div>
  );
}
