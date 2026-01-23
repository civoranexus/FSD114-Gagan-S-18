from django.urls import path
from .views import ProfileView, RegisterView, LoginView, user_profile

urlpatterns = [
    path('register/', RegisterView.as_view()),
    path('login/', LoginView.as_view()),
    path('profile/', ProfileView.as_view()),
    path('me/', user_profile),
]