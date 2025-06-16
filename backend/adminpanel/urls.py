from django.urls import path
from .views import AdminLoginView, AdminLogoutView, AssignOrUpdatePermissionView, CreateUserView, ListUsersPermissionsView

urlpatterns = [
    path('login/', AdminLoginView.as_view()),
    path('logout/', AdminLogoutView.as_view()),
    path('create-user/', CreateUserView.as_view()),
     path('users-permissions/', ListUsersPermissionsView.as_view(), name='users-permissions-list'),
    path('assign-permission/', AssignOrUpdatePermissionView.as_view(), name='assign-update-permission'),

]
