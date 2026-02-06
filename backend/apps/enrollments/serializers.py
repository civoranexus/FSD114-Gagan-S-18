from rest_framework import serializers
from .models import Enrollment
from apps.courses.models import Course

class EnrollmentSerializer(serializers.ModelSerializer):
    student_id = serializers.IntegerField(source='student.id', read_only=True)
    student_username = serializers.CharField(source='student.username', read_only=True)
    course_id = serializers.IntegerField(source='course.id', read_only=True)
    course_title = serializers.CharField(source='course.title', read_only=True)
    course_instructor = serializers.CharField(source='course.instructor.username', read_only=True)
    
    class Meta:
        model = Enrollment
        fields = ['id', 'student_id', 'student_username', 'course_id', 'course_title', 'course_instructor', 'enrolled_at']
        read_only_fields = ['id', 'enrolled_at']

class CourseEnrollmentSerializer(serializers.ModelSerializer):
    """Serializer for courses with enrollment info"""
    instructor_name = serializers.CharField(source='instructor.username', read_only=True)
    is_enrolled = serializers.SerializerMethodField()
    
    class Meta:
        model = Course
        fields = ['id', 'title', 'description', 'instructor_name', 'created_at', 'is_enrolled']
    
    def get_is_enrolled(self, obj):
        """Check if current user is enrolled"""
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return Enrollment.objects.filter(
                student=request.user,
                course=obj
            ).exists()
        return False