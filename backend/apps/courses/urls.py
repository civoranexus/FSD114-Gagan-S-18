from django.urls import path
from .views import CourseListCreateView, CourseDetailView, AdminCreateCourseView
from .views import CourseUpdateDeleteView, CourseDeleteView
from .views import admin_courses_list, admin_delete_course
from .views import admin_assign_teacher, my_courses, course_detail, add_course_content, teacher_add_content_courses
from .views import student_my_courses, student_course_contents, mark_content_complete, student_course_progress
from .views import teacher_students_progress, teacher_course_submissions, submit_assignment, get_assignment_submission
from .views import generate_course_certificate, get_student_certificates, download_certificate

urlpatterns = [
    path("", CourseListCreateView.as_view()),
    path("<int:pk>/", CourseDetailView.as_view()),
    path("<int:course_id>/", CourseUpdateDeleteView.as_view()),
    path("<int:pk>/delete/", CourseDeleteView.as_view()),
    path("admin/create/", AdminCreateCourseView.as_view(), name='admin-create-course'),
    path("admin/courses/", admin_courses_list),
    path("admin/courses/<int:course_id>/delete", admin_delete_course),
    path("admin/courses/<int:course_id>/assign-teacher", admin_assign_teacher),
    path('teacher/my-courses/', my_courses, name='my-courses'),
    path('teacher/add-content-courses/', teacher_add_content_courses, name='teacher-add-content-courses'),
    path('teacher/<int:course_id>/', course_detail, name='course-detail'),
    path('teacher/<int:course_id>/content/', add_course_content, name='add-content'),
    path('teacher/<int:course_id>/students-progress/', teacher_students_progress, name='students-progress'),
    path('teacher/<int:course_id>/submissions/', teacher_course_submissions, name='course-submissions'),
    path('student/my-courses/', student_my_courses, name='student-my-courses'),
    path('student/<int:course_id>/contents/', student_course_contents, name='student-course-contents'),
    path('student/<int:content_id>/complete/', mark_content_complete, name='mark-complete'),
    path('student/<int:course_id>/progress/', student_course_progress, name='student-progress'),
    path('student/assignments/<int:assignment_id>/submit/', submit_assignment, name='submit-assignment'),
    path('student/assignments/<int:assignment_id>/submission/', get_assignment_submission, name='get-submission'),
    path('student/<int:course_id>/generate-certificate/', generate_course_certificate, name='generate-certificate'),
    path('student/certificates/', get_student_certificates, name='student-certificates'),
    path('student/certificates/<int:certificate_id>/download/', download_certificate, name='download-certificate'),
]

