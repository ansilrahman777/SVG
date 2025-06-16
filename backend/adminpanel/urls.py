from django.urls import path
from .views import AdminLoginView, AdminLogoutView, AssignOrUpdatePermissionView, CreateUserView, ListUsersPermissionsView
from . import views

urlpatterns = [
    path('login/', AdminLoginView.as_view()),
    path('logout/', AdminLogoutView.as_view()),
    path('create-user/', CreateUserView.as_view()),
     path('users-permissions/', ListUsersPermissionsView.as_view(), name='users-permissions-list'),
    path('assign-permission/', AssignOrUpdatePermissionView.as_view(), name='assign-update-permission'),
    
    
    path('admin-comments/', views.AdminCommentListGroupedByPageView.as_view()),
    path('admin-comments-create/', views.AdminCommentListCreateView.as_view()),
    path('admin-comments/<int:pk>/', views.AdminCommentDetailView.as_view()),
    path('admin-comment-history/<int:comment_id>/', views.AdminCommentHistoryView.as_view()),

]
