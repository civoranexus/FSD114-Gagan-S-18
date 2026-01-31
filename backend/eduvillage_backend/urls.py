from django.contrib import admin
from django.urls import path, include
from apps.users.views import CustomTokenObtainPairView



urlpatterns = [
    path('admin/', admin.site.urls),
    
]

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns += [
   
    path('api/token/refresh/', TokenRefreshView.as_view()),
    path('api/courses/', include('apps.courses.urls')),
    path('api/enrollments/', include('apps.enrollments.urls')),
    path('api/dashboard/', include('apps.dashboard.urls')),
    path('api/users/', include('apps.users.urls')),
    path('api/token/', CustomTokenObtainPairView.as_view()),

]
