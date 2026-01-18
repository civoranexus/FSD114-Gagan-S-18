from django.shortcuts import render

# Create your views here.

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from apps.users.permissions import IsTeacher, IsStudent
from apps.courses.models import Course
from apps.enrollments.models import Enrollment


class TeacherDashboardSummary(APIView):
    permission_classes = [IsAuthenticated, IsTeacher]

    def get(self, request):
        courses = Course.objects.filter(instructor=request.user)
        total_courses = courses.count()

        total_enrollments = Enrollment.objects.filter(
            course__in=courses
        ).count()

        return Response({
            "total_courses": total_courses,
            "total_enrollments": total_enrollments
        })


class TeacherCourseStats(APIView):
    permission_classes = [IsAuthenticated, IsTeacher]

    def get(self, request):
        courses = Course.objects.filter(instructor=request.user)
        data = []

        for course in courses:
            count = Enrollment.objects.filter(course=course).count()
            data.append({
                "course_id": course.id,
                "course_title": course.title,
                "enrolled_students": count
            })

        return Response(data)
    
class StudentMyEnrollments(APIView):
    permission_classes = [IsAuthenticated, IsStudent]

    def get(self, request):
        enrollments = Enrollment.objects.filter(student=request.user)

        data = []
        for enrollment in enrollments:
            course = enrollment.course
            data.append({
                "course_id": course.id,
                "course_title": course.title,
                "instructor": course.instructor.username
            })

        return Response(data)