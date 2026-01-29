import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import "../../styles/manage-users.css";

function ManageUsers() {
  const [searchParams] = useSearchParams();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [deleteConfirmUser, setDeleteConfirmUser] = useState(null);
  const [blockConfirmUser, setBlockConfirmUser] = useState(null);
  const [toast, setToast] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);

  // Query params
  const mode = searchParams.get("mode"); // "manage" or null
  const roleFilter = searchParams.get("role"); // "student", "teacher", or null
  const viewFilter = searchParams.get("view"); // "all" or null
  const isManageMode = mode === "manage";

  // Get current user ID for self-delete prevention
  useEffect(() => {
    const userId = localStorage.getItem("user_id");
    setCurrentUserId(userId ? parseInt(userId) : null);
  }, []);

  // ===== Show toast notification =====
  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // ===== Fetch all users from backend =====
  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("access");
      const res = await fetch(
        "http://127.0.0.1:8000/api/users/admin/users",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!res.ok) throw new Error("Failed to fetch users");

      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error("✗ Error fetching users:", err.message);
      showToast("Error loading users: " + err.message, "error");
    }
  };

  // ===== Apply filters based on query params =====
  useEffect(() => {
    let filtered = [...users];

    // Apply role filter
    if (roleFilter === "student") {
      filtered = filtered.filter((u) => u.role === "student");
    } else if (roleFilter === "teacher") {
      filtered = filtered.filter((u) => u.role === "teacher");
    }

    setFilteredUsers(filtered);
  }, [users, roleFilter]);

  // ===== PAGE LOAD - fetch users on mount =====
  useEffect(() => {
    fetchUsers();
  }, []);

  // ===== ACTION: Approve Teacher =====
  const handleApprove = async (userId) => {
    try {
      const res = await fetch(
        `http://127.0.0.1:8000/api/users/admin/teachers/${userId}/approve/`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access")}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!res.ok) throw new Error("Failed to approve teacher");

      showToast("Teacher approved successfully!");
      await fetchUsers();
    } catch (err) {
      showToast("Error: " + err.message, "error");
    }
  };

  // ===== ACTION: Reject Teacher =====
  const handleReject = async (userId) => {
    try {
      const res = await fetch(
        `http://127.0.0.1:8000/api/users/admin/teachers/${userId}/reject/`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access")}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!res.ok) throw new Error("Failed to reject teacher");

      showToast("Teacher rejected successfully!");
      await fetchUsers();
    } catch (err) {
      showToast("Error: " + err.message, "error");
    }
  };

  // ===== ACTION: Block User =====
  const handleBlock = async (userId) => {
    try {
      const res = await fetch(
        `http://127.0.0.1:8000/api/users/admin/users/${userId}/block`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ is_blocked: true }),
        }
      );

      if (!res.ok) throw new Error("Failed to block user");

      showToast("User blocked successfully!");
      setBlockConfirmUser(null);
      await fetchUsers();
    } catch (err) {
      showToast("Error: " + err.message, "error");
    }
  };

  // ===== ACTION: Unblock User =====
  const handleUnblock = async (userId) => {
    try {
      const res = await fetch(
        `http://127.0.0.1:8000/api/users/admin/users/${userId}/unblock`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ is_blocked: false }),
        }
      );

      if (!res.ok) throw new Error("Failed to unblock user");

      showToast("User unblocked successfully!");
      await fetchUsers();
    } catch (err) {
      showToast("Error: " + err.message, "error");
    }
  };

  // ===== ACTION: Delete User =====
  const handleDelete = async (userId) => {
    try {
      const res = await fetch(
        `http://127.0.0.1:8000/api/users/admin/users/${userId}/delete`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access")}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!res.ok) throw new Error("Failed to delete user");

      showToast("User deleted successfully!");
      setDeleteConfirmUser(null);
      await fetchUsers();
    } catch (err) {
      showToast("Error: " + err.message, "error");
    }
  };

  // ===== HELPERS =====
  const getUserStatus = (user) => {
    if (user.is_blocked) return "blocked";
    if (user.role === "teacher") return user.teacher_status || "pending";
    return "active";
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "active":
        return "status-active";
      case "pending":
        return "status-pending";
      case "approved":
        return "status-approved";
      case "rejected":
        return "status-rejected";
      case "blocked":
        return "status-blocked";
      default:
        return "status-na";
    }
  };

  const getPageTitle = () => {
    if (isManageMode) return "Manage Users";
    if (roleFilter === "student") return "All Students";
    if (roleFilter === "teacher") return "All Teachers";
    return "All Users";
  };

  const getResultsText = () => {
    const count = filteredUsers.length;
    if (roleFilter === "student") return `${count} student${count !== 1 ? "s" : ""}`;
    if (roleFilter === "teacher") return `${count} teacher${count !== 1 ? "s" : ""}`;
    return `${count} user${count !== 1 ? "s" : ""}`;
  };

  return (
    <div className="manage-users-container">
      {/* Toast Notification */}
      {toast && (
        <div className={`toast toast-${toast.type}`}>
          <span>{toast.type === "success" ? "✓" : "⚠️"}</span> {toast.message}
        </div>
      )}

      {/* Page Header */}
      <div className="page-header">
        <div className="header-top">
          <div>
            <h1>{getPageTitle()}</h1>
            <p className="results-count">{getResultsText()}</p>
          </div>
          {isManageMode && (
            <button className="btn btn-primary" title="Add new user">
              + Add User
            </button>
          )}
        </div>
      </div>

      {/* Users Table */}
      <div className="users-table-wrapper">
        {filteredUsers.length === 0 ? (
          <div className="empty-state">
            <p>📭 No users found</p>
          </div>
        ) : (
          <table className="users-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                {isManageMode && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => {
                const status = getUserStatus(user);
                const canDelete = isManageMode && currentUserId !== user.id && user.role !== "admin";
                const canBlock = isManageMode && currentUserId !== user.id;

                return (
                  <tr key={user.id}>
                    <td className="name-cell">{user.username}</td>
                    <td className="email-cell">{user.email}</td>
                    <td>
                      <span className={`badge badge-${user.role}`}>
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge ${getStatusBadgeClass(status)}`}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </span>
                    </td>

                    {isManageMode && (
                      <td className="actions-cell">
                        <div className="action-buttons">
                          {/* Teacher Pending: Approve/Reject */}
                          {user.role === "teacher" && status === "pending" && (
                            <>
                              <button
                                className="btn btn-sm btn-success"
                                onClick={() => handleApprove(user.id)}
                                title="Approve teacher"
                              >
                                ✓ Approve
                              </button>
                              <button
                                className="btn btn-sm btn-warning"
                                onClick={() => handleReject(user.id)}
                                title="Reject teacher"
                              >
                                ✕ Reject
                              </button>
                            </>
                          )}

                          {/* Student/Teacher Active: Block */}
                          {(user.role === "student" || user.role === "teacher") &&
                            status === "active" && (
                              <button
                                className="btn btn-sm btn-warning"
                                onClick={() => setBlockConfirmUser(user)}
                                disabled={!canBlock}
                                title={canBlock ? "Block user" : "Cannot block"}
                              >
                                🚫 Block
                              </button>
                            )}

                          {/* Student/Teacher Blocked: Unblock */}
                          {(user.role === "student" || user.role === "teacher") &&
                            status === "blocked" && (
                              <button
                                className="btn btn-sm btn-success"
                                onClick={() => handleUnblock(user.id)}
                                disabled={!canBlock}
                                title={canBlock ? "Unblock user" : "Cannot unblock"}
                              >
                                ✓ Unblock
                              </button>
                            )}

                          {/* Delete Button */}
                          {user.role !== "admin" && (
                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() => setDeleteConfirmUser(user)}
                              disabled={!canDelete}
                              title={
                                currentUserId === user.id
                                  ? "Cannot delete yourself"
                                  : user.role === "admin"
                                  ? "Cannot delete admin"
                                  : "Delete user"
                              }
                            >
                              🗑️ Delete
                            </button>
                          )}

                          {/* Admin: No actions */}
                          {user.role === "admin" && (
                            <span className="no-actions">Admin account</span>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Block Confirmation Modal */}
      {blockConfirmUser && (
        <div className="modal-overlay" onClick={() => setBlockConfirmUser(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Block User</h2>
              <button
                className="modal-close"
                onClick={() => setBlockConfirmUser(null)}
              >
                ✕
              </button>
            </div>
            <div className="modal-body">
              <p>
                Are you sure you want to block <strong>{blockConfirmUser.username}</strong>?
              </p>
              <p className="modal-warning">
                ⚠️ This user will lose access to the platform.
              </p>
            </div>
            <div className="modal-footer">
              <button
                className="btn btn-secondary"
                onClick={() => setBlockConfirmUser(null)}
              >
                Cancel
              </button>
              <button
                className="btn btn-warning"
                onClick={() => handleBlock(blockConfirmUser.id)}
              >
                Block User
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmUser && (
        <div className="modal-overlay" onClick={() => setDeleteConfirmUser(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Delete User</h2>
              <button
                className="modal-close"
                onClick={() => setDeleteConfirmUser(null)}
              >
                ✕
              </button>
            </div>
            <div className="modal-body">
              <p>
                Are you sure you want to delete <strong>{deleteConfirmUser.username}</strong>?
              </p>
              <p className="modal-warning">
                ⚠️ This action cannot be undone.
              </p>
            </div>
            <div className="modal-footer">
              <button
                className="btn btn-secondary"
                onClick={() => setDeleteConfirmUser(null)}
              >
                Cancel
              </button>
              <button
                className="btn btn-danger"
                onClick={() => handleDelete(deleteConfirmUser.id)}
              >
                Delete User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageUsers;
