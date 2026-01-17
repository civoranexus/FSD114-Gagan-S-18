from django.urls import path
from .views import CourseListCreateView, CourseDetailView
from .views import CourseUpdateDeleteView, CourseDeleteView

urlpatterns = [
    path("", CourseListCreateView.as_view()),
    path("<int:pk>/", CourseDetailView.as_view()),
    path("<int:course_id>/", CourseUpdateDeleteView.as_view()),
    path("<int:pk>/delete/", CourseDeleteView.as_view()),
]
