from django.urls import path
from .views import TeacherDashboardSummary, TeacherCourseStats, StudentMyEnrollments, admin_dashboard_stats, teacher_dashboard_stats

urlpatterns = [
    path('teacher/summary/', TeacherDashboardSummary.as_view()),
    path('teacher/course-stats/', TeacherCourseStats.as_view()),
    path("teacher/summary/", TeacherDashboardSummary.as_view(), name="teacher-dashboard-summary"),
    path("teacher/course-stats/", TeacherCourseStats.as_view(), name="teacher-course-stats"),
    path("student/my-enrollments/", StudentMyEnrollments.as_view(), name="student-my-enrollments"),
    path("admin/stats/", admin_dashboard_stats, name="admin-dashboard-stats"),
    path("teacher/stats/", teacher_dashboard_stats, name="teacher-dashboard-stats"),
]