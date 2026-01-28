from django.shortcuts import render
from django.core.paginator import Paginator

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
        
        courses = Course.objects.filter(
            instructor=request.user
        ).order_by("-id")
        paginator = Paginator(courses, 5)  # 5 courses per page
        page_number = request.GET.get("page", 1)
        page_obj = paginator.get_page(page_number)
        
        data = []
    
        for course in page_obj:
            count = Enrollment.objects.filter(course=course).count()
            data.append({
                "course_id": course.id,
                "course_title": course.title,
                "enrolled_students": count
            })

        return Response({
         "count": paginator.count,
         "page": page_obj.number,
         "total_pages": paginator.num_pages,
         "results": data
        })
    
class StudentMyEnrollments(APIView):
    permission_classes = [IsAuthenticated, IsStudent]

    def get(self, request):
        enrollments = Enrollment.objects.filter(
            student=request.user
        ).order_by("-id")
        paginator = Paginator(enrollments, 5)
        page_number = request.GET.get("page", 1)
        page_obj = paginator.get_page(page_number)

        data = []
        for enrollment in page_obj:
            course = enrollment.course
            data.append({
                "course_id": course.id,
                "course_title": course.title,
                "instructor": course.instructor.username
            })

        return Response({
          "count": paginator.count,
          "page": page_obj.number,
          "total_pages": paginator.num_pages,
          "results": data
})