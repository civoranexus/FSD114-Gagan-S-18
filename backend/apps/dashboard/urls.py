from django.urls import path
from .views import TeacherDashboardSummary, TeacherCourseStats

urlpatterns = [
    path('summary/', TeacherDashboardSummary.as_view()),
    path('course-stats/', TeacherCourseStats.as_view()),
    path("summary/", TeacherDashboardSummary.as_view(), name="teacher-dashboard-summary"),
    path("course-stats/", TeacherCourseStats.as_view(), name="teacher-course-stats"),
]