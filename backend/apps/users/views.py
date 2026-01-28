from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import authenticate
from .serializers import RegisterSerializer
from .models import User
from .permissions import IsAdmin
from django.shortcuts import get_object_or_404

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_profile(request):
    user = request.user

    return Response({
        "id":user.id,
        "username": user.username,
        "role": user.role
    })

@api_view(["GET"])
@permission_classes([IsAuthenticated, IsAdmin])
def admin_users_list(request):
    users = User.objects.all()

    data = []
    for user in users:
        data.append({
            "id": user.id,
            "username": user.username,
            "role": user.role
        })

    return Response(data)


@api_view(["DELETE"])
@permission_classes([IsAuthenticated, IsAdmin])
def admin_delete_user(request, user_id):
    # Prevent admin from deleting self
    if request.user.id == user_id:
        return Response(
            {"error": "Admin cannot delete self"},
            status=status.HTTP_400_BAD_REQUEST
        )

    user = get_object_or_404(User, id=user_id)

    # Optional safety: prevent deleting other admins
    if user.role == "admin":
        return Response(
            {"error": "Cannot delete another admin"},
            status=status.HTTP_403_FORBIDDEN
        )

    user.delete()
    return Response(
        {"message": "User deleted successfully"},
        status=status.HTTP_200_OK
    )



@api_view(["PATCH"])
@permission_classes([IsAuthenticated, IsAdmin])
def admin_update_user_role(request, user_id):
    # Prevent admin from changing own role
    if request.user.id == user_id:
        return Response(
            {"error": "Admin cannot change own role"},
            status=status.HTTP_400_BAD_REQUEST
        )

    user = User.objects.get(id=user_id)

    # Prevent changing other admin roles
    if user.role == "admin":
        return Response(
            {"error": "Cannot change another admin role"},
            status=status.HTTP_403_FORBIDDEN
        )

    new_role = request.data.get("role")

    if new_role not in ["student", "teacher"]:
        return Response(
            {"error": "Invalid role"},
            status=status.HTTP_400_BAD_REQUEST
        )

    user.role = new_role
    user.save()

    return Response(
        {"message": "User role updated successfully"},
        status=status.HTTP_200_OK
    )



class RegisterView(APIView):
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"message": "User registered successfully"},
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        user = authenticate(username=username, password=password)
        if user:
            return Response({"message": "Login successful"}, status=status.HTTP_200_OK)
        return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)


class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({
            "username": request.user.username,
            "email": request.user.email,
            "role": request.user.role
        })