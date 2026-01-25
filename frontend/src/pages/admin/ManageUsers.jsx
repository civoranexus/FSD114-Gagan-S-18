import { useEffect, useState } from "react";

function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("access");

    if (!token) {
      setError("Not authenticated. Please login again.");
      setLoading(false);
      return;
    }

    fetch("http://127.0.0.1:8000/api/users/admin/users/", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Unauthorized");
        return res.json();
      })
      .then((data) => {
        setUsers(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to fetch users");
        setLoading(false);
      });
  }, []);

  const handleDelete = async (userId) => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this user?"
  );

  if (!confirmDelete) return;

  try {
    const res = await fetch(
      `http://127.0.0.1:8000/api/users/admin/users/${userId}/delete`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access")}`,
        },
      }
    );

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Failed to delete user");
      return;
    }

    alert("User deleted successfully");

    // 🔄 Refresh users list
    setUsers(users.filter((user) => user.id !== userId));
  } catch (err) {
    alert("Server error");
  }
};

  if (loading) return <p>Loading users...</p>;

  return (
    <div className="page">
      <h1>Manage Users</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {!error && (
        <table border="1" cellPadding="10">
          <thead>
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>{u.username}</td>
                <td>{u.role}</td>
                <td>
                  <button disabled>Edit</button>{" "}
                  
                  <button onClick={() => handleDelete(user.id)}> Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default ManageUsers;