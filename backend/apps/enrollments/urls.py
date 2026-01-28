from django.urls import path
from .views import EnrollmentView

urlpatterns = [
    path('', EnrollmentView.as_view()),
]