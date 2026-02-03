from django.urls import path
from .views import EnrollmentView, browse_courses, check_enrollment, course_students_count

urlpatterns = [
    # Enrollment CRUD
    path('', EnrollmentView.as_view()),
    
    # Browse and check enrollments
    path('courses/browse/', browse_courses, name='browse-courses'),
    path('courses/<int:course_id>/check/', check_enrollment, name='check-enrollment'),
    path('courses/<int:course_id>/students-count/', course_students_count, name='course-students-count'),
]