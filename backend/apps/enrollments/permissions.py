from rest_framework.permissions import BasePermission

class IsStudent(BasePermission):
    """
    Allows access only to users with role = student
    """

    def has_permission(self, request, view):
        return (
            request.user
            and request.user.is_authenticated
            and request.user.role == "student"
        )