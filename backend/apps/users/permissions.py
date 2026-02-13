from rest_framework.permissions import BasePermission


class IsTeacher(BasePermission):
    """
    Allows access only to users with role = teacher
    """

    def has_permission(self, request, view):
        return (
            request.user
            and request.user.is_authenticated
            and request.user.role == 'teacher'
        )
class IsStudent(BasePermission):
    """
    Allows access only to users with role = student
    """

    def has_permission(self, request, view):
        return (
            request.user
            and request.user.is_authenticated
            and request.user.role == 'student'
        )
    
class IsAdmin(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == "admin"