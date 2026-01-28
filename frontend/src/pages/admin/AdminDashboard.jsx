import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TeacherApproval from "./TeacherApproval";
import "../../styles/dashboard-content.css";

/**
 * AdminDashboard Component
 * Renders the main dashboard content for admins
 * 
 * Features:
 * - Dashboard stats overview
 * - Quick action cards
 * - Teacher approval management
 * 
 * Note: This component is wrapped by DashboardLayout in App.js
 * The layout handles navbar, sidebar, and page structure
 */
function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalStudents: 0,
    totalTeachers: 0,
    totalCourses: 0,
    totalEnrollments: 0,
    pendingTeachers: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      setError("");
      
      const token = localStorage.getItem("access");
      if (!token) {
        setError("No authentication token found");
        setLoading(false);
        return;
      }

      const response = await fetch("http://127.0.0.1:8000/api/dashboard/admin/stats/", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch stats: ${response.statusText}`);
      }

      const data = await response.json();
      setStats({
        totalUsers: data.total_users,
        totalStudents: data.total_students,
        totalTeachers: data.total_teachers,
        totalCourses: data.total_courses,
        totalEnrollments: data.total_enrollments,
        pendingTeachers: data.pending_teachers,
      });
    } catch (err) {
      console.error("Error fetching dashboard stats:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    {
      id: 'create-course',
      title: 'Create Course',
      description: 'Add a new course to platform',
      icon: '➕',
      action: () => navigate('/admin/create-course'),
      color: 'action-green'
    },
    {
      id: 'users',
      title: 'Manage Users',
      description: 'Add, edit, or remove users',
      icon: '👥',
      action: () => navigate('/admin/users'),
      color: 'action-blue'
    },
    {
      id: 'courses',
      title: 'Manage Courses',
      description: 'Create and manage courses',
      icon: '📚',
      action: () => navigate('/admin/courses'),
      color: 'action-teal'
    },
    {
      id: 'reports',
      title: 'Reports',
      description: 'View platform analytics',
      icon: '📊',
      action: () => alert('Reports page coming soon'),
      color: 'action-purple'
    },
  ];

  return (
    <div className="dashboard-page">
      {/* Page Header */}
      <div className="page-header">
        <h1 className="page-title">Admin Dashboard</h1>
        <p className="page-subtitle">Manage the EduVillage platform</p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="alert alert-error">
          <span>⚠️ Error: {error}</span>
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="stats-section">
          <p className="loading-text">📊 Loading dashboard statistics...</p>
        </div>
      ) : (
        <>
      {/* Stats Section */}
          <section className="stats-section">
            <div 
              className="stat-card stat-card-clickable"
              onClick={() => navigate('/admin/users')}
              title="View all users"
            >
              <div className="stat-icon">👥</div>
              <div className="stat-content">
                <div className="stat-value">{stats.totalUsers}</div>
                <div className="stat-label">Total Users</div>
              </div>
            </div>
            <div 
              className="stat-card stat-card-clickable"
              onClick={() => navigate('/admin/users?role=student')}
              title="View all students"
            >
              <div className="stat-icon">👨‍🎓</div>
              <div className="stat-content">
                <div className="stat-value">{stats.totalStudents}</div>
                <div className="stat-label">Students</div>
              </div>
            </div>
            <div 
              className="stat-card stat-card-clickable"
              onClick={() => navigate('/admin/users?role=teacher')}
              title="View all teachers"
            >
              <div className="stat-icon">👨‍🏫</div>
              <div className="stat-content">
                <div className="stat-value">{stats.totalTeachers}</div>
                <div className="stat-label">Teachers</div>
              </div>
            </div>
            <div 
              className="stat-card stat-card-clickable"
              onClick={() => navigate('/admin/courses')}
              title="View all courses"
            >
              <div className="stat-icon">📚</div>
              <div className="stat-content">
                <div className="stat-value">{stats.totalCourses}</div>
                <div className="stat-label">Courses</div>
              </div>
            </div>
            <div 
              className="stat-card stat-card-clickable"
              onClick={() => navigate('/admin/enrollments')}
              title="View all enrollments"
            >
              <div className="stat-icon">📈</div>
              <div className="stat-content">
                <div className="stat-value">{stats.totalEnrollments}</div>
                <div className="stat-label">Enrollments</div>
              </div>
            </div>
            {stats.pendingTeachers > 0 && (
              <div className="stat-card stat-card-alert">
                <div className="stat-icon">⏳</div>
                <div className="stat-content">
                  <div className="stat-value">{stats.pendingTeachers}</div>
                  <div className="stat-label">Pending Teachers</div>
                </div>
              </div>
            )}
          </section>

          {/* Quick Actions */}
          <section className="dashboard-section">
            <h2 className="section-title">Quick Actions</h2>
            <div className="action-cards">
              {quickActions.map(action => (
                <button
                  key={action.id}
                  className={`action-card ${action.color}`}
                  onClick={action.action}
                >
                  <div className="card-icon">{action.icon}</div>
                  <div className="card-title">{action.title}</div>
                  <div className="card-description">{action.description}</div>
                  <div className="card-arrow">→</div>
                </button>
              ))}
            </div>
          </section>

          {/* Platform Status */}
          <section className="dashboard-section">
            <h2 className="section-title">Platform Status</h2>
            <div className="activity-placeholder">
              <p>All systems operational</p>
            </div>
          </section>

          {/* Teacher Approval Management */}
          <TeacherApproval />
        </>
      )}
    </div>
  );
}

export default AdminDashboard;