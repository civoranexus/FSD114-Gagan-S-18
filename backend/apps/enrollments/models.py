from django.db import models

# Create your models here.

from django.db import models
from apps.users.models import User
from apps.courses.models import Course

class Enrollment(models.Model):
    student = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='enrollments'
    )
    course = models.ForeignKey(
        Course,
        on_delete=models.CASCADE,
        related_name='enrollments'
    )
    enrolled_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('student', 'course')

    def str(self):
        return f"{self.student.username} enrolled in {self.course.title}"