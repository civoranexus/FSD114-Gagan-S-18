from django.shortcuts import get_object_or_404
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.users.permissions import IsTeacher, IsAdmin
from .models import Course
from .serializers import CourseSerializer
from rest_framework.decorators import api_view, permission_classes
from apps.users.models import User


class CourseListCreateView(APIView):

    def get_permissions(self):
        if self.request.method == "GET":
            return [IsAuthenticated()]
        return [IsAuthenticated(), IsTeacher()]
    
    def get(self, request):
        courses = Course.objects.all()
        serializer = CourseSerializer(courses, many=True)
        return Response(serializer.data)

    def post(self, request):
        # Only teachers can create courses

        self.permission_classes = [IsAuthenticated, IsTeacher]
        serializer = CourseSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(instructor=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class CourseDetailView(APIView):
    permission_classes = [IsAuthenticated, IsTeacher]

    def put(self, request, pk):
        course = get_object_or_404(Course, pk=pk)

        # Ownership check
        if course.instructor != request.user:
            return Response(
                {"error": "You can update only your own courses"},
                status=status.HTTP_403_FORBIDDEN
            )

        serializer = CourseSerializer(course, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        course = get_object_or_404(Course, pk=pk)

        # Ownership check
        if course.instructor != request.user:
            return Response(
                {"error": "You can delete only your own courses"},
                status=status.HTTP_403_FORBIDDEN
            )

        course.delete()
        return Response(
            {"message": "Course deleted successfully"},
            status=status.HTTP_204_NO_CONTENT
        )
class CourseUpdateDeleteView(APIView):
    permission_classes = [IsAuthenticated]

    def get_object(self, course_id):
        try:
            return Course.objects.get(id=course_id)
        except Course.DoesNotExist:
            return None
    
    def put(self, request, course_id):
        course = self.get_object(course_id)

        if not course:
            return Response(
                {"error": "Course not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        # Role check
        if request.user.role != "teacher":
            return Response(
                {"error": "Only teachers can update courses"},
                status=status.HTTP_403_FORBIDDEN
            )

        # Ownership check
        if course.instructor != request.user:
            return Response(
                {"error": "You can update only your own courses"},
                status=status.HTTP_403_FORBIDDEN
            )

        serializer = CourseSerializer(course, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    def delete(self, request, course_id):
        course = self.get_object(course_id)

        if not course:
            return Response(
                {"error": "Course not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        if request.user.role != "teacher":
            return Response(
                {"error": "Only teachers can delete courses"},
                status=status.HTTP_403_FORBIDDEN
            )

        if course.instructor != request.user:
            return Response(
                {"error": "You can delete only your own courses"},
                status=status.HTTP_403_FORBIDDEN
            )

        course.delete()
        return Response(
            {"message": "Course deleted successfully"},
            status=status.HTTP_204_NO_CONTENT
        )
    
class CourseDeleteView(APIView):
    permission_classes = [IsAuthenticated, IsTeacher]

    def delete(self, request, pk):
        try:
            course = Course.objects.get(pk=pk)
        except Course.DoesNotExist:
            return Response(
                {"detail": "Course not found"},
                status=status.HTTP_404_NOT_FOUND
            )
        course.delete()
        return Response(
            {"message": "Course deleted successfully"},
            status=status.HTTP_200_OK
        )
    

@api_view(["GET"])
@permission_classes([IsAuthenticated, IsAdmin])
def admin_courses_list(request):
    courses = Course.objects.all()

    data = []
    for course in courses:
        data.append({
            "id": course.id,
            "title": course.title,
            "instructor": course.instructor.username if course.instructor else None
        })

    return Response(data)

@api_view(["DELETE"])
@permission_classes([IsAuthenticated, IsAdmin])
def admin_delete_course(request, course_id):
    course = get_object_or_404(Course, id=course_id)
    course.delete()

    return Response(
        {"message": "Course deleted successfully"},
        status=status.HTTP_200_OK
    )

 
 
@api_view(["PATCH"])
@permission_classes([IsAuthenticated, IsAdmin])
def admin_assign_teacher(request, course_id):
    course = get_object_or_404(Course, id=course_id)

    teacher_id = request.data.get("teacher_id")

    if not teacher_id:
        return Response(
            {"error": "teacher_id is required"},
            status=status.HTTP_400_BAD_REQUEST
        )

    teacher = get_object_or_404(User, id=teacher_id)

    if teacher.role != "teacher":
        return Response(
            {"error": "Only users with teacher role can be assigned"},
            status=status.HTTP_400_BAD_REQUEST
        )

    course.instructor = teacher
    course.save()

    return Response(
        {"message": "Teacher assigned successfully"},
        status=status.HTTP_200_OK
    )