import { useEffect, useState } from "react";
import "../../styles/manage-users.css";

function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [currentUserRole, setCurrentUserRole] = useState("");
  const [currentUserId, setCurrentUserId] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [userToReject, setUserToReject] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    // Get current user info
    const role = localStorage.getItem("role");
    const userId = localStorage.getItem("user_id");
    setCurrentUserRole(role);
    setCurrentUserId(userId ? parseInt(userId) : "");
    
    fetchUsers();
  }, []);

  // Auto-dismiss success message after 3 seconds
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  // Auto-dismiss error message after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");
      
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

      if (!res.ok) {
        throw new Error("Failed to fetch users");
      }

      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const openDeleteModal = (user) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setUserToDelete(null);
  };

  const openRejectModal = (user) => {
    setUserToReject(user);
    setShowRejectModal(true);
  };

  const closeRejectModal = () => {
    setShowRejectModal(false);
    setUserToReject(null);
  };

  const handleDelete = async () => {
    if (!userToDelete) return;

    try {
      setDeleting(true);
      const res = await fetch(
        `http://127.0.0.1:8000/api/users/admin/users/${userToDelete.id}/delete`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access")}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to delete user");
        return;
      }

      // Refresh users list
      setUsers(users.filter((user) => user.id !== userToDelete.id));
      setSuccess("User deleted successfully");
      closeDeleteModal();
    } catch (err) {
      setError("Server error while deleting user");
    } finally {
      setDeleting(false);
    }
  };

  const handleApproveTeacher = async (user) => {
    try {
      setProcessing(true);
      setError("");

      const res = await fetch(
        `http://127.0.0.1:8000/api/users/admin/teachers/${user.id}/approve/`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access")}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to approve teacher");
        return;
      }

      // Update user status in list
      setUsers(
        users.map((u) =>
          u.id === user.id ? { ...u, teacher_status: "approved" } : u
        )
      );
      setSuccess(`${user.username} has been approved successfully!`);
    } catch (err) {
      setError("Server error while approving teacher");
    } finally {
      setProcessing(false);
    }
  };

  const handleRejectTeacher = async () => {
    if (!userToReject) return;

    try {
      setProcessing(true);
      setError("");

      const res = await fetch(
        `http://127.0.0.1:8000/api/users/admin/teachers/${userToReject.id}/reject/`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access")}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to reject teacher");
        return;
      }

      // Update user status in list
      setUsers(
        users.map((u) =>
          u.id === userToReject.id ? { ...u, teacher_status: "rejected" } : u
        )
      );
      setSuccess(`${userToReject.username} has been rejected.`);
      closeRejectModal();
    } catch (err) {
      setError("Server error while rejecting teacher");
    } finally {
      setProcessing(false);
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
        setError(data.error || "Failed to update role");
        return;
      }

      // Update UI instantly
      setUsers(
        users.map((u) =>
          u.id === userId ? { ...u, role: newRole } : u
        )
      );
    } catch (error) {
      setError("Server error while updating role");
    }
  };

  const isAdmin = currentUserRole === "admin";

  if (loading) {
    return (
      <div className="manage-users-container">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="manage-users-container">
      <div className="page-header">
        <div className="header-top">
          <h1>Manage Users</h1>
          {isAdmin && (
            <button className="btn btn-primary">+ Add User</button>
          )}
        </div>
        <p>Total users: {users.length}</p>
      </div>

      {/* Success Toast */}
      {success && (
        <div className="toast toast-success">
          <span>✓</span> {success}
        </div>
      )}

      {/* Error Alert */}
      {error && (
        <div className="alert alert-error">
          <span>⚠️</span> {error}
        </div>
      )}

      <div className="users-table-wrapper">
        <table className="users-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              {isAdmin && <th>Status</th>}
              {isAdmin && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
            {users.map((user) => (
              <tr key={user.id} className={currentUserId === user.id ? 'current-user' : ''}>
                <td className="name-cell">{user.username}</td>
                <td className="email-cell">{user.email}</td>
                <td className="role-cell">
                  {user.role === "admin" ? (
                    <span className="badge badge-admin">Admin</span>
                  ) : (
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user.id, e.target.value)}
                      className="role-select"
                      disabled={!isAdmin}
                    >
                      <option value="student">Student</option>
                      <option value="teacher">Teacher</option>
                    </select>
                  )}
                </td>
                {isAdmin && (
                  <td className="status-cell">
                    {user.role === "teacher" && (
                      <span className={`status-badge status-${user.teacher_status || 'pending'}`}>
                        {user.teacher_status ? user.teacher_status.charAt(0).toUpperCase() + user.teacher_status.slice(1) : 'Pending'}
                      </span>
                    )}
                    {user.role !== "teacher" && (
                      <span className="status-badge status-na">N/A</span>
                    )}
                  </td>
                )}
                {isAdmin && (
                  <td className="actions-cell">
                    {/* Approve/Reject buttons for pending teachers */}
                    {user.role === "teacher" && user.teacher_status === "pending" && (
                      <div className="action-buttons">
                        <button
                          className="btn btn-sm btn-success"
                          onClick={() => handleApproveTeacher(user)}
                          disabled={processing}
                          title="Approve teacher account"
                        >
                          ✓ Approve
                        </button>
                        <button
                          className="btn btn-sm btn-warning"
                          onClick={() => openRejectModal(user)}
                          disabled={processing}
                          title="Reject teacher account"
                        >
                          ✕ Reject
                        </button>
                      </div>
                    )}
                    
                    {/* Delete button for all users except current */}
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => openDeleteModal(user)}
                      disabled={currentUserId === user.id || deleting}
                      title={currentUserId === user.id ? "Cannot delete yourself" : "Delete user"}
                    >
                      🗑️ Delete
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal-overlay" onClick={closeDeleteModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Delete User</h2>
              <button className="modal-close" onClick={closeDeleteModal}>✕</button>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to delete <strong>{userToDelete?.username}</strong>?</p>
              <p className="modal-warning">⚠️ This action cannot be undone.</p>
            </div>
            <div className="modal-footer">
              <button
                className="btn btn-secondary"
                onClick={closeDeleteModal}
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                className="btn btn-danger"
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? "Deleting..." : "Delete User"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Confirmation Modal */}
      {showRejectModal && (
        <div className="modal-overlay" onClick={closeRejectModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Reject Teacher</h2>
              <button className="modal-close" onClick={closeRejectModal}>✕</button>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to reject <strong>{userToReject?.username}</strong>'s teacher account?</p>
              <p className="modal-warning">⚠️ They will not be able to access teacher features.</p>
            </div>
            <div className="modal-footer">
              <button
                className="btn btn-secondary"
                onClick={closeRejectModal}
                disabled={processing}
              >
                Cancel
              </button>
              <button
                className="btn btn-warning"
                onClick={handleRejectTeacher}
                disabled={processing}
              >
                {processing ? "Rejecting..." : "Reject Teacher"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageUsers;