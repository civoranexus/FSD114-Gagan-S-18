from django.urls import path
from .views import CourseListCreateView, CourseDetailView
from .views import CourseUpdateDeleteView, CourseDeleteView
from .views import admin_courses_list, admin_delete_course
from .views import admin_assign_teacher

urlpatterns = [
    path("", CourseListCreateView.as_view()),
    path("<int:pk>/", CourseDetailView.as_view()),
    path("<int:course_id>/", CourseUpdateDeleteView.as_view()),
    path("<int:pk>/delete/", CourseDeleteView.as_view()),
    path("admin/courses/", admin_courses_list),
    path("admin/courses/<int:course_id>/delete", admin_delete_course),
    path("admin/courses/<int:course_id>/assign-teacher", admin_assign_teacher),

]
