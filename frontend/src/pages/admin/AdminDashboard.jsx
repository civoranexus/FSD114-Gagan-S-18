function AdminDashboard() {
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <div className="page">
      <h1>Admin Dashboard</h1>
      <p>Welcome, Admin 👋</p>

      <div className="admin-cards">
        <div className="admin-card">
          <h3>👥 Manage Users</h3>
          <p>Add, remove or update users</p>
          <button>Open</button>
        </div>

        <div className="admin-card">
          <h3>📚 Manage Courses</h3>
          <p>Create and manage courses</p>
          <button>Open</button>
        </div>

        <div className="admin-card">
          <h3>📊 View Reports</h3>
          <p>Platform usage & analytics</p>
          <button>Open</button>
        </div>
      </div>

      <br />
      <button onClick={() => window.location.href = "/admin/users"}>
                                      Open
          </button>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default AdminDashboard;