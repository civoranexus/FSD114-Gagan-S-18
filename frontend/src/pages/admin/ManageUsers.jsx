import { useEffect, useState } from "react";

function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("access");

      const res = await fetch(
        "http://127.0.0.1:8000/api/users/admin/users",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error("Unauthorized");
      }

      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch users");
    }
  };

  fetchUsers();
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

const handleRoleChange = async (userId, newRole) => {
  try {
    const res = await fetch(
      `http://127.0.0.1:8000/api/users/admin/users/${userId}/role`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role: newRole }),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Failed to update role");
      return;
    }

    // Update UI instantly
    setUsers(
      users.map((u) =>
        u.id === userId ? { ...u, role: newRole } : u
      )
    );
  } catch (error) {
    alert("Server error while updating role");
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
                <td>
  {u.role === "admin" ? (
    "admin"
  ) : (
    <select
      value={u.role}
      onChange={(e) =>
        handleRoleChange(u.id, e.target.value)
      }
    >
      <option value="student">student</option>
      <option value="teacher">teacher</option>
    </select>
  )}
</td>
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