from django.urls import path
from .views import ProfileView, RegisterView, LoginView, user_profile, admin_users_list, admin_delete_user, admin_update_user_role

urlpatterns = [
    path('register/', RegisterView.as_view()),
    path('login/', LoginView.as_view()),
    path('profile/', ProfileView.as_view()),
    path('me/', user_profile),
    path('admin/users/', admin_users_list),
    path("admin/users/<int:user_id>/delete", admin_delete_user),
    path("admin/users/<int:user_id>/role", admin_update_user_role),
]