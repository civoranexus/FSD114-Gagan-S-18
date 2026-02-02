from django.db import models
from apps.users.models import User

class Course(models.Model):
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('published', 'Published'),
        ('archived', 'Archived'),
    ]
    
    title = models.CharField(max_length=255)
    description = models.TextField()
    duration = models.PositiveIntegerField(
        default=0,
        help_text="Duration in hours"
    )
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='draft',
        help_text="Course publication status"
    )
    instructor = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='courses'
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

class CourseContent(models.Model):
    CONTENT_TYPE_CHOICES = [
        ('video', 'Video'),
        ('pdf', 'PDF'),
        ('assignment', 'Assignment'),
        ('document', 'Document'),
        ('link', 'Link'),
        ('other', 'Other'),
    ]
    
    course = models.ForeignKey(
        Course,
        on_delete=models.CASCADE,
        related_name='content'
    )
    title = models.CharField(max_length=255)
    content_type = models.CharField(max_length=20, choices=CONTENT_TYPE_CHOICES)
    # Store uploaded files instead of just URLs
    file = models.FileField(upload_to='course_content/%Y/%m/%d/', null=True, blank=True)
    file_url = models.URLField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} - {self.course.title}"


class StudentCourseProgress(models.Model):
    student = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='course_progress'
    )
    course = models.ForeignKey(
        Course,
        on_delete=models.CASCADE,
        related_name='student_progress'
    )
    content = models.ForeignKey(
        CourseContent,
        on_delete=models.CASCADE,
        related_name='student_progress'
    )
    completed = models.BooleanField(default=False)
    completed_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        unique_together = ('student', 'content')
    
    def __str__(self):
        return f"{self.student.username} - {self.content.title}"


class AssignmentSubmission(models.Model):
    """
    Model to track student assignment submissions.
    
    Each submission is linked to:
    - A student (who submitted)
    - An assignment (CourseContent with type='assignment')
    - The course context
    - A submitted file
    - Submission timestamp
    """
    student = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='assignment_submissions'
    )
    assignment = models.ForeignKey(
        CourseContent,
        on_delete=models.CASCADE,
        related_name='submissions'
    )
    course = models.ForeignKey(
        Course,
        on_delete=models.CASCADE,
        related_name='student_submissions'
    )
    file = models.FileField(upload_to='submissions/%Y/%m/%d/')
    submitted_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        unique_together = ('student', 'assignment')
        ordering = ['-submitted_at']
    
    def __str__(self):
        return f"{self.student.username} - {self.assignment.title}"

class Certificate(models.Model):
    """
    Model to track course completion certificates.
    
    Issued when a student completes 100% of a course.
    Contains generated PDF certificate file.
    """
    student = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='certificates'
    )
    course = models.ForeignKey(
        Course,
        on_delete=models.CASCADE,
        related_name='student_certificates'
    )
    issued_at = models.DateTimeField(auto_now_add=True)
    certificate_file = models.FileField(upload_to='certificates/%Y/%m/%d/')
    
    class Meta:
        unique_together = ('student', 'course')
        ordering = ['-issued_at']
    
    def __str__(self):
        return f"Certificate - {self.student.username} - {self.course.title}"