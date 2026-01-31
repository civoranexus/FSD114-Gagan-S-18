from django.urls import path
from .views import TeacherDashboardSummary, TeacherCourseStats, StudentMyEnrollments

urlpatterns = [
    path('teacher/summary/', TeacherDashboardSummary.as_view()),
    path('teacher/course-stats/', TeacherCourseStats.as_view()),
    path("teacher/summary/", TeacherDashboardSummary.as_view(), name="teacher-dashboard-summary"),
    path("teacher/course-stats/", TeacherCourseStats.as_view(), name="teacher-course-stats"),
    path("student/my-enrollments/", StudentMyEnrollments.as_view(), name="student-my-enrollments"),
]