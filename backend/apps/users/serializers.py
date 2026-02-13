from rest_framework import serializers
from .models import User
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework.exceptions import AuthenticationFailed

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    password_confirm = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('username', 'email', 'password', 'password_confirm', 'role', 
                  'qualification', 'subject', 'experience')

    def validate(self, data):
        """Validate that passwords match"""
        if data['password'] != data['password_confirm']:
            raise serializers.ValidationError({
                "password": "Passwords do not match"
            })
        return data

    def validate_role(self, value):
        """Ensure role is valid"""
        if value not in ['student', 'teacher', 'admin']:
            raise serializers.ValidationError("Invalid role")
        return value

    def create(self, validated_data):
        """Create user with role and teacher fields"""
        validated_data.pop('password_confirm')
        password = validated_data.pop('password')
        
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email'),
            password=password,
            role=validated_data.get('role', 'student'),
            qualification=validated_data.get('qualification'),
            subject=validated_data.get('subject'),
            experience=validated_data.get('experience')
        )
        
        # For teachers, set status to pending by default
        if user.role == 'teacher':
            user.teacher_status = 'pending'
            user.save()
        
        return user
    
class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)

        if not self.user.is_active:
            raise AuthenticationFailed("Your account has been blocked by admin")

        return data


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'role', 'teacher_status', 
                  'qualification', 'subject', 'experience')
        read_only_fields = ('id', 'role', 'teacher_status')